import { ethers } from "ethers";
import { TraderContract, ERC20Contract, ATHLevelContract } from "../abi";
import { TraderFundingProfileData } from "../models/TraderFundingProfileData";
import { TraderLockData } from "../models/TraderLockData";
import { TraderTradingPeriodData } from "../models/TraderTradingPeriodData";
import { TraderClaimingPeriodData } from "../models/TraderClaimingPeriodData";
import { convertWei } from "./convert-wei";
import TraderLockAPI from "./TraderLockAPI";
import Web3 from "web3";
import { getTokenData } from "./token-data";
import { toFixed4 } from "./toFixed4";
import UserAPI from "./userAPI";
import { base64ToHex } from "./hex-64";

function getAddressFromURL(defaultAddress) {
  const params = new URLSearchParams(window.location.search);
  return params.get("contract") || defaultAddress;
}

function generateCurrencyContract(currency: string, signer) {
  return new ethers.Contract(currency, ERC20Contract, signer);
}

export async function getTraderInfo(
  defaultAddress: string,
  provider: ethers.providers.JsonRpcProvider,
  address: string
): Promise<TraderContractType> {
  const urlAddress = getAddressFromURL(defaultAddress);
  if (!urlAddress || !address) {
    return;
  }
  const signer = provider.getSigner();
  const tradelockData = await TraderLockAPI.get(urlAddress);
  const contract = new ethers.Contract(urlAddress, TraderContract, provider);
  const currency = await contract.participationToken();
  const currencyContract = new ethers.Contract(currency, ERC20Contract, signer);
  const tokenName = await currencyContract.symbol();
  let isAlreadyApproved = 0;
  try {
    isAlreadyApproved = await currencyContract.allowance(address, urlAddress);
  } catch (e) {}
  const openForLevels = [];
  const levelFeeReduction = [];
  const fundingStartTime = (await contract.fundingStartTime()) * 1000;
  const fundingPeriod = (await contract.fundingPeriod()) * 1000;
  const tradingPeriod = (await contract.tradingPeriod()) * 1000;
  let claimingPeriod = 0;

  try {
    claimingPeriod = (await contract.claimingPeriod()) * 1000;
  } catch (e) {}

  for (const currentLvl of [3, 2, 1, 0]) {
    const canInvest = await contract.isFundingActiveForAthLevel(currentLvl);
    const participationFee = await contract.athLevelFee(currentLvl);
    levelFeeReduction.unshift(Number(participationFee));
    if (canInvest) {
      openForLevels.push(currentLvl);
    }
  }

  const LP_LEVEL_ADDRESS = await contract.athLevel();
  const athContract = new ethers.Contract(LP_LEVEL_ADDRESS, ATHLevelContract, provider);
  const balance = convertWei(await currencyContract.balanceOf(urlAddress));
  const level = await athContract.athLevel(address);
  const raised = convertWei(await contract.totalInvestment());
  // const endTime = await athContract.getTradingEndTime();
  // console.log(endTime);
  tradelockData.trader.level = Math.floor(+(await athContract.athLevel(tradelockData.trader.address)));
  const fundingPeriodData: TraderFundingProfileData = {
    raised: raised,
    target: convertWei(await contract.fundingCap()),
    token: tokenName,
    contribution: {
      min: convertWei(await contract.minContribution()),
    },
    fundingStartTime: new Date(fundingStartTime),
    maxAmountAvailable: convertWei(await currencyContract.balanceOf(address)),
    endDate: new Date(fundingStartTime + fundingPeriod),
    claimingPeriod: fundingPeriod + tradingPeriod + fundingStartTime,
    contributedAmount: convertWei(await contract.investedAmount(address)),
    levelFeeReduction: levelFeeReduction,
    currentLvl: Math.floor(+level),
    openForLevels: openForLevels,
    isApproved: Number(isAlreadyApproved) > 0,
    traderAddress: tradelockData.trader.address,
  };

  let initialBal = 0;
  let currentBal = 0;
  let invested = 0;
  let investedVal = 0;
  // let tokenName = "-"
  let tokens = {};
  if (tradelockData.lpTokenPair.length > 0) {
    for (let i = 0; i < tradelockData.lpTokenPair.length; i++) {
      tokens[tradelockData.lpTokenPair[i].token1.address.toLowerCase()] = {
        amount: 0,
        usdVal: 0,
        id: tradelockData.lpTokenPair[i].token1.id,
        name: tradelockData.lpTokenPair[i].token1.name,
      };
      tokens[tradelockData.lpTokenPair[i].token2.address.toLowerCase()] = {
        amount: 0,
        usdVal: 0,
        id: tradelockData.lpTokenPair[i].token2.id,
        name: tradelockData.lpTokenPair[i].token2.name,
      };
    }
    for (const key of Object.keys(tokens)) {
      let data = await getTokenData(tokens[key].id);
      tokens[key].usdVal = data.price;
      tokens[key].amount = convertWei(await generateCurrencyContract(key, signer).balanceOf(urlAddress));
      currentBal += tokens[key].amount * tokens[key].usdVal;
    }
    const currency = await contract.participationToken();
    const initialVal = convertWei(await contract.totalInvestment());
    initialBal = initialVal * tokens[currency.toLowerCase()].usdVal;
    investedVal = convertWei(await contract.investedAmount(address));
    invested = investedVal * tokens[currency.toLowerCase()].usdVal;
  }
  let profit = currentBal - initialBal;
  const traderFee = await contract.traderFee();
  const athenaFee = await contract.athLevelFee(level);

  let profitPercent = toFixed4(currentBal > 0 ? (profit * 100) / initialBal : -100);
  profit = toFixed4((invested * profitPercent) / 100);
  const tradingPeriodData = {
    balance: currentBal / tokens[currency.toLowerCase()].usdVal,
    token: tokenName,
    percent: profitPercent,
    initial: {
      value: investedVal,
      token: tokenName,
    },
    expectedGain: {
      value: profit / tokens[currency.toLowerCase()].usdVal,
      token: tokenName,
      percent: profitPercent,
    },
    endDate: new Date(fundingStartTime + fundingPeriod + tradingPeriod),
    levelFeeReduction: levelFeeReduction,
    currentLvl: Math.floor(+level),
  };

  const initialVal = convertWei(await contract.totalInvestment());
  const finalVal = convertWei(await contract.concludedTotalAmount());
  let claimedAmount = 0;

  try {
    claimedAmount = convertWei(await contract.userClaimedAmount(address));
  } catch (e) {}

  profitPercent = +(initialVal > 0 ? ((finalVal - initialVal) * 100) / initialVal : 0).toFixed(4);
  const claimingPeriodProfit = (investedVal * profitPercent) / 100;
  const fee = claimingPeriodProfit > 0 ? (claimingPeriodProfit * athenaFee) / 100 : 0;
  // const fee =
  //   claimingPeriodProfit > 0 ? (claimingPeriodProfit * traderFee) / 100 + (claimingPeriodProfit * athenaFee) / 100 : 0;
  const claimingPeriodData: TraderClaimingPeriodData = {
    balance: +finalVal.toFixed(6),
    token: tokenName,
    percent: profitPercent,
    initial: {
      value: +investedVal.toFixed(6),
      token: tokenName,
    },
    claimingPeriod: fundingPeriod + tradingPeriod + fundingStartTime + claimingPeriod,
    claimedAmount,
    expectedGain: {
      value: +claimingPeriodProfit.toFixed(6),
      token: tokenName,
      percent: profitPercent,
    },
    claimed: {
      value: investedVal + claimingPeriodProfit,
      token: tokenName,
    },
    fees: {
      value: fee,
      token: tokenName,
    },
    received: {
      value: investedVal + claimingPeriodProfit - fee,
      token: tokenName,
    },
    levelFeeReduction: levelFeeReduction,
    currentLvl: Math.floor(+level),
  };

  const approve = async () => {
    if (Number(isAlreadyApproved) > 0) {
      return;
    }
    const currency = await contract.participationToken();
    const currencyContract = new ethers.Contract(currency, ERC20Contract, signer);
    const tx = await currencyContract.approve(getAddressFromURL(urlAddress), ethers.constants.MaxInt256);
    const receipt = await tx.wait();
  };

  const buy = async (amount) => {
    const referrer = await UserAPI.get(address).then((user) => {
      if (user.referrer) {
        return base64ToHex(user.referrer);
      } else {
        return "0x0000000000000000000000000000000000000000";
      }
    });
    await approve();
    const buyContract = new ethers.Contract(urlAddress, TraderContract, signer);
    const tx = await buyContract.invest(Web3.utils.toWei(amount.toString()), referrer);
    const receipt = await tx.wait();
  };

  const claim = async () => {
    const claimContract = new ethers.Contract(urlAddress, TraderContract, signer);
    const tx = await claimContract.harvestReward();
    const receipt = await tx.wait();
  };

  const withdraw = async () => {
    const claimContract = new ethers.Contract(urlAddress, TraderContract, signer);
    const tx = await claimContract.withdraw();
    await tx.wait();
  };

  const swap = async (
    router: string,
    pair: string,
    amountIn: number,
    amountOutMin: number,
    timeLimit: number,
    flow: boolean
  ) => {
    try {
      const tx = await contract.swap(router, pair, amountIn, amountOutMin, timeLimit, flow);
    } catch (e) {
      console.error(e);
    }
  };

  const owner = await contract.owner();

  return {
    owner,
    tradelockData,
    fundingPeriodData,
    tradingPeriodData,
    claimingPeriodData,
    isApproved: Number(isAlreadyApproved) > 0,
    isFundingActive: await contract.isFundingActive(),
    isTradingActive: await contract.isTradingActive(),
    isRewardActive: await contract.isRewardActive(),
    traderInvestedAMount: convertWei(await contract.investedAmount(await contract.trader())),
    buy,
    claim,
    withdraw,
    swap,
  };
}

export type TraderContractType = {
  owner: string;
  tradelockData: TraderLockData;
  fundingPeriodData: TraderFundingProfileData;
  tradingPeriodData: TraderTradingPeriodData;
  claimingPeriodData: TraderClaimingPeriodData;
  isApproved: boolean;
  isFundingActive: boolean;
  isTradingActive: boolean;
  isRewardActive: boolean;
  traderInvestedAMount: number;
  buy: (amount: any) => Promise<void>;
  claim: () => Promise<void>;
  withdraw: () => Promise<void>;
  swap: (
    router: string,
    pair: string,
    amountIn: number,
    amountOutMin: number,
    timeLimit: number,
    flow: boolean
  ) => Promise<void>;
};
