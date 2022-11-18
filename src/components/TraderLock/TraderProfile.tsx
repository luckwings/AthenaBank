import { Box, Button, IconButton, Typography } from "@mui/material";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { TraderContract } from "../../abi";
import { TraderlockContract, TraderLockCurrentBalance } from "../../helpers/traderlock-contract";
import TraderLockAPI from "../../helpers/TraderLockAPI";
import { useWeb3Context } from "../../hooks";
import { useAsyncRender } from "../../hooks/useApi";
import { TraderProfileData } from "../../models/TraderProfileData";
import AthenaSkeleton from "../AthenaSkeleton";

export default function TraderProfile({ data }: { data: TraderProfileData }) {
  const { provider, address, chainID } = useWeb3Context();
  const contractsUI = useAsyncRender(async () => {
    const traderlocks = await TraderLockAPI.getAll();
    return traderlocks.filter((item) => item.trader.address === data.address);
  }, []);

  const pastContractProfitUI = useAsyncRender(async () => {
    let traderlocks = await TraderLockAPI.getAll();
    traderlocks = traderlocks.filter(
      (item) => item.trader.address === data.address && item.contract !== data.contractAddress
    );
    let lastTraderLock;
    let contractEndDate = 0;
    for (let traderlock of traderlocks) {
      let enddate = 0;
      let contract = new TraderlockContract(traderlock.contract, provider, chainID, address, traderlock.lpTokenPair);
      let period = await contract.getPeriod();
      if (period === "CLAIMING") {
        enddate = (await contract.getTradingEndTime()).tradingEndTime;
      }
      if (enddate > contractEndDate) {
        lastTraderLock = traderlock;
      }
    }
    if (lastTraderLock) {
      let contract = new TraderlockContract(
        lastTraderLock.contract,
        provider,
        chainID,
        address,
        lastTraderLock.lpTokenPair
      );
      let data = await contract.getCurrentBalance();
      return data;
    }
    return { token: "" } as TraderLockCurrentBalance;
  }, []);

  const LINK_BTNS = [
    { link: "/img/unvrs_ic.svg", url: data.socials.website },
    { link: "/img/Facebook.svg", url: data.socials.facebook },
    { link: "/img/twttr_ic_02.svg", url: data.socials.twitter },
    { link: "/img/Insta.svg", url: data.socials.instagram },
    { link: "/img/tlgrm_ic_02.svg", url: data.socials.telegram },
    { link: "/img/discord.svg", url: data.socials.discord },
    { link: "/img/YouTube.svg", url: data.socials.youtube },
    { link: "/img/Twitch.svg", url: data.socials.twitch },
    { link: "/img/doc_ic.svg", url: data.socials.linkedIn },
    { link: "/img/trading_view.svg", url: data.socials.tradingview },
  ].filter((item) => !!item.url);
  return (
    <Box className="Jnnylv_bx">
      <Box component="img" className="trader_img" pt={4} src={data.image} />
      <Box className="hdng_bx">
        <Typography component="h4">
          <Link to={`/traderlockhistory/${data.address}`} style={{ color: "white" }}>
            {data.username}
          </Link>
        </Typography>
        <Typography>
          {data.name} | {data.age} Y | {data.location}
        </Typography>
        <Typography className="lght_txt"> {data.description} </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" px={4} pb={4} gap={4}>
          <IconButton className="def_yylw_btn" onClick={() => navigator.share({ url: document.location.href })}>
            <svg style={{ height: 24, width: 24 }} viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </IconButton>
          <Typography component="span" color="#ffaa28">
            LEVEL {data.level}
          </Typography>
        </Box>
      </Box>
      <Box className="social_bx social_bx2" px={3} style={{ paddingBottom: 16 }}>
        {LINK_BTNS.map((link, index) => (
          <Box component="a" href={link.url} key={index}>
            <Box component="img" src={link.link} height={36} width={36} />
          </Box>
        ))}
      </Box>
      {/* <Box className="sbeln_bx">
        <Typography>Profit Score (on the last contract)</Typography>
        <Box className="innr_bx">
          {pastContractProfitUI(
            <AthenaSkeleton width={120} />,
            (data2) => (
              <Box className="img_bx">
                {data2.token !== "" && <Box component="img" src={data.profitScore.image} />}
                <Typography component="h6">{data2.token !== "" ? data2.token : "No Past Contracts"}</Typography>
              </Box>
            ),
            (e) => (
              <>{e.message}</>
            )
          )}
        </Box>
      </Box> */}
      <Box className="sbeln_bx">
        <Typography>Total Raised Funds</Typography>
        {pastContractProfitUI(
          <AthenaSkeleton width={120} />,
          (data) => (
            <Box className="innr_bx">
              <Typography component="h5">
                {data.token !== "" ? "$" + data.currentBalanceUSD! : "No Past Contracts"}
              </Typography>
              {data.token !== "" && (
                <Typography component="h4" className={data.percent < 0 ? "red_txt" : ""}>
                  {data.token !== "" ? (data.percent >= 0 ? "+" : "") : ""}
                  {data.token !== "" ? data.percent : ""}%
                </Typography>
              )}
            </Box>
          ),
          (e) => (
            <>{e.message}</>
          )
        )}
      </Box>
      <Box className="sbeln_bx">
        <Box className="innr_bx">
          <Box>
            <Typography>Trader History</Typography>
            <Typography component="h5">
              {contractsUI(
                <AthenaSkeleton width={120} />,
                (data) => (
                  <>{data.length === 1 ? "No Past Contracts" : `${data.length - 1} Contracts`} </>
                ),
                (e) => (
                  <>{e.message}</>
                )
              )}
            </Typography>
          </Box>
          <Link to={`/traderlockhistory/${data.address}`}>
            <Box className="def_yylw_btn" px={4} py={0.5} lineHeight={1.25} fontWeight={600} textAlign="center">
              View
            </Box>
          </Link>
        </Box>
      </Box>
      {/* <Box className="sbeln_bx" display="flex" justifyContent="center">
        <Button className="def_yylw_btn" onClick={() => navigator.share({ url: document.location.href })}>
          <svg style={{ height: 24, width: 24 }} viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          <Typography mx={1} mt={0.25} component="span" fontWeight={600} color="black">
            Share
          </Typography>
        </Button>
      </Box> */}
    </Box>
  );
}

