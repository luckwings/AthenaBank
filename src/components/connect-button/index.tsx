import { useEffect, useState } from "react";
import { useWeb3Context } from "../../hooks";
import { DEFAULD_NETWORK } from "../../constants";
import {
  Box,
  Button,
  ClickAwayListener,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  MenuList,
  styled,
  Typography,
} from "@mui/material";
import { accountEllipsis } from "../../helpers";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapDialog from "../BootstrapDialog";
import UserAPI, { UserModel } from "../../helpers/userAPI";
import { useCookies } from "react-cookie";

const StyledMenuItem = styled(MenuItem)({
  borderRadius: 4,
  "&:hover": {
    backgroundColor: "#ffaa28",
    color: "#04031e",
  },
});

function ConnectMenu() {
  const profileRef = useRef();
  const [open, setOpen] = useState(false);
  const [isTOSDialogOpen, setIsTOSDialogOpen] = useState(false);
  const history = useNavigate();
  const [cookies, setCookie] = useCookies(["ref"]);
  const goToProfile = () => {
    setOpen(false);
    history("/contractdetail", { replace: true });
  };

  const { connect, disconnect, connected, web3, providerChainID, checkWrongNetwork, address } = useWeb3Context();
  // const dispatch = useDispatch();
  const [isConnected, setConnected] = useState(connected);

  const setReferrer = async (_user?: UserModel) => {
    const ref: string = cookies.ref;
    let user: UserModel;
    if (address && ref) {
      if (_user) {
        user = _user;
      } else {
        user = await UserAPI.get(address);
      }
      if (user && !user.referrer) {
        UserAPI.modify(user.walletAddress, { ...user, referrer: ref });
      }
    }
  };

  useEffect(() => {
    if (connected) {
      UserAPI.get(address).then((user) => {
        if (!user || !user?.hasAcceptedTOS) {
          setIsTOSDialogOpen(true);
        } else {
          setReferrer(user);
        }
      });
    }
  }, [address]);

  let buttonText = "Connect Wallet";
  let clickFunc: any = () => {
    connect();
  };
  // let buttonStyle = {};

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (isConnected && providerChainID !== DEFAULD_NETWORK) {
    buttonText = "Wrong network";
    // buttonStyle = { backgroundColor: 'rgb(255, 67, 67)' };
    clickFunc = () => {
      checkWrongNetwork();
    };
  }

  const onAccept = () => {
    UserAPI.acceptTOS(address)
      .catch(console.error)
      .finally(() => {
        setIsTOSDialogOpen(false);
        setReferrer();
      });
  };

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  let menuPos = {
    right: 24,
    top: 74,
    minWidth: 170,
  };
  if (profileRef.current) {
    const rect = (profileRef.current as HTMLElement).getBoundingClientRect();
    const body = document.body.getBoundingClientRect();
    menuPos = {
      right: body.width - rect.right,
      top: rect.bottom + 8,
      minWidth: rect.width,
    };
  }

  return (
    <>
      {isConnected && providerChainID === DEFAULD_NETWORK ? (
        <Box display="flex">
          <Button ref={profileRef} className="cnct_wllt_btn def_yylw_btn" onClick={() => setOpen(true)}>
            <span>{accountEllipsis(address)}</span>
            <Box component="img" src="/img/wllt_ic.svg" />
          </Button>
          {open && (
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Box
                position="fixed"
                {...menuPos}
                zIndex={1000}
                borderRadius={2}
                sx={{ backgroundColor: "#04031e", color: "#ffaa28", boxShadow: "0 0 4px #ffaa28" }}
              >
                <MenuList sx={{ m: 0, p: 0 }}>
                  <StyledMenuItem onClick={goToProfile}>
                    <Typography variant="h6">Profile</Typography>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={disconnect}>
                    <Typography variant="h6">Logout</Typography>
                  </StyledMenuItem>
                </MenuList>
              </Box>
            </ClickAwayListener>
          )}
        </Box>
      ) : (
        <Button className="cnct_wllt_btn def_yylw_btn" onClick={clickFunc}>
          <span>{buttonText}</span>
          <Box component="img" src="/img/wllt_ic.svg" />
        </Button>
      )}
      <BootstrapDialog className="swap_dialog" open={isTOSDialogOpen} scroll="paper">
        <DialogTitle color={"white"}>Terms of Service</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color="white">
            By clicking confirm I accept Terms of service, Privacy policy and KYC Policy related to functioning of
            Athena Crypto Bank App. Buying tokens or participate in trading contracts involves risks, and purchasers
            should be able to bear the loss of their entire purchase. All purchasers should make their own determination
            of whether or not to make any purchase, based on their own independent evaluation and analysis.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={disconnect}>Cancel</Button>
          <Button onClick={onAccept} autoFocus>
            Accept and Connect
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default ConnectMenu;
