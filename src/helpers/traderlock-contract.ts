import { ethers } from "ethers";
import Web3 from "web3";
import { ERC20Contract, TraderContract, RouterContract, TokenPairContract } from "../abi";
import { LoaderUtil } from "../components/Loader";
import { getAddresses } from "../constants";
import { convertWei } from "./convert-wei";
import { getTokenData } from "./token-data";
import TraderLockAPI from "./TraderLockAPI";

export interface TraderLockCurrentBalance {
  initialBalance: number;
  currentBalance: number;
  token: any;
  percent: number;
  invested?: number;
  fee?: number;
  currentBalanceUSD?: number;
}

export interface TraderlockContractHistory {
  from: {
    value: string;
    name: string;
    address: string;
  };
  to: {
    value: string;
    name: string;
    address: string;
  };
  date: string;
  tradeLockAddress: string;
  transactionHash: string;
}

export class TraderlockContract {
  contract;
  currencyContract;
  provider;
  signer;
  address: string;
  chainID;
  userAddress: string;
  routerAddress: string;
  lpTokens;

  constructor(address: string, provider, chainID, userAddress: string, lpTokens = []) {
    this.address = address;
    this.userAddress = userAddress;
    this.chainID = chainID;
    this.contract = new ethers.Contract(address, TraderContract, provider);
    this.provider = provider;
    this.signer = this.provider.getSigner();
    this.routerAddress = getAddresses(this.chainID).ROUTER;
    this.lpTokens = lpTokens;
    // this.generateCurrencyContract();
  }

  private generateCurrencyContract(currency: string) {
    return new ethers.Contract(currency, ERC20Contract, this.signer);
  }

  public async getCurrentBalance(row: any = {}, address = "") {
    let currentBal = 0;
    let invested = 0;
    // let tokenName = "-"
    let tokens = {};
    const period = await this.getPeriod();
    if (this.lpTokens.length > 0) {
      let tokenData = await this.getAllBalance();
      tokens = tokenData.tokens;
      const currency = await this.contract.participationToken();
      currentBal = +(tokenData.currentBal / tokens[currency.toLowerCase()].usdVal).toFixed(6);
      const initialVal = convertWei(await this.contract.totalInvestment());
      const currencyContract = new ethers.Contract(currency, ERC20Contract, this.provider);
      const tokenName = await currencyContract.symbol();
      if (period === "CLAIMING") {
        currentBal = convertWei(await this.contract.concludedTotalAmount());
      }
      if (address !== "") {
        let investedVal = convertWei(await this.contract.investedAmount(address));
        invested = investedVal * tokens[currency.toLowerCase()].usdVal;
      }
      const traderFee = await this.contract.traderFee();
      const collectedFee = ((currentBal - initialVal) * traderFee) / 100;
      const currentBalUSD = currentBal * tokens[currency.toLowerCase()].usdVal;
      return {
        initialBalance: +initialVal.toFixed(6),
        currentBalance: +currentBal.toFixed(6),
        token: tokenName,
        percent: +(initialVal > 0 ? ((currentBal - initialVal) * 100) / initialVal : 0).toFixed(4),
        invested,
        fee: currentBal > initialVal ? +collectedFee.toFixed(4) : 0,
        currentBalanceUSD: +currentBalUSD.toFixed(4),
      } as TraderLockCurrentBalance;
    }
  }

  public async getAllBalance() {
    let currentBal = 0;
    let tokens = {};
    if (this.lpTokens.length > 0) {
      for (let i = 0; i < this.lpTokens.length; i++) {
        tokens[this.lpTokens[i].token1.address.toLowerCase()] = {
          amount: 0,
          usdVal: 0,
          id: this.lpTokens[i].token1.id,
          name: this.lpTokens[i].token1.name,
        };
        tokens[this.lpTokens[i].token2.address.toLowerCase()] = {
          amount: 0,
          usdVal: 0,
          id: this.lpTokens[i].token2.id,
          name: this.lpTokens[i].token2.name,
        };
      }

      for (const key of Object.keys(tokens)) {
        let data = await getTokenData(tokens[key].id);
        tokens[key].usdVal = data.price;
        tokens[key].amount = convertWei(await this.generateCurrencyContract(key).balanceOf(this.address));
        currentBal += tokens[key].amount * tokens[key].usdVal;
      }
      return { tokens, currentBal };
    }
  }

