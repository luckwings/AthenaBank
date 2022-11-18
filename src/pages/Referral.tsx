import React, { useEffect } from "react";
import { useWeb3Context } from "../hooks";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { hexToBase64, base64ToHex } from "../helpers/hex-64";
export default function Referral() {
  const { address } = useWeb3Context();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [address]);

  return (
    <>
      <Box className="ref_main_bx">
        <Container>
          <Typography component="h2" className="def_h2">
            Referral
          </Typography>
          <Box className="ref_innr_bx">
            <Box className="top_ref">
              <Typography component="h3">Share your Referral link</Typography>
            </Box>
            {address ? (
              <Box className="mddl_ref top_ref">
                <Typography component="h3">athenacryptobank.io?ref={hexToBase64(address)}</Typography>
                <CopyToClipboard text={`athenacryptobank.io?ref=${hexToBase64(address)}`}>
                  <Button size="small" className="asbutton">
                    <CheckCircleIcon className="ascheckIcon" />
                    Copy to clipboard
                  </Button>
                </CopyToClipboard>
              </Box>
            ) : (
              <Box className="mddl_ref top_ref">
                <Typography component="h3">Connect your wallet to see the link</Typography>
              </Box>
            )}
            <Box className="bttm_ref">
              <Box className="same_cntnt">
                <Typography className="lght_txt">Reward for lvl 0</Typography>
                <Typography>&nbsp;5% of total fees</Typography>
              </Box>
              <Box className="same_cntnt">
                <Typography className="lght_txt">Reward for lvl 1</Typography>
                <Typography>10% of total fees</Typography>
              </Box>
              <Box className="same_cntnt">
                <Typography className="lght_txt">Reward for lvl 2</Typography>
                <Typography>15% of total fees</Typography>
              </Box>
              <Box className="same_cntnt">
                <Typography className="lght_txt">Reward for lvl 3</Typography>
                <Typography>20% of total fees </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
