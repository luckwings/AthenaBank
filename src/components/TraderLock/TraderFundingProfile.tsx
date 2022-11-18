import { Box, Typography, TextField, Button, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { TraderFundingProfileData } from "../../models/TraderFundingProfileData";
import BorderLinearProgress from "../BorderLinearProgress";
import LevelFeeReduction from "../LevelFeeReduction";
import AthenaSkeleton from "../AthenaSkeleton";
import { useWeb3Context } from "../../hooks";
import BootstrapDialog, { BootstrapDialogTitle } from "../BootstrapDialog";

type TraderFundingProfileProps = {
  data: TraderFundingProfileData;
  isContributeDisabled: boolean;
  isWithdrawAvailable: boolean;
  onContribute: (value: number) => void;
  onWithdraw: () => void;
  onTerminate: () => void;
  isTerminatePossible: boolean;
};

export default function TraderFundingProfile({
  data,
  isContributeDisabled,
  isWithdrawAvailable,
  onContribute,
  onWithdraw,
  onTerminate,
  isTerminatePossible,
}: TraderFundingProfileProps) {
  const [value, setValue] = useState("");
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
  const percent = (data.raised * 100) / data.target;
  const maxAmount = data.maxAmountAvailable;
  const fundingDuration = data.endDate.getTime() - data.fundingStartTime.getTime();
  const unLocktime = new Date(data.fundingStartTime.getTime() + (fundingDuration / 4) * (3 - data.currentLvl));
  const { address } = useWeb3Context();

  return (
    <>
      <Box className="prgrss_box">
        <Box className="def_prgrss">
          <Box sx={{ flexGrow: 1 }}>
            <BorderLinearProgress variant="determinate" value={percent > 100 ? 100 : percent} />
          </Box>
        </Box>
        <Box className="pgrss_cntnt">
          <Typography component="h6">{+percent.toFixed(4)}%</Typography>
          <Typography component="h6">
            {data.raised} / {data.target} {data.token} Raised
          </Typography>
        </Box>
      </Box>
      <Box className="cntrbt_bx">
        <Box className="inpt_bx def_inpt_btn">
          <TextField fullWidth id="fullWidth" value={value} onChange={(e) => setValue(e.target.value)} />
          <Button
            className="def_yylw_btn"
            disabled={(isContributeDisabled || !value) && address !== data.traderAddress}
            onClick={() => onContribute(+value)}
          >
            {data.isApproved ? "Contribute" : "Approve"}
          </Button>
          <Typography className="max_txt" sx={{ cursor: "pointer" }} onClick={() => setValue(maxAmount.toString())}>
            MAX
          </Typography>
        </Box>
        <Typography className="min_max_txt">Min: {data.contribution.min}</Typography>
        {data.openForLevels.indexOf(data.currentLvl) < 0 && address !== data.traderAddress && (
          <Typography className="min_max_txt red_txt">
            Your level is too low to participate. You can participate in <Countdown date={unLocktime} />
          </Typography>
        )}
        <Box className="inpt_bttm_bx">
          <Typography className="min_max_txt">Open for levels</Typography>
          {data.openForLevels.map((level) => (
            <Box key={level} component="img" src={`/img/${level}_design.png`} height={27} width={27} />
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
        {isTerminatePossible && data.fundingStartTime.getTime() < Date.now() && (
          <Box display="flex" justifyContent="center">
            <Button className="def_yylw_btn" sx={{ px: 3, mt: 2 }} onClick={() => setTerminateDialogOpen(true)}>
              Terminate
            </Button>
            <TerminateDialog
              open={terminateDialogOpen}
              onCancel={() => setTerminateDialogOpen(false)}
              onOk={() => {
                onTerminate();
                setTerminateDialogOpen(false);
              }}
            />
          </Box>
        )}
      </Box>
      <Box className="same_bx incrs_lvl_bx">
        <Typography>Your Contributed Amount</Typography>
        <Typography component="h6">
          {data.contributedAmount} {data.token}
        </Typography>
        {isWithdrawAvailable && data.fundingStartTime.getTime() < Date.now() && (
          <Button className="def_yylw_btn" onClick={onWithdraw}>
            Withdraw
          </Button>
        )}
      </Box>
      <Box className="incrs_lvl_bx">
        <Link to="/athenalevel" className="def_yylw_btn">
          Increase Level
        </Link>
        <Typography mt={2}>Level and Fees Reduction</Typography>
        <LevelFeeReduction levelFeeReduction={data.levelFeeReduction} currentLvl={data.currentLvl} />
      </Box>
    </>
  );
}

export const TraderFundingProfileSkeleton = () => (
  <>
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
        <AthenaSkeleton width={50} variant="rectangular" height={41} />:
        <AthenaSkeleton width={50} variant="rectangular" height={41} />:
        <AthenaSkeleton width={50} variant="rectangular" height={41} />:
        <AthenaSkeleton width={50} variant="rectangular" height={41} />
      </Typography>
    </Box>
    <Box className="same_bx">
      <Typography gutterBottom>Your Contributed Amount</Typography>
      <AthenaSkeleton width={140} variant="rectangular" height={26} sx={{ mx: "auto" }} />
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

const TerminateDialog = ({ open, onCancel, onOk }) => {
  return (
    <BootstrapDialog onClose={() => onCancel()} aria-labelledby="TerminateDialog" open={open} className="swap_dialog">
      <BootstrapDialogTitle id="TerminateDialog" onClose={() => onCancel()}>
        Contract Terminate
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box className="innr_popup">
          <Box className="inpt_bx def_inpt_btn">
            <Typography variant="body1" gutterBottom style={{ color: "white" }}>
              Are you sure you want to terminate the contract?
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button className="def_yylw_btn" sx={{ minWidth: 120 }} onClick={() => onOk()}>
          OK
        </Button>
        <Button className="def_yylw_btn" sx={{ minWidth: 120, ml: 2 }} onClick={() => onCancel()}>
          Cancel
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};