export const TraderProfileSkeleton = () => {
  return (
    <Box className="Jnnylv_bx">
      <Box pt={4}>
        <AthenaSkeleton variant="rectangular" height={150} width={150} sx={{ mx: "auto", mb: 5, borderRadius: 4 }} />
      </Box>
      <Box className="hdng_bx">
        <Typography component="h4" display="flex" justifyContent="center" alignItems="center" gutterBottom>
          <AthenaSkeleton variant="rectangular" height={36} width={120} />
        </Typography>
        <Typography display="flex" justifyContent="center" alignItems="center" gap={1} gutterBottom>
          <AthenaSkeleton variant="rectangular" height={20} width={60} />|
          <AthenaSkeleton variant="rectangular" height={20} width={40} />|
          <AthenaSkeleton variant="rectangular" height={20} width={50} />
        </Typography>
        <Typography gutterBottom className="lght_txt" display="flex" justifyContent="center" alignItems="center">
          <AthenaSkeleton variant="rectangular" height={20} width={"100%"} />
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" px={4} pb={4} gap={4}>
        <AthenaSkeleton variant="circular" height={24} width={24} sx={{ mx: 1 }} />
        <AthenaSkeleton variant="rectangular" height={24} width={100} sx={{ mx: 1 }} />
      </Box>
      <Box className="social_bx" flexWrap="wrap" px={3} style={{ paddingBottom: 16 }}>
        {[1, 2, 3, 4].map((link) => (
          <Box key={link} display="flex" justifyContent="center" alignItems="center" gap={3}>
            <AthenaSkeleton variant="circular" height={36} width={36} sx={{ mx: 1 }} />
          </Box>
        ))}
      </Box>
      {/* <Box className="sbeln_bx">
        <Typography gutterBottom>Profit Score (on the last contract)</Typography>
        <Box className="innr_bx">
          <Box className="img_bx">
            <AthenaSkeleton variant="circular" height={36} width={36} sx={{ mr: 1 }} />
            <AthenaSkeleton variant="rectangular" height={36} width={100} />
          </Box>
          <Typography component="h4">
            <AthenaSkeleton variant="rectangular" height={36} width={100} />
          </Typography>
        </Box>
      </Box> */}
      <Box className="sbeln_bx">
        <Typography gutterBottom>Total Raised Funds</Typography>
        <Box className="innr_bx">
          <Typography component="h5">
            <AthenaSkeleton variant="rectangular" height={36} width={140} />
          </Typography>
          <Typography component="h4">
            <AthenaSkeleton variant="rectangular" height={36} width={100} />
          </Typography>
        </Box>
      </Box>
      <Box className="sbeln_bx">
        <Typography gutterBottom>Trader History</Typography>
        <Box className="innr_bx">
          <Typography component="h5">
            <AthenaSkeleton variant="rectangular" height={36} width={140} />
          </Typography>
          <Typography component="h4">
            <AthenaSkeleton variant="rectangular" height={36} width={100} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
