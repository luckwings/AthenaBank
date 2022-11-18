import { Box, Typography, Button } from "@mui/material";
import ClaimPeriodDataModel from "../../models/ClaimPeriodDataModel";
import AthenaSkeleton from "../AthenaSkeleton";
import BorderLinearProgress from "../BorderLinearProgress";
import LevelFeeReduction from "../LevelFeeReduction";

interface IClaimingPeriodPanelProps {
  data: ClaimPeriodDataModel;
  onClaim: () => void;
}

export default function ClaimingPeriodPanel({ data, onClaim }: IClaimingPeriodPanelProps) {
  return (
    <Box className="clmng_prd">
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
      <Box className="same_bx">
        <Typography>Total Reserved</Typography>
        <Typography component="h5">
          {data.reserved} {data.token}
        </Typography>
      </Box>
      <Box className="clm_btn_bx">
        <Box className="invst_fees_amnt">
          <Box className="same_bx">
            <Typography>Already Claimed</Typography>
            <Typography component="h6">
              {data.claimed} {data.token}
            </Typography>
          </Box>
          <Box className="same_bx">
            <Typography>Ready to Claim</Typography>
            <Typography component="h6">
              {data.readyToClaim} {data.token}
            </Typography>
          </Box>
        </Box>
        <Button className="def_yylw_btn" disabled={data.readyToClaim <= 0} onClick={onClaim}>
          Claim Now
        </Button>
        {/* <Button>Nothing to claim</Button> */}
      </Box>
      <Box className="incrs_lvl_bx">
        <Typography>Level and Fees Reduction</Typography>
        <LevelFeeReduction levelFeeReduction={data.levelFeeReduction} currentLvl={data.currentLvl} />
      </Box>
    </Box>
  );
}

export const ClaimingPeriodPanelSkeleton = () => {
  return (
    <Box className="clmng_prd">
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
      <Box className="same_bx">
        <Typography gutterBottom>Total Reserved</Typography>
        <Typography component="h5" display="flex" justifyContent="center">
          <AthenaSkeleton width={150} variant="rectangular" height={34} />
        </Typography>
      </Box>
      <Box className="clm_btn_bx">
        <Box className="invst_fees_amnt">
          <Box className="same_bx">
            <Typography gutterBottom>Already Claimed</Typography>
            <Typography component="h6">
              <AthenaSkeleton variant="rectangular" width={155} height={26} />
            </Typography>
          </Box>
          <Box className="same_bx">
            <Typography gutterBottom>Ready to Claim</Typography>
            <Typography component="h6">
              <AthenaSkeleton variant="rectangular" width={155} height={26} />
            </Typography>
          </Box>
        </Box>
        <AthenaSkeleton variant="rectangular" width={155} height={34} />
      </Box>
      <Box className="incrs_lvl_bx">
        <Typography gutterBottom>Level and Fees Reduction</Typography>
        <Typography component="h6" display="flex" gap={3} justifyContent="center">
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
          <AthenaSkeleton width={100} variant="rectangular" height={26} />
        </Typography>
      </Box>
    </Box>
  );
};