  public async getTradingEndTime() {
    const fundingStartTime = (await this.contract.fundingStartTime()) * 1000;
    const fundingPeriod = (await this.contract.fundingPeriod()) * 1000;
    const tradingPeriod = (await this.contract.tradingPeriod()) * 1000;
    return {
      tradingEndTime: fundingPeriod + tradingPeriod + fundingStartTime,
      fundingEndTime: fundingPeriod + fundingStartTime,
      fundingStartTime: fundingStartTime,
    };
  }

  public async getPeriod() {
    // const isFundingActive = await this.contract.isFundingActive();
    const isTradingActive = await this.contract.isTradingActive();
    const isRewardActive = await this.contract.isRewardActive();
    const fundingStartTime = (await this.contract.fundingStartTime()) * 1000;

    if (isRewardActive) {
      return "CLAIMING";
    } else if (isTradingActive) return "TRADING";
    else if (fundingStartTime > Date.now()) return "FUTURE";
    else return "FUNDING";
  }

  public async swap(pair: string, amountIn, amountOutMin, flow, fromToken, toToken) {
    LoaderUtil.show();
    try {
      let swapContract = new ethers.Contract(this.address, TraderContract, this.signer);
      const tx = await swapContract.swap(
        this.routerAddress,
        pair,
        Web3.utils.toWei(amountIn.toString()),
        amountOutMin,
        (+(Date.now() / 1000).toFixed(0) + 300).toString(),
        flow === 1 ? true : false
      );
      const resp = await tx.wait();

      let data = resp.logs[5].data;
      const outAmount = this.calculateOut(data, flow === 1 ? true : false);
      await TraderLockAPI.saveTransactions({
        from: {
          value: amountIn,
          name: fromToken.name,
          address: fromToken.address,
        },
        to: {
          value: Web3.utils.fromWei(outAmount.toString()),
          name: toToken.name,
          address: toToken.address,
        },
        date: Date.now().toString(),
        tradeLockAddress: this.address,
        transactionHash: resp.transactionHash,
      });
      LoaderUtil.hide();
    } catch (e) {
      console.log(e);
      LoaderUtil.hide();
      throw new Error(e.message);
    }
  }

  public async getAmoutOutMin(amount: number, pair: string, flow, slippage: number) {
    const pairContract = new ethers.Contract(pair, TokenPairContract, this.provider);
    const reserves = await pairContract.getReserves();
    const routerContract = new ethers.Contract(this.routerAddress, RouterContract, this.provider);

    const amountOut = await routerContract.getAmountOut(
      Web3.utils.toWei(amount.toString()),
      flow === 1 ? reserves._reserve0 : reserves._reserve1,
      flow === 1 ? reserves._reserve1 : reserves._reserve0
    );
    return {
      amountMin: Math.floor(+amountOut * (1 - slippage / 100)),
      amountOut: Web3.utils.fromWei(amountOut.toString()),
    };
  }

  public async terminate() {
    let terminateContract = new ethers.Contract(this.address, TraderContract, this.signer);
    let tx;
    let period = await this.getPeriod();
    if (period === "TRADING") {
      tx = await terminateContract.concludeTradingPeriod();
    } else if (period === "FUNDING") {
      tx = await terminateContract.concludeFundingPeriod();
    }
    await tx.wait();
    window.location.reload();
  }

  public calculateOut(data: string, flow) {
    //Trim '0x' from beginning of string
    data = data.substring(2);
    let res = [];
    // Split trimmed string every 64 characters
    while (data.length > 0) {
      res.push(Number.parseInt(data.substring(0, 64), 16));
      data = data.substring(64);
    }
    return flow ? res[3] : res[2];
  }

  public async getInvestedAmount(address) {
    return convertWei(await this.contract.investedAmount(address));
  }

  public async getClaimedValue(address: string) {
    const initialVal = convertWei(await this.contract.totalInvestment());
    const finalVal = convertWei(await this.contract.concludedTotalAmount());
    const profitPercent = +(initialVal > 0 ? ((finalVal - initialVal) * 100) / initialVal : 0).toFixed(4);
    const investedVal = await this.getInvestedAmount(address);
    const claimingPeriodProfit = (investedVal * profitPercent) / 100;

    return investedVal + claimingPeriodProfit;
  }

  public async getCurrency() {
    const currency = await this.contract.participationToken();
    return currency;
  }
}
