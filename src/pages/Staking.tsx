import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import { useWeb3Context } from "../hooks";
import { getAddresses } from "../constants";
import { ERC20Contract, LPStakingContract } from "../abi";
import Web3 from "web3";
import { withLoader } from "../components/Loader";
import { convertWei } from "../helpers/convert-wei";
import { getTokenData } from "../helpers/token-data";

export default function Staking() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { provider, address, chainID, checkWrongNetwork, connect } = useWeb3Context();
  const signer = provider.getSigner();
  const addresses = getAddresses(chainID);
  const [info, setInfo] = useState({
    pending: "0",
    stacked: "0",
    totalStacked: "0",
    totalReward: "0",
  });
  const [endDate, setEndDate] = useState<Date>();

  const [isApproved, setIsApproved] = useState(false);
  const [price, setPrice] = useState<number>();
  const [aprPercent, setAprPercent] = useState<number>();

  const bettingContract = useMemo(
    () => new ethers.Contract(addresses.LP_STAKING_ADDRESS, LPStakingContract, provider),
    [addresses.LP_STAKING_ADDRESS, provider]
  );

  const getData = useCallback(async () => {
    const stakingToken = await bettingContract.stakingToken();
    const stakingTokenContract = new ethers.Contract(stakingToken, ERC20Contract, provider);
    const allowed = await stakingTokenContract.allowance(address, addresses.LP_STAKING_ADDRESS);
    setIsApproved(Number(allowed) > 0);
    const balance = await bettingContract.balanceOf(address);
    const bal = Web3.utils.fromWei(balance?.toString());

    const earnedValue = await bettingContract.earned(address);
    const earned = Web3.utils.fromWei(earnedValue?.toString());
    const totalSupply = convertWei(await bettingContract.totalSupply());
    const rewardRate = convertWei(await bettingContract.rewardRate());
    const rewardsDuration = Number(await bettingContract.rewardsDuration());
    const rewardPrice = (await getTokenData()).price; //TODO: add token here for coingecko
    const lpPrice = (await getTokenData()).price; //TODO: add lp token here for coingecko

    const apr = ((((rewardRate * rewardsDuration) / totalSupply) * 12 * rewardPrice) / (lpPrice * 100)).toFixed(4);
    setAprPercent(+apr);
    setInfo((prev) => ({
      ...prev,
      pending: (+earned).toFixed(2),
      stacked: (+bal).toFixed(2),
      totalReward: "0",
    }));
  }, [address, addresses.LP_STAKING_ADDRESS, bettingContract, provider]);

  useEffect(() => {
    if (!address) {
      return;
    }
    withLoader(getData);
  }, [address, bettingContract, getData]);

  useEffect(() => {
    withLoader(async () => {
      const totalSupplyVal = await bettingContract.totalSupply();
      const totalSupply = Web3.utils.fromWei(totalSupplyVal?.toString());

      setInfo((prev) => ({
        ...prev,
        totalStacked: (+totalSupply).toFixed(2),
      }));

      bettingContract.periodFinish().then((seconds) => {
        const endTime = new Date(Number(seconds) * 1000);
        setEndDate(endTime);
      });
    });
  }, [bettingContract]);

  const approve = async () => {
    const stakingToken = await bettingContract.stakingToken();
    const stakingTokenContract = new ethers.Contract(stakingToken, ERC20Contract, signer);
    const tx = await stakingTokenContract.approve(addresses.LP_STAKING_ADDRESS, ethers.constants.MaxInt256);
    await tx.wait();
    // alert('Approved');
    setIsApproved(true);
    withLoader(getData);
  };

  const stake = async () => {
    const stakingTokenContract = new ethers.Contract(addresses.LP_STAKING_ADDRESS, LPStakingContract, signer);
    const tx = await stakingTokenContract.stake(Web3.utils.toWei(price.toString()));
    await tx.wait();
    withLoader(getData);
  };

  const unstake = async () => {
    const stakingTokenContract = new ethers.Contract(addresses.LP_STAKING_ADDRESS, LPStakingContract, signer);
    const tx = await stakingTokenContract.withdraw(Web3.utils.toWei(price.toString()));
    await tx.wait();
    withLoader(getData);
  };

  const claim = async () => {
    const stakingTokenContract = new ethers.Contract(addresses.LP_STAKING_ADDRESS, LPStakingContract, signer);
    const tx = await stakingTokenContract.getReward();
    await tx.wait();
    withLoader(getData);
  };

  const countDays = () => {
    if (!endDate) {
      return "";
    }
    const date = new Date();
    const dayDiff = Math.floor((endDate.getTime() - date.getTime()) / 86400000);
    if (dayDiff > 0) {
      return `Pool Ends In ${dayDiff} days`;
    } else if (dayDiff === 0) {
      return "Pool Ends today";
    } else {
      return "";
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Box className="stkng_main_bx">
        <Container>
          <Typography component="h2" className="def_h2">
            Staking
          </Typography>
          <Box className="stkng_innr_bx">
            <Box className="top_stkng">
              <Box component="img" src="/img/staking_img.png" />
              <Typography component="h3">Stake ATH-BNB LP</Typography>
              <Typography>{countDays()}</Typography>
              <span className="green_bx">APR: {aprPercent ? aprPercent : 0}%</span>
            </Box>

            <Box className="mddl_stkng top_stkng">
              <Typography component="h3">{info.pending}</Typography>
              <Typography>Pending ATH</Typography>
              {!isApproved && (
                <Button className="def_yylw_btn" onClick={() => withLoader(approve)}>
                  Approve ATH
                </Button>
              )}
              {isApproved && (
                <Box display={"flex"} flexDirection="column" alignItems="center">
                  <Box className="inpt_bx def_inpt_btn" pt={2}>
                    <TextField
                      fullWidth
                      placeholder="Amount"
                      value={price || ""}
                      onChange={(e) => setPrice(+e.target.value)}
                    />
                  </Box>
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Button
                      style={{ padding: "8px 24px" }}
                      fullWidth
                      className="def_yylw_btn"
                      onClick={() => withLoader(stake)}
                    >
                      {" "}
                      Stake{" "}
                    </Button>
                    <Button
                      style={{ padding: "8px 24px" }}
                      fullWidth
                      className="def_yylw_btn"
                      onClick={() => withLoader(unstake)}
                    >
                      {" "}
                      UnStake{" "}
                    </Button>
                    <Button
                      style={{ padding: "8px 24px" }}
                      fullWidth
                      className="def_yylw_btn"
                      onClick={() => withLoader(claim)}
                    >
                      {" "}
                      Claim{" "}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
            <Box className="bttm_stkng">
              <Box className="same_cntnt">
                <Typography className="lght_txt">Pending Rewards</Typography>
                <Typography>{info.pending}</Typography>
              </Box>
              <Box className="same_cntnt">
                <Typography className="lght_txt">User Staked Amount</Typography>
                <Typography>{info.stacked}</Typography>
              </Box>
              <Box className="same_cntnt">
                <Typography className="lght_txt">Total Users Staked Amount</Typography>
                <Typography>{info.totalStacked}</Typography>
              </Box>
              <Box className="same_cntnt">
                <Typography className="lght_txt">Total Rewards To Distribute</Typography>
                <Typography>{info.totalReward}</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
