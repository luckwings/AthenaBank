import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Web3 from "web3";
import { ATHLevelContract, ERC20Contract } from "../abi";
import { getAddresses } from "../constants";
import { useWeb3Context } from "../hooks";
import { withLoader } from "../components/Loader";

export default function AthenaLevel() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { provider, address, chainID, checkWrongNetwork, connect } = useWeb3Context();
  const signer = provider.getSigner();
  const addresses = getAddresses(chainID);
  const [info, setInfo] = useState({
    currentLvl: "0",
    stacked: "0",
    lvlExpiry: "NA",
    availableBal: 0,
    isExpired: false,
  });
  const [levels, setLevels] = useState([]); //this array has the amount of tokens neeeded for that position of lvl
  const [isApproved, setIsApproved] = useState(false);

  const contract = useMemo(
    () => new ethers.Contract(addresses.LP_LEVEL_ADDRESS, ATHLevelContract, provider),
    [addresses.LP_LEVEL_ADDRESS, provider]
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const getLevels = useCallback(
    async (lvl) => {
      const lvls = [];
      lvls.push(0);
      for (let i = 1; i <= lvl; i++) {
        const lvlAmount = await contract.minAthRequired(i);
        lvls.push(Web3.utils.fromWei(lvlAmount.toString()));
      }
      return lvls;
    },
    [contract]
  );

  const getData = useCallback(async () => {
    const athToken = await contract.athToken();
    const athTokenContract = new ethers.Contract(athToken, ERC20Contract, provider);
    if (!address) {
      return;
    }
    const walletBalance = await athTokenContract.balanceOf(address);
    const availableBal = +Web3.utils.fromWei(walletBalance.toString());
    const data = await contract.athBalance(address);
    const level = await contract.athLevel(address);
    const bal = Web3.utils.fromWei(data.balance?.toString());
    const lockingPeriod = await contract.lockingPeriodInSeconds();
    const expiry = data.lastUpdated > 0 ? new Date((data.lastUpdated + lockingPeriod) * 1000) : null;

    const allowed = await athTokenContract.allowance(address, addresses.LP_LEVEL_ADDRESS);
    setIsApproved(Number(allowed) > 0);
    const expiryStr = expiry ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(expiry) : "";
    setInfo({
      currentLvl: Math.floor(+level).toString(),
      stacked: (+bal).toFixed(2),
      lvlExpiry: expiryStr,
      availableBal,
      isExpired: expiry ? expiry <= new Date() : false,
    });
  }, [address, addresses.LP_LEVEL_ADDRESS, contract, provider]);

  useEffect(() => {
    withLoader(async () => {
      const totatLevels = await contract.levels();
      const lvls = await getLevels(totatLevels);
      setLevels(lvls);
    });
    withLoader(getData);
  }, [contract, getLevels, getData]);

  const approve = async () => {
    const athToken = await contract.athToken();
    const athTokenContract = new ethers.Contract(athToken, ERC20Contract, signer);
    const tx = await athTokenContract.approve(addresses.LP_LEVEL_ADDRESS, ethers.constants.MaxInt256);
    await tx.wait();
    setIsApproved(true);
  };

  const onStackClicked = async (amount, level) => {
    const athToken = new ethers.Contract(addresses.LP_LEVEL_ADDRESS, ATHLevelContract, signer);
    const tx = await athToken.deposit(Web3.utils.toWei(amount.toString()), level);
    await tx.wait();
    withLoader(getData);
    setIsPopupOpen(false);
    window.location.reload();
  };

  const onUnstackClicked = async () => {
    const athToken = new ethers.Contract(addresses.LP_LEVEL_ADDRESS, ATHLevelContract, signer);
    const tx = await athToken.withDraw();
    await tx.wait();
    withLoader(getData);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className="athnlvl_main_bx">
      <Container>
        <Typography component="h2" className="def_h2">
          Athena Levels
        </Typography>
        <Typography className="p_hdbg">
          To increase level you have to{" "}
          <span>
            lock ATH token for <b>6 months.</b> and burn 1% fee.
          </span>
        </Typography>
        <Box className="incrs_lvl_bx">
          <Box className="innr_lvl_bx">
            <Typography>Current Level</Typography>
            <Typography component="h5">LEVEL {info.currentLvl}</Typography>
          </Box>
          <Box className="innr_lvl_bx">
            <Typography>Level Expiration On</Typography>
            <Typography component="h5" className="red_txt">
              {info.lvlExpiry}
            </Typography>
          </Box>
          <Box className="innr_lvl_bx">
            <Typography>Current Staked</Typography>
            <Typography component="h5">{info.stacked} ATH</Typography>
          </Box>
          <Box className="stklvl_bx">
            <Typography>Increase Level</Typography>
            {!isApproved && (
              <Button className="def_yylw_btn" disabled={!address} onClick={() => approve()}>
                Approve
              </Button>
            )}
            {isApproved && !info.isExpired && (
              <Button className="def_yylw_btn" onClick={() => setIsPopupOpen(true)}>
                Stake
              </Button>
            )}
            {isApproved && info.isExpired && (
              <Button className="def_yylw_btn" onClick={() => onUnstackClicked()}>
                Unstake
              </Button>
            )}
            <StackAthPopup
              open={isPopupOpen}
              handleClose={() => setIsPopupOpen(false)}
              stackedAmount={info.stacked}
              athLevelMap={levels}
              currentLvl={+info.currentLvl}
              balance={info.availableBal}
              onStackClicked={onStackClicked}
            />
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Level fees={40} level={0} value={0} currentLvl={+info.currentLvl} />
          <Level fees={30} level={1} value={levels[1]} currentLvl={+info.currentLvl} />
          <Level fees={25} level={2} value={levels[2]} currentLvl={+info.currentLvl} />
          <Level fees={20} level={3} value={levels[3]} currentLvl={+info.currentLvl} />
        </Grid>
        <Box className="lvl_bttm_cntnt">
          <Typography>
            ATH Levels are divided into 4 tiers, advantages of owning ATHENA tokens (ATH) Reduce trading fees, Priority
            access to presales, Participation in governance, Possibility of opening account.
          </Typography>
          <Box className="ath_upcmg_btn_bx">
            <a
              href="https://pancakeswap.finance/swap?inputCurrency=0x5597D204118436B5BcA397aded5aC6923a26033D"
              target="_blank"
            >
              <Button className="def_yylw_btn">Buy ATH</Button>
            </a>
            {/* <Button className="def_blue_btn">Upcoming Projects</Button> */}
            <Link to="/activeproject" className="def_blue_btn">
              Upcoming Projects
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const Level = ({ value, level, fees, currentLvl }) => {
  const border = currentLvl === level ? "1px solid #ffaa28" : "";

  return (
    <Grid item xs={12} sm={6}>
      <Link to="#" className="orng_brdr_link">
        <Box className="def_lvl_boxes" border={border}>
          <Box className="top_lvl_bx">
            <Box className="txt_cntnt">
              <Typography>LEVEL {level}</Typography>
              <Typography component="h3">{+Number(value || 0).toFixed(2)} Token ATH</Typography>
            </Box>
            {/* <Button>
              <Box component="img" src="/img/arrow_right_ic.svg" />
            </Button> */}
          </Box>
          <Box className="bttm_lvl_bx">
            <Typography>Level fees </Typography>
            <Typography component="h5">{fees}%</Typography>
          </Box>
        </Box>
      </Link>
    </Grid>
  );
};

const Levels = [
  {
    value: 0,
    label: "Level 0",
  },
  {
    value: 33.33,
    label: "Level 1",
  },
  {
    value: 66.66,
    label: "Level 2",
  },
  {
    value: 100,
    label: "Level 3",
  },
];

function StackAthPopup({ open, handleClose, stackedAmount, athLevelMap, currentLvl, balance, onStackClicked }) {
  const [value, setValue] = useState(Levels[currentLvl].value);

  useEffect(() => {
    setValue(Levels[currentLvl].value);
  }, [currentLvl]);

  const level = Math.round(value / 33.33);
  const price = (athLevelMap[level] || 0) - stackedAmount;
  const finalPrice = price > 0 ? price : 0;

  const isStackDisabled = finalPrice === 0 || balance < finalPrice;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ background: "#0e1460" }}>
        <DialogTitle id="alert-dialog-title" color="white">
          Stake ATH
        </DialogTitle>
        <DialogContent>
          <Box
            px={5}
            py={1}
            sx={(theme) => ({
              [theme.breakpoints.up("md")]: {
                zoom: 1.23,
                minWidth: 375,
              },
              minWidth: 250,
            })}
          >
            <Slider
              onChange={(_, newVal) => setValue(newVal as number)}
              aria-label="Always visible"
              value={value}
              step={33.33}
              marks={Levels}
              sx={{
                color: "white",
                "& .MuiSlider-markLabel": {
                  color: "white",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 1 }}>
          <Box my={1} display="flex" justifyContent="center">
            <Typography variant="h5" color="white" component="div">
              Amount: {finalPrice}
            </Typography>
          </Box>
          {/* <Button className='def_yylw_btn' sx={{px: 2}} onClick={handleClose}>Disagree</Button> */}
          <Button
            className="def_yylw_btn"
            sx={{ px: 2, mx: 2 }}
            onClick={() => onStackClicked(finalPrice, Math.round(value / 33.33))}
            autoFocus
            disabled={isStackDisabled}
          >
            Stake Now
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
