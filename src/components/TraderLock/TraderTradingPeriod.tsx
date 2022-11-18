import { Box, Typography } from "@mui/material";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import getSign from "../../helpers/get-sign";
import { TraderTradingPeriodData } from "../../models/TraderTradingPeriodData";
import AthenaSkeleton from "../AthenaSkeleton";
import LevelFeeReduction from "../LevelFeeReduction";

export default function TraderTradingPeriod({ data }: { data: TraderTradingPeriodData }) {
  return (
    <>
      <Box className="actl_cntct_blnc">
        <Typography>Actual Contract Balance</Typography>
        <Typography component="h3">
          {+data.balance.toFixed(2)} {data.token}
          <span className={data.percent < 0 ? "red_txt" : ""}>
            {getSign(data.percent)}
            {+data.percent.toFixed(2)}%
          </span>
        </Typography>
      </Box>
      <Box className="intl_expctd_bx">
        <Box className="ix_innr">
          <Typography>Initial Investment</Typography>
          <Typography component="h5">
            {+data.initial.value.toFixed(2)} {data.initial.token}
          </Typography>
        </Box>
        <Box className="ix_innr">
          <Typography>Expected {data.expectedGain.percent < 0 ? "Loss" : "Gain"}</Typography>
          <Typography component="h5">
            {+data.expectedGain.value.toFixed(2)} {data.expectedGain.token}
            <span className={data.expectedGain.percent < 0 ? "red_txt" : ""}>
              {getSign(data.expectedGain.percent)}
              {+data.expectedGain.percent.toFixed(2)}%
            </span>
          </Typography>
        </Box>
      </Box>
      <Box className="trndgprd_end_bx">
        <Typography>Trading Period End In</Typography>
        <Typography component="h4">
          <Countdown date={data.endDate} onComplete={() => window.location.reload()} />
        </Typography>
        <Typography>
        The trading contract will be closed automatically once the expiration is reached, remember that the trader can close the contract in advance at any time.
        </Typography>
      </Box>
      <Box className="incrs_lvl_bx">
        <Link to="/athenalevel" className="def_yylw_btn">
          Increase Level
        </Link>
        <Typography mt={2}>Level and Fees Reduction</Typography>
        <LevelFeeReduction currentLvl={data.currentLvl} levelFeeReduction={data.levelFeeReduction} />
      </Box>
    </>
  );
}

export const TraderTradingPeriodSkeleton = () => (
  <>
    <Box className="actl_cntct_blnc">
      <Typography>Actual Contract Balance</Typography>
      <AthenaSkeleton variant="rectangular" width={155} height={36} />
    </Box>
    <Box className="intl_expctd_bx">
      <Box className="ix_innr">
        <Typography>Initial Investment</Typography>
        <AthenaSkeleton variant="rectangular" width={155} height={26} />
      </Box>
      <Box className="ix_innr">
        <Typography>Expected Gain</Typography>
        <AthenaSkeleton variant="rectangular" width={155} height={26} />
      </Box>
    </Box>
    <Box className="trndgprd_end_bx">
      <Typography>Trading Period End In</Typography>
      <Typography display="flex" gap={1} p={1} justifyContent="center" alignItems="center">
        <AthenaSkeleton width={50} variant="rectangular" height={41} />:
        <AthenaSkeleton width={50} variant="rectangular" height={41} />:
        <AthenaSkeleton width={50} variant="rectangular" height={41} />:
        <AthenaSkeleton width={50} variant="rectangular" height={41} />
      </Typography>
      <Typography>
        <AthenaSkeleton width={250} variant="rectangular" height={20} sx={{ mb: 1 }} />
        <AthenaSkeleton width={250} variant="rectangular" height={20} sx={{ mb: 1 }} />
        <AthenaSkeleton width={250} variant="rectangular" height={20} />
      </Typography>
    </Box>
    <Box className="incrs_lvl_bx">
      <AthenaSkeleton width={140} variant="rectangular" height={45} sx={{ mx: "auto" }} />
      <Typography gutterBottom mt={2}>
        Level and Fees Reduction
      </Typography>
      <Typography component="h6" display="flex" gap={3} justifyContent="center">
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
      </Typography>
    </Box>
  </>
);

/* 
<Box className="prgrss_box">
  <Box className="def_prgrss">
    <Box sx={{ flexGrow: 1 }}>
      <BorderLinearProgress variant="determinate" value={70} />
    </Box>
  </Box>
  <Box className="pgrss_cntnt">
    <Typography component="h6">86%</Typography>
    <Typography component="h6">172 / 200 BNB Raised</Typography>
  </Box>
</Box>
<Box className="cntrbt_bx">
  <Box className="inpt_bx def_inpt_btn">
    <TextField
      fullWidth
      id="fullWidth"
      placeholder="1 BNB = 1100000000 INSP"
    />
    <Button className="def_yylw_btn">Contribute</Button>
    <Typography className="max_txt">MAX</Typography>
  </Box>
  <Typography className="min_max_txt">Min: 0.1 | Max: 1</Typography>
</Box>
<Box className="same_bx">
  <Typography>Funding Period End In</Typography>
  <Typography component="h5">00 : 00 : 00 : 00</Typography>
</Box>
<Box className="same_bx">
  <Typography>Your Contributed Amount</Typography>
  <Typography component="h6">$254.14</Typography>
</Box>
<Box className="incrs_lvl_bx">
  <Typography>Level and Fees Reduction</Typography>
  <Typography component="h6">
    Level 0: 40% | <span>Level 1: 30%</span> | Level 2: 25% | Level 3: 20%
  </Typography>
  <Button className="def_yylw_btn">Increase Level</Button>
</Box>
*/
