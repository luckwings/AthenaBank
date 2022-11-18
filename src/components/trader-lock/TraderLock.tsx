import { Box, Typography, Button } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { ERC20Contract, TraderContract } from "../../abi";
import { convertWei } from "../../helpers/convert-wei";
import { getTokenData } from "../../helpers/token-data";
import { useWeb3Context } from "../../hooks";
import { TraderLockData, TraderLockTagProp } from "../../models/TraderLockData";
import AthenaSkeleton from "../AthenaSkeleton";

async function fetchActualBal(data: TraderLockData, provider) {
  const signer = await provider.getSigner();
  const contract = await new ethers.Contract(data.contract, TraderContract, provider);
  // const currency = await contract.participationToken();
  // const currencyContract = await new ethers.Contract(currency, ERC20Contract, signer);
  // const balance = convertWei(await currencyContract.balanceOf(data.contract));
  const isTradingActive = await contract.isTradingActive();
  const isRewardActive = await contract.isRewardActive();
  const fundingStartTime = (await contract.fundingStartTime()) * 1000;
  let period;
  let currentBal = 0;
  let currentTokenBal = 0;
  const currency = await contract.participationToken();
  const currencyContract = new ethers.Contract(currency, ERC20Contract, signer);
  const tokenName = await currencyContract.symbol();
  const initialVal = convertWei(await contract.totalInvestment());
  const fundingCap = convertWei(await contract.fundingCap());
  if (data.lpTokenPair.length > 0) {
    let tokens = {};
    for (let i = 0; i < data.lpTokenPair.length; i++) {
      tokens[data.lpTokenPair[i].token1.address.toLowerCase()] = {
        amount: 0,
        usdVal: 0,
        id: data.lpTokenPair[i].token1.id,
        name: data.lpTokenPair[i].token1.name,
      };
      tokens[data.lpTokenPair[i].token2.address.toLowerCase()] = {
        amount: 0,
        usdVal: 0,
        id: data.lpTokenPair[i].token2.id,
        name: data.lpTokenPair[i].token2.name,
      };
    }
    for (const key of Object.keys(tokens)) {
      let tokenData = await getTokenData(tokens[key].id);
      tokens[key].usdVal = tokenData.price;
      let currencyContract = new ethers.Contract(key, ERC20Contract, signer);
      tokens[key].amount = convertWei(await currencyContract.balanceOf(data.contract));
      currentBal += tokens[key].amount * tokens[key].usdVal;
    }
    currentTokenBal = currentBal / tokens[currency.toLowerCase()].usdVal;
  }
  const finalBal = convertWei(await contract.concludedTotalAmount());
  const finalPercent = +(initialVal > 0 ? ((finalBal - initialVal) * 100) / initialVal : 0).toFixed(4);
  const profitPercent = +(initialVal > 0 ? ((currentTokenBal - initialVal) * 100) / initialVal : 0).toFixed(4);
  if (isRewardActive) period = "CLAIMING";
  else if (isTradingActive) period = "TRADING";
  else if (fundingStartTime > Date.now()) period = "FUTURE";
  else period = "FUNDING";
  return {
    currentBal: period === "CLAIMING" ? finalBal : currentTokenBal,
    period,
    profitPercent: period === "CLAIMING" ? finalPercent : profitPercent,
    tokenName,
    fundingBal: (period = "FUNDING" ? fundingCap : initialVal),
  };
}

