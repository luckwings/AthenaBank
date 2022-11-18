/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Container, Typography, Skeleton } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FundingPeriodPanel, { FundingPeriodPanelSkeleton } from "../components/DYORAreaDetail/FundingPeriodPanel";
import ClaimingPeriodPanel, { ClaimingPeriodPanelSkeleton } from "../components/DYORAreaDetail/ClaimingPeriodPanel";
import ProjectDetail, { ProjectDetailSkeleton } from "../components/DYORAreaDetail/ProjectDetail";
import DyorChart, { DyorChartSkeleton } from "../components/DYORAreaDetail/DyorChart";
import { ProjectDetailModel } from "../models/ProjectDetailModel";
import DyorChartDataModel from "../models/DyorChartDataModel";
import FundingPeriodDataModel from "../models/FundingPeriodDataModel";
import ClaimPeriodDataModel from "../models/ClaimPeriodDataModel";
import { ERC20Contract, IDOContract } from "../abi";
import { getAddresses } from "../constants";
import { useWeb3Context } from "../hooks";
import { ethers } from "ethers";
import Web3 from "web3";
import ProjectAPI from "../helpers/ProjectAPI";
import { LoaderUtil } from "../components/Loader";
import { convertWei } from "../helpers/convert-wei";
import { a11yProps, TabPanel } from "../components/TabPanel";
import { useSnackbar } from "notistack";
import { snackbarErrorMsg, snackbarMsg, snackbarSuccessMsg } from "../helpers/snackbar-helper";

async function getTokenContract(contract, provider) {
  const athToken = await contract.currency();
  const athTokenContract = new ethers.Contract(athToken, ERC20Contract, provider);
  return athTokenContract;
}

function getAddressFromURL(defaultAddress) {
  const params = new URLSearchParams(window.location.search);
  return params.get("address") || defaultAddress;
}

