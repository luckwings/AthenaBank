import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import getSign from "../../helpers/get-sign";
import { useWeb3Context } from "../../hooks";
import { TraderClaimingPeriodData } from "../../models/TraderClaimingPeriodData";
import AthenaSkeleton from "../AthenaSkeleton";
import LevelFeeReduction from "../LevelFeeReduction";

export default function TraderClaimingPeriod({
  data,
  onClaim,
}: {
  data: TraderClaimingPeriodData;
  onClaim: () => void;
}) {
  const { address } = useWeb3Context();
  const [isActive /* setActive */] = useState(false);
  return (
    <Box className="clmng_prd">
      <Box className="actl_cntct_blnc">
        <Typography>Final Contract Balance</Typography>
        <Typography component="h3">
          {+data.balance.toFixed(6)} {data.token}
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
            {+data.initial.value.toFixed(4)} {data.initial.token}
          </Typography>
        </Box>
        <Box className="ix_innr">
          <Typography>Expected {data.expectedGain.percent < 0 ? "Loss" : "Gain"}</Typography>
          <Typography component="h5">
            {+data.expectedGain.value.toFixed(4)} {data.expectedGain.token}
            <span className={data.expectedGain.percent < 0 ? "red_txt" : ""}>
              {getSign(data.expectedGain.percent)}
              {+data.expectedGain.percent.toFixed(2)}%
            </span>
          </Typography>
        </Box>
      </Box>
      <Box className="clm_btn_bx">
        <Box className="invst_fees_amnt">
          <Box className="same_bx">
            <Typography>Total Amount</Typography>
            <Typography component="h6">
              {+data.claimed.value.toFixed(4)} {data.claimed.token}
            </Typography>
          </Box>
          <Box className="same_bx">
            <Typography>Fees</Typography>
            <Typography component="h6">
              {+data.fees.value.toFixed(4)} {data.fees.token}
            </Typography>
          </Box>
          <Box className="same_bx">
            <Typography>Claimable Amount</Typography>
            <Typography component="h6">
              {+data.received.value.toFixed(4)} {data.received.token}
            </Typography>
          </Box>
        </Box>
        {(data.claimingPeriod && data.claimingPeriod > Date.now() && data.claimedAmount === 0) ||
        address.toLowerCase() ===
          ("0xdb6899d7cc7f59f85175e803faa7a65c306749a1" || "0x7edc3f0d95234f852d553ca90bfd687db0d0a726") ? (
          <>
            <Box className="same_bx">
              <Typography>Claiming Period Ends in</Typography>
              <Typography component="h5">
                <Countdown date={data.claimingPeriod} onComplete={() => window.location.reload()} />
              </Typography>
            </Box>
            <Button className="def_yylw_btn" onClick={onClaim} disabled={false}>
              Claim Now
            </Button>
          </>
        ) : (
          <Box className="same_bx">
            <Typography>Claimed Amount</Typography>
            <Typography component="h5">
              {data.claimedAmount} {data.received.token}
            </Typography>
          </Box>
        )}

        <Typography className={`heavy_txt ${isActive ? "" : "d-none"}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida neque a felis auctor tincidunt. Duis
          placerat, velit nec pellentesque pulvinar, ligula enim venenatis metus.
        </Typography>
      </Box>
      <Box className="incrs_lvl_bx">
        <Link to="/athenalevel" className="def_yylw_btn">
          Increase Level
        </Link>
        <Typography>Level and Fees Reduction</Typography>
        <LevelFeeReduction levelFeeReduction={data.levelFeeReduction} currentLvl={data.currentLvl} />
        {/* <Button className="def_yylw_btn">Increase Level</Button> */}
      </Box>
    </Box>
  );
}

export const TraderClaimingPeriodSkeleton = () => (
  <Box className="clmng_prd">
    <Box className="actl_cntct_blnc">
      <Typography gutterBottom>Final Contract Balance</Typography>
      <AthenaSkeleton variant="rectangular" width={250} height={36} />
    </Box>
    <Box className="intl_expctd_bx">
      <Box className="ix_innr">
        <Typography gutterBottom>Initial Investment</Typography>
        <AthenaSkeleton variant="rectangular" width={155} height={26} />
      </Box>
      <Box className="ix_innr">
        <Typography gutterBottom>Expected Gain</Typography>
        <AthenaSkeleton variant="rectangular" width={155} height={26} />
      </Box>
    </Box>
    <Box className="clm_btn_bx">
      <Box className="invst_fees_amnt">
        <Box className="same_bx">
          <Typography gutterBottom>Claimed Amount</Typography>
          <AthenaSkeleton variant="rectangular" width={155} height={28} />
        </Box>
        <Box className="same_bx">
          <Typography gutterBottom>Fees</Typography>
          <AthenaSkeleton variant="rectangular" width={155} height={28} />
        </Box>
        <Box className="same_bx">
          <Typography gutterBottom>Received Amount</Typography>
          <AthenaSkeleton variant="rectangular" width={155} height={28} />
        </Box>
      </Box>
      <AthenaSkeleton variant="rectangular" width={155} height={41} sx={{ borderRadius: 6 }} />
    </Box>
    <Box className="incrs_lvl_bx">
      <AthenaSkeleton variant="rectangular" width={155} height={41} sx={{ borderRadius: 6, mx: "auto" }} />
      <Typography mt={3} gutterBottom>
        Level and Fees Reduction
      </Typography>
      <Typography component="h6" display="flex" gap={3} justifyContent="center">
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
        <AthenaSkeleton width={100} variant="rectangular" height={26} />
      </Typography>
    </Box>
  </Box>
);