export function TraderLock({ data }: { data: TraderLockData }) {
  const [fundingBal, setFundingBal] = useState<number>();
  const [actualBal, setActualBal] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<string>();
  const [tokenName, setTokenName] = useState<string>();
  const { provider, address } = useWeb3Context();
  const [actualPercent, setActualPercent] = useState<number>();
  useEffect(() => {
    if (!address) {
      return;
    }
    setIsLoading(true);
    fetchActualBal(data, provider)
      .then((bal) => {
        setFundingBal(bal.fundingBal);
        setActualBal(bal.currentBal);
        setPeriod(bal.period);
        setActualPercent(bal.profitPercent);
        setTokenName(bal.tokenName);
      })
      .finally(() => setIsLoading(false));
  }, [address, data, provider]);

  const fundingStartDate = data.fundingStartTime * 1000;
  const fundingEndDate = fundingStartDate + data.fundingPeriod * 1000;
  const tradingEndDate = fundingEndDate + data.tradingPeriod * 1000;
  const daysTrading = Math.round(data.tradingPeriod / 60 / 60 / 24);

  return (
    <Link to={`/perioddetail?contract=${data.contract}`} className="orng_brdr_link">
      <Box className="def_trdlck_bx">
        <Box className="trdng_prd">
          <Typography className="def_14px">{period} PERIOD</Typography>
        </Box>
        <Box className="prfl_bx">
          <Box className="lft_cntnt">
            <Box component="img" src={data.trader?.image} />
          </Box>
          <Box className="rght_cntnt">
            <Typography component="h4">{data.trader?.name}</Typography>
            <Tags tags={data.trader?.tags} />
          </Box>
        </Box>
        <Box className="txt_cntnt">
          <Box className="innr_txt_cntnt">
            <Typography className="def_14px">
              {period === "FUNDING" ? "Funding Goal" : "Initial Balance"} <span>:</span>
            </Typography>
            <Typography component="h5">
              {fundingBal && fundingBal.toFixed(0)} {data.initialValue.token}
            </Typography>
          </Box>
          <Box className="innr_txt_cntnt">
            <Typography className="def_14px">
              Trading Period <span>:</span>
            </Typography>
            <Typography component="h5">{daysTrading} Days</Typography>
          </Box>
        </Box>
        {period !== "FUNDING" && (
          <Box className="graph_bx">
            {isLoading && (
              <>
                <Box className="ghrp_lft">
                  <AthenaSkeleton variant="rectangular" height={21} />
                  <AthenaSkeleton variant="rectangular" height={30} />
                </Box>
                <Box className="ghrp_rght">
                  <AthenaSkeleton variant="rectangular" height={58} />
                </Box>
              </>
            )}
            {!isLoading && period !== "FUTURE" && (
              <>
                <Box className="ghrp_lft">
                  <Typography className="def_14px">
                    Actual Balance
                    <span className={actualPercent >= 0 ? "green_txt" : "red_txt"}>
                      ({actualPercent >= 0 ? "+" : ""}
                      {+actualPercent?.toFixed(2)}%)
                    </span>
                  </Typography>
                  <Typography component="h3">
                    {(+actualBal?.toFixed(0)).toLocaleString()} {tokenName}
                  </Typography>
                  {/* <Typography component="h6" className="def_14px">
                    $ {data.actualValue.usd}
                  </Typography> */}
                </Box>
                <Box className="ghrp_rght">
                  <Box component="img" src={actualPercent >= 0 ? "/img/graph_img.png" : "/img/graph_img_red.png"} />
                </Box>
              </>
            )}
          </Box>
        )}
        <Box className="arrw_bx">
          {period === "FUTURE" && (
            <Box className="arrw_lft">
              <Typography className="def_14px">Funding Period will start in:</Typography>
              <Typography component="h5">
                <Countdown date={fundingStartDate} />
              </Typography>
            </Box>
          )}
          {period === "FUNDING" && (
            <Box className="arrw_lft">
              <Typography className="def_14px">Remaning Funding Period:</Typography>
              <Typography component="h5">
                <Countdown date={fundingEndDate} />
              </Typography>
            </Box>
          )}
          {period === "TRADING" && (
            <Box className="arrw_lft">
              <Typography className="def_14px">Remaining Trading Period:</Typography>
              <Typography component="h5">
                <Countdown date={tradingEndDate} />
              </Typography>
            </Box>
          )}
          {period === "CLAIMING" && (
            <Box className="arrw_lft">
              <Typography className="def_14px">TraderLock Ended</Typography>
              <Typography component="h5">
                <ReactTimeAgo date={tradingEndDate} locale="en-US" />
              </Typography>
            </Box>
          )}

          <Box className="arrw_rght">
            <Button className="grn_brdr_btn">
              <Box component="img" src="/img/arrow_right_ic.svg" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}

function Tags({ tags }: { tags: string }) {
  const data = tags && tags.split(",").map((item) => new TraderLockTagProp(item, TagClassMap[item]));
  return (
    <Box className="boxes">
      {data &&
        data.map((item) => (
          <Box className={`def_bx ${item.className}`} key={item.name}>
            <Typography className="def_14px">{item.name}</Typography>
          </Box>
        ))}
    </Box>
  );
}

const TagClassMap = {
  Expert: "green_bx",
  "Medium Risk": "orng_bx",
  KYC: "white_bx",
};

export const TraderLockSkeleton = () => {
  return (
    <Box className="def_trdlck_bx">
      <Box className="trdng_prd">
        <Typography className="def_14px" display="flex" justifyContent="flex-end">
          <AthenaSkeleton variant="rectangular" width={100} height={30} />
        </Typography>
      </Box>
      <Box className="prfl_bx">
        <Box className="lft_cntnt" mr={3}>
          <AthenaSkeleton variant="rectangular" width={68} height={68} />
        </Box>
        <Box className="rght_cntnt">
          <Typography component="h4">
            <AthenaSkeleton width={200} height={24} />
          </Typography>
          <Typography component="h4" display={"flex"}>
            <AthenaSkeleton width={60} height={30} sx={{ mr: 1 }} />
            <AthenaSkeleton width={60} height={30} sx={{ mr: 1 }} />
            <AthenaSkeleton width={60} height={30} sx={{ mr: 1 }} />
          </Typography>
        </Box>
      </Box>
      <Box className="txt_cntnt">
        <Box className="innr_txt_cntnt">
          <AthenaSkeleton width="100%" />
        </Box>
        <Box className="innr_txt_cntnt">
          <AthenaSkeleton width="100%" />
        </Box>
      </Box>
      <Box className="graph_bx">
        <Box className="ghrp_lft">
          <AthenaSkeleton variant="rectangular" width={100} height={21} />
          <AthenaSkeleton variant="rectangular" width={100} height={30} />
        </Box>
        <Box className="ghrp_rght">
          <AthenaSkeleton variant="rectangular" width={100} height={58} />
        </Box>
      </Box>
      <Box className="arrw_bx">
        <Box className="arrw_lft">
          <Typography className="def_14px">
            <AthenaSkeleton width={200} />
          </Typography>
          <Typography component="h5" display="flex" alignItems="center">
            <AthenaSkeleton width={40} height={40} />:
            <AthenaSkeleton width={40} height={40} />:
            <AthenaSkeleton width={40} height={40} />:
            <AthenaSkeleton width={40} height={40} />
          </Typography>
        </Box>
        <Box className="arrw_rght">
          <AthenaSkeleton variant="circular" width={50} height={50} />
        </Box>
      </Box>
    </Box>
  );
};
