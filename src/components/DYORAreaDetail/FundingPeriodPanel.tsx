import { Box, Typography, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import Countdown from "react-countdown";
import FundingPeriodDataModel from "../../models/FundingPeriodDataModel";
import AthenaSkeleton from "../AthenaSkeleton";
import BorderLinearProgress from "../BorderLinearProgress";
import LevelFeeReduction from "../LevelFeeReduction";

interface IFundPeriodPanelProps {
  data: FundingPeriodDataModel;
  onParticipate: (value: number) => void;
}

export default function FundingPeriodPanel({ data, onParticipate }: IFundPeriodPanelProps) {
  const [value, setValue] = useState<string>("");
  const isParticipateAllowed = data.openForLevels.indexOf(data.currentLvl) >= 0;
  const fundingDuration = data.endDate.getTime() - data.fundingStartTime.getTime();
  const unLocktime = new Date(data.fundingStartTime.getTime() + (fundingDuration / 4) * ( 3 - data.currentLvl));
  return (
    <>
      <Box className="gmblf_bx ido_boxes">
        <Box className="top_bx">
          <Box className="img_box">
            <Box component="img" src="/img/gmblf_img.png" />
          </Box>
          <Box className="cntnt_box">
            <Typography component="h2">{data.name}</Typography>
            <Box className="innr_cntnt_bx">
              <Box className="green_cntnt same_cntnt">
                <Box component="img" src="/img/green_lock_ic.svg" />
                <Typography>{data.lockPercent}%</Typography>
              </Box>
              <Box className="yllw_cntnt same_cntnt">
                <Box component="img" src="/img/grah_ic.svg" />
                <Typography>{data.chartPercent}%</Typography>
              </Box>
              <Box className="white_cntnt same_cntnt">
                <Box component="img" src="/img/clipboard_ic.svg" />
                <Typography>Audit</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="prgrss_box">
        <Box className="def_prgrss">
          <Box sx={{ flexGrow: 1 }}>
            <BorderLinearProgress variant="determinate" value={(data.raised * 100) / data.target} />
          </Box>
        </Box>
        <Box className="pgrss_cntnt">
          <Typography component="h6">{+((data.raised * 100) / data.target).toFixed(4)}%</Typography>
          <Typography component="h6">
            {data.raised} / {data.target} {data.baseToken} Raised
          </Typography>
        </Box>
      </Box>
      <Box className="cntrbt_bx">
        <Box className="inpt_bx def_inpt_btn">
          <TextField
            type={"number"}
            fullWidth
            id="fullWidth"
            placeholder={`1 ${data.baseToken} = ${data.ratio} ${data.token}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            className="def_yylw_btn"
            onClick={() => onParticipate(+value)}
            disabled={!isParticipateAllowed || !+value}
          >
            Participate
          </Button>
          <Typography className="max_txt">MAX</Typography>
        </Box>
        <Box className="inpt_bttm_bx">
        {data.openForLevels.indexOf(data.currentLvl) < 0 && (
          <Typography className="min_max_txt red_txt">Your level is too low to participate. You can participate in <Countdown date={unLocktime} /></Typography>
        )}
          <Typography className="min_max_txt">Open for levels</Typography>
          {data.openForLevels.map((level) => (
            <Box key={level} component="img" src={`/img/${level + 1}_design.png`} height={27} width={27} />
          ))}
        </Box>
      </Box>
      <Box className="same_bx">
        <Typography>
          {data.fundingStartTime.getTime() > Date.now() ? "Funding Period Starts In" : "Funding Period End In"}
        </Typography>
        <Typography component="h5">
          <Countdown
            date={data.fundingStartTime.getTime() > Date.now() ? data.fundingStartTime : data.endDate}
            onComplete={() => window.location.reload()}
          />
        </Typography>
      </Box>
      <Box className="invst_fees_amnt">
        <Box className="same_bx">
          <Typography>Invested Amount</Typography>
          <Typography component="h6">${data.invested}</Typography>
        </Box>
        <Box className="same_bx">
          <Typography>Fees Paid</Typography>
          <Typography component="h6">${data.feesPaid}</Typography>
        </Box>
        <Box className="same_bx">
          <Typography>Token Amount</Typography>
          <Typography component="h6">
            {data.tokenAmount} {data.token}
          </Typography>
        </Box>
      </Box>
      <Box className="incrs_lvl_bx">
        <Typography>Level and Fees Reduction</Typography>
        <LevelFeeReduction levelFeeReduction={data.levelFeeReduction} currentLvl={data.currentLvl} />
      </Box>
    </>
  );
}

export const FundingPeriodPanelSkeleton = () => {
  return (
    <>
      <Box className="gmblf_bx ido_boxes">
        <Box className="top_bx">
          <Box className="img_box">
            <AthenaSkeleton variant="rectangular" height={80} width={80} />
          </Box>
          <Box className="cntnt_box">
            <Typography component="h2">
              <AthenaSkeleton width={170} />
            </Typography>
            <Box display="flex" gap={3}>
              {[1, 2, 3].map((item) => (
                <AthenaSkeleton key={item} width={66} height={27} variant="rectangular" />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="prgrss_box">
        <Box className="def_prgrss">
          <Box sx={{ flexGrow: 1 }}>
            <AthenaSkeleton variant="rectangular" width={"100%"} height={20} />
          </Box>
        </Box>
        <Box className="pgrss_cntnt">
          <Typography component="h6">
            <AthenaSkeleton variant="rectangular" width={55} height={26} />
          </Typography>
          <Typography component="h6">
            <AthenaSkeleton variant="rectangular" width={155} height={26} />
          </Typography>
        </Box>
      </Box>
      <Box className="cntrbt_bx">
        <Box className="inpt_bx def_inpt_btn" mb={2}>
          <AthenaSkeleton variant="rectangular" width={"100%"} height={54} />
        </Box>
        <Box className="inpt_bttm_bx" mt={1}>
          <Typography className="min_max_txt" mr={2}>
            Open for levels
          </Typography>
          {[1, 2, 3, 4].map((level) => (
            <AthenaSkeleton key={level} variant="rectangular" height={27} width={27} sx={{ mr: 1 }} />
          ))}
        </Box>
      </Box>
      <Box className="same_bx">
        <Typography>Funding Period End In</Typography>
        <Typography display="flex" gap={1} p={1} justifyContent="center" alignItems="center">
          <AthenaSkeleton width={40} variant="rectangular" height={26} />:
          <AthenaSkeleton width={40} variant="rectangular" height={26} />:
          <AthenaSkeleton width={40} variant="rectangular" height={26} />:
          <AthenaSkeleton width={40} variant="rectangular" height={26} />
        </Typography>
      </Box>
      <Box className="invst_fees_amnt">
        <Box className="same_bx">
          <Typography>Invested Amount</Typography>
          <Typography component="h6">
            <AthenaSkeleton width={100} variant="rectangular" height={26} />
          </Typography>
        </Box>
        <Box className="same_bx">
          <Typography>Fees Paid</Typography>
          <Typography component="h6">
            <AthenaSkeleton width={100} variant="rectangular" height={26} />
          </Typography>
        </Box>
        <Box className="same_bx">
          <Typography>Token Amount</Typography>
          <Typography component="h6">
            <AthenaSkeleton width={100} variant="rectangular" height={26} />
          </Typography>
        </Box>
      </Box>
      <Box className="incrs_lvl_bx">
        <Typography>Level and Fees Reduction</Typography>
        <Typography component="h6" display="flex" gap={3} justifyContent="center">
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
        </Typography>
      </Box>
    </>
  );
};
