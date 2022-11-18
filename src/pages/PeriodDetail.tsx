/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid, Container } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getAddresses } from "../constants";
import { useWeb3Context } from "../hooks";
import { a11yProps, TabPanel } from "../components/TabPanel";
import TraderProfile, { TraderProfileSkeleton } from "../components/TraderLock/TraderProfile";
import TraderFundingProfile, { TraderFundingProfileSkeleton } from "../components/TraderLock/TraderFundingProfile";
import TraderTradingPeriod, { TraderTradingPeriodSkeleton } from "../components/TraderLock/TraderTradingPeriod";
import TraderClaimingPeriod, { TraderClaimingPeriodSkeleton } from "../components/TraderLock/TraderClaimingPeriod";
import TraderContractDetail, { TraderContractDetailSkeleton } from "../components/TraderLock/TraderContractDetail";
import { getTraderInfo, TraderContractType } from "../helpers/trader-contract";
import { LoaderUtil, useLoader } from "../components/Loader";
import AthenaSkeleton from "../components/AthenaSkeleton";
import { useSnackbar } from "notistack";
import { snackbarErrorMsg, snackbarMsg, snackbarSuccessMsg } from "../helpers/snackbar-helper";
import { TraderlockContract } from "../helpers/traderlock-contract";
import TraderLockAPI from "../helpers/TraderLockAPI";