export default function DyorAreaDetail() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [value, setValue] = useState(0);
  const [dyorChartData, setDyorChartData] = useState<DyorChartDataModel>();
  const [fundPeriodData, setFundPeriodData] = useState<FundingPeriodDataModel>();
  const [claimPeriodData, setClaimPeriodData] = useState<ClaimPeriodDataModel>();
  const [projectDetail, setProjectDetail] = useState<ProjectDetailModel>();
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState(false);

  // --------- Web3 Start ----------
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { provider, address, chainID, checkWrongNetwork, connect } = useWeb3Context();
  const signer = provider.getSigner();
  const { IDO } = getAddresses(chainID);

  const contract = useMemo(() => new ethers.Contract(getAddressFromURL(IDO), IDOContract, provider), [IDO, provider]);
  // const tokenContract = useMemo(() => getTokenContract(contract, provider), [contract, provider]);
  // --------- Web3 End ----------

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getPageData = useCallback(async () => {
    if (!address) {
      return;
    }

    try {
      const currency = await contract.currency();
      const currencyContract = new ethers.Contract(currency, ERC20Contract, signer);
      const isAlreadyApproved = await currencyContract.allowance(address, getAddressFromURL(IDO));
      setIsApproved(Number(isAlreadyApproved) > 0);

      const projectDetail = await ProjectAPI.get(getAddressFromURL(IDO));
      setDyorChartData(projectDetail.chart);
      setProjectDetail(projectDetail);
      const openForLevels = [];
      const levelFeeReduction = [];
      for (const currentLvl of [3, 2, 1, 0]) {
        const canInvest = await contract.isParticipationTimeCrossed(currentLvl);
        const participationFee = await contract.participationFee(currentLvl);
        levelFeeReduction.unshift(Number(participationFee) / 100);
        if (canInvest) {
          openForLevels.push(currentLvl);
        }
      }
      const sales = await contract.sales(address);
      const currentLvl = await contract.getInvestorType(address);

      const fundingEnddate = Number(await contract.endTime()) * 1000;
      const fundingStartdate = Number(await contract.startTime()) * 1000;
      const isClaimingActive = fundingEnddate < Date.now();
      if (isClaimingActive) {
        setValue(2);
      }
      setFundPeriodData({
        ...projectDetail.periodData,
        raised: convertWei(await contract.totalFundRaised()),
        target: convertWei(await contract.totalAmount()),
        ratio: 1 / convertWei(await contract.price()),
        openForLevels,
        endDate: new Date(fundingEnddate),
        invested: convertWei(sales.allocatedAmount),
        feesPaid: convertWei(sales.feePaid),
        tokenAmount: convertWei(sales.amount),
        levelFeeReduction,
        currentLvl,
        fundingStartTime: new Date(fundingStartdate),
      });
      const investedAmount = convertWei(sales.amount);
      let readyToClaimAmount = 0;
      if (investedAmount) {
        readyToClaimAmount = convertWei(await contract.claimableAmount(address));
      }
      setClaimPeriodData({
        ...projectDetail.periodData,
        raised: convertWei(await contract.totalFundRaised()),
        target: convertWei(await contract.totalAmount()),
        reserved: convertWei(await contract.totalIDOTokenSupplied()),
        claimed: convertWei(sales.tokensWithdrawn),
        readyToClaim: readyToClaimAmount,
        levelFeeReduction,
        currentLvl,
      });
    } catch (e) {
      console.error(e);
      setError(true);
    }
  }, [IDO, address, contract, signer]);

  useEffect(() => {
    getPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const approve = useCallback(async () => {
    if (isApproved) {
      return;
    }
    enqueueSnackbar(snackbarMsg("Getting Approval..."), { persist: true });
    const currency = await contract.currency();
    const currencyContract = new ethers.Contract(currency, ERC20Contract, signer);
    const tx = await currencyContract.approve(getAddressFromURL(IDO), ethers.constants.MaxInt256);
    const receipt = await tx.wait();

    closeSnackbar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDO, contract, isApproved, signer]);

  const buy = useCallback(
    async (amount) => {
      LoaderUtil.show();
      try {
        await approve();
        enqueueSnackbar(snackbarMsg("Participating..."), { persist: true });
        const buyContract = new ethers.Contract(getAddressFromURL(IDO), IDOContract, signer);

        const tx = await buyContract.buy(Web3.utils.toWei(amount.toString()));
        await tx.wait();
        closeSnackbar();
        enqueueSnackbar(snackbarSuccessMsg("Participate Successful"));
      } catch (e) {
        console.error(e);
        closeSnackbar();
        enqueueSnackbar(snackbarErrorMsg(e, "Participating"));
      }
      LoaderUtil.hide();
      await getPageData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [IDO, approve, getPageData, signer]
  );

  const claim = useCallback(async () => {
    enqueueSnackbar(snackbarMsg("Claiming..."), { persist: true });
    LoaderUtil.show();
    try {
      const claimContract = new ethers.Contract(getAddressFromURL(IDO), IDOContract, signer);
      const tx = await claimContract.getReward();
      await tx.wait();
      closeSnackbar();
      enqueueSnackbar(snackbarSuccessMsg("Claim"));
    } catch (e) {
      console.error(e);
      closeSnackbar();
      enqueueSnackbar(snackbarErrorMsg(e, "Claim"));
    }
    LoaderUtil.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IDO, signer]);

  if (error) {
    return (
      <Box className="dyor_main_bx">
        <Container>
          <Box
            minWidth="100%"
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h3">Cannot fetch the data.</Typography>
            <Typography variant="h4">Please again try after some time.</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="dyor_main_bx">
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            {dyorChartData ? <DyorChart data={dyorChartData} /> : <DyorChartSkeleton />}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="cntr_bx">
              <Box className="def_tab" sx={{ width: "100%" }}>
                <Box>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                  >
                    <Tab label="Funding Period" {...a11yProps(0)} />
                    <Box className="arrw_bx">
                      <Box component="img" src="/img/chart_slct.svg" />
                    </Box>
                    <Tab label="Claiming Period" {...a11yProps(4)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  {fundPeriodData ? (
                    <FundingPeriodPanel data={fundPeriodData} onParticipate={(value) => buy(value)} />
                  ) : (
                    <FundingPeriodPanelSkeleton />
                  )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                  {claimPeriodData ? (
                    <ClaimingPeriodPanel data={claimPeriodData} onClaim={() => claim()} />
                  ) : (
                    <ClaimingPeriodPanelSkeleton />
                  )}
                </TabPanel>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            {projectDetail ? <ProjectDetail data={projectDetail} /> : <ProjectDetailSkeleton />}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