export default function PeriodDetail() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const profileLoader = useLoader(
    <>
      <AthenaSkeleton variant="rectangular" height={400} />
      <AthenaSkeleton variant="text" />
      <AthenaSkeleton variant="rectangular" height={320} />
    </>
  );
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [isActive, setActive] = useState(false);
  const [data, setData] = useState<TraderContractType>();

  const toggleClass = () => {
    setActive(!isActive);
  };
  const { provider, address, chainID, checkWrongNetwork, connect } = useWeb3Context();
  const { TRADER } = getAddresses(chainID);

  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    return getTraderInfo(TRADER, provider, address)
      .then((finalData) => {
        setData(finalData);
        if (finalData.isFundingActive) {
          setValue(0);
        }
        if (finalData.isTradingActive) {
          setValue(2);
        }
        if (finalData.isRewardActive) {
          setValue(4);
        }
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, [TRADER, address, provider]);

  useEffect(() => {
    if (!address) {
      return;
    }
    profileLoader.show();
    load().finally(() => {
      profileLoader.hide();
      closeSnackbar();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, address]);
  // }, [TRADER, address, provider, signer]);

  const isContributeDisabled =
    !data?.isFundingActive || data.fundingPeriodData.openForLevels.indexOf(data.fundingPeriodData.currentLvl) < 0;
  const isWithdrawAvailable = !data?.isFundingActive && !data?.isTradingActive && !data?.isRewardActive;

  const onContribute = (value: number) => {
    enqueueSnackbar(snackbarMsg("Contributing..."));
    LoaderUtil.show();
    data
      .buy(value)
      .then(() => {
        profileLoader.show();
        closeSnackbar();
        enqueueSnackbar(snackbarSuccessMsg("Contribute"));
        load();
      })
      .catch((e) => {
        console.error(e);
        closeSnackbar();
        enqueueSnackbar(snackbarErrorMsg(e, "Contributing"));
      })
      .finally(() => {
        LoaderUtil.hide();
        profileLoader.hide();
      });
  };

  const onWithdraw = () => {
    enqueueSnackbar(snackbarMsg("Withdrawing..."));
    LoaderUtil.show();
    data
      .withdraw()
      .then(() => {
        profileLoader.show();
        closeSnackbar();
        enqueueSnackbar(snackbarSuccessMsg("Withdraw"));
        load();
      })
      .catch((e) => {
        console.error(e);
        closeSnackbar();
        enqueueSnackbar(snackbarErrorMsg(e, "withdraw"));
      })
      .finally(() => {
        LoaderUtil.hide();
        profileLoader.hide();
      });
  };
  const onClaim = () => {
    enqueueSnackbar(snackbarMsg("Claiming..."));
    LoaderUtil.show();
    data
      .claim()
      .then(() => {
        profileLoader.show();
        closeSnackbar();
        enqueueSnackbar(snackbarSuccessMsg("Claim"));
        load();
      })
      .catch((e) => {
        closeSnackbar();
        enqueueSnackbar(snackbarErrorMsg(e, "Claiming"));
      })
      .finally(() => {
        LoaderUtil.hide();
        profileLoader.hide();
      });
  };

  const onTerminate = async () => {
    enqueueSnackbar(snackbarMsg("Terminating..."));
    LoaderUtil.show();
    let failedError;
    try {
      const contract = new TraderlockContract(
        data.tradelockData.contract,
        provider,
        chainID,
        address,
        data.tradelockData.lpTokenPair
      );
      await contract.terminate();
      LoaderUtil.hide();
      closeSnackbar();
      enqueueSnackbar(snackbarSuccessMsg("Terminate"));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      LoaderUtil.hide();
      closeSnackbar();
      enqueueSnackbar(snackbarErrorMsg(failedError, "Terminating"));
    }
  };

  const getProfileData = () => {
    let returnData = data.tradelockData.trader;
    returnData.contractAddress = data.tradelockData.contract;
    return returnData;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <Box height={"100vh"} display="flex" alignItems="center" justifyContent="center">
        Error while fetching data. Please Try again after sometime...
      </Box>
    );
  }

  let isTerminatePossible = false;

  if (data) {
    if (data.owner === address) {
      isTerminatePossible = true;
    } else {
      const dbData = data.tradelockData;
      if (dbData.trader.address === address) {
        isTerminatePossible = true;
      }
    }
  }

  const userInvested = {
    isLoading: profileLoader.loading,
    value: data?.traderInvestedAMount,
    token: data?.tradingPeriodData?.initial?.token,
  };

  return (
    <Box className="period_main_bx">
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            {profileLoader.loading && <TraderProfileSkeleton />}
            {!profileLoader.loading && data?.tradelockData?.trader && <TraderProfile data={getProfileData()} />}
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
                    <Tab disabled={!data?.isTradingActive} label="Trading Period" {...a11yProps(2)} />
                    <Box className="arrw_bx">
                      <Box component="img" src="/img/chart_slct.svg" />
                    </Box>
                    <Tab disabled={!data?.isRewardActive} label="Claiming Period" {...a11yProps(4)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  {profileLoader.loading && <TraderFundingProfileSkeleton />}
                  {!profileLoader.loading && data?.fundingPeriodData && (
                    <TraderFundingProfile
                      data={data.fundingPeriodData}
                      isContributeDisabled={isContributeDisabled}
                      isWithdrawAvailable={isWithdrawAvailable}
                      onContribute={onContribute}
                      onWithdraw={onWithdraw}
                      onTerminate={onTerminate}
                      isTerminatePossible={isTerminatePossible}
                    />
                  )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                  {profileLoader.loading && <TraderTradingPeriodSkeleton />}
                  {!profileLoader.loading && data?.tradingPeriodData && (
                    <TraderTradingPeriod data={data.tradingPeriodData} />
                  )}
                </TabPanel>
                <TabPanel value={value} index={4}>
                  {profileLoader.loading && <TraderClaimingPeriodSkeleton />}
                  {!profileLoader.loading && data?.claimingPeriodData && (
                    <TraderClaimingPeriod data={data.claimingPeriodData} onClaim={onClaim} />
                  )}
                </TabPanel>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            {profileLoader.loading && <TraderContractDetailSkeleton />}
            {!profileLoader.loading && data?.tradelockData.contractDetails && (
              <TraderContractDetail
                data={data.tradelockData.contractDetails}
                address={data.tradelockData.contract}
                userInvested={userInvested}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
