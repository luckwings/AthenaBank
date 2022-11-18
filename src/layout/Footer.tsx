import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import AthenaSkeleton from "../components/AthenaSkeleton";
import { ethers } from "ethers";
import { useWeb3Context } from "../hooks";
import { ERC20Contract } from "../abi";
import { getAddresses } from "../constants";
import { convertWei } from "../helpers/convert-wei";
// import Accordion from 'react-bootstrap/Accordion';

export default function Footer({ tokenData }) {
  // const [expanded, setExpanded] = React.useState<string | false>('panel1');

  // const handleChange =
  // (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
  //   setExpanded(newExpanded ? panel : false);
  // };
  const { provider, chainID } = useWeb3Context();
  const currencyContract = new ethers.Contract(getAddresses(chainID).ATHENA, ERC20Contract, provider);
  const [burnt, setBurnt] = useState<number>();
  useEffect(() => {
    setBurnValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setBurnValue = async () => {
    const burn = convertWei(await currencyContract.balanceOf("0x000000000000000000000000000000000000dEaD")); //burn address
    setBurnt(burn);
  };

  const LINK_BTNS = [
    { link: "/img/Facebook.svg", url: "" },
    { link: "/img/twttr_ic_02.svg", url: "https://twitter.com/AthenaCryptBank" },
    { link: "/img/Insta.svg", url: "" },
    { link: "/img/YouTube.svg", url: "" },
    { link: "/img/linkedin.png", url: "Linkedin" },
    { link: "/img/google.png", url: "Google" },
    { link: "/img/tlgrm_ic_02.svg", url: "https://t.me/AthenaCryptoBankGroup" },
    { link: "/img/discord.svg", url: "" },
    // { link: "/img/msg_ic.svg", url: "mailto:info@athenacryptobank.io" },
    // { link: "/img/unvrs_ic.svg", url: "" },
    // { link: "/img/Twitch.svg", url: "" },
    // { link: "/img/doc_ic.svg", url: "" },
    // { link: "/img/trading_view.svg", url: "" },
  ];

  return (
    <>
      <Box className="as_footer">
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Box className="cx_pad_box">
              <Box className="tp_cntnt">
                <Box className="lft_bx">
                  <Box className="logo_img_bx">
                    <Box component="img" src="/img/footer_logo.png" alt="" />
                  </Box>
                  <Typography component="h4">ATH</Typography>
                </Box>
                <Box className="rgt_bx">
                  <Button className="def_yylw_btn">Buy ATH</Button>
                </Box>
              </Box>
              <Box className="bttm_cntnt">
                <Box>
                  <Box className="lft_side">
                    <Typography>Max supply</Typography>
                    <Typography>:</Typography>
                  </Box>
                  <Box className="lft_side">
                    <Typography>Total supply</Typography>
                    <Typography>:</Typography>
                  </Box>
                  <Box className="lft_side">
                    <Typography>Circulating supply</Typography>
                    <Typography>:</Typography>
                  </Box>
                  <Box className="lft_side">
                    <Typography>Total Burned</Typography>
                    <Typography>:</Typography>
                  </Box>
                  <Box className="lft_side">
                    <Typography>Market Cap</Typography>
                    <Typography>:</Typography>
                  </Box>
                </Box>
                {tokenData ? (
                  <Box className="rght_side">
                    {/* <Typography component="h4">{tokenData?.max_supply}</Typography> 
                                        <Typography component="h4">{tokenData?.total_supply}</Typography>
                                        <Typography component="h4">{tokenData?.circulating_supply}</Typography>
                                        <Typography component="h4">{burnt ? burnt : 0}</Typography>
                                        <Typography component="h4">${tokenData?.market_cap}</Typography>*/}
                    <Typography component="h4">100.000.000</Typography>
                    <Typography component="h4">100.000.000</Typography>
                    <Typography component="h4">100.000.000</Typography>
                    <Typography component="h4">{burnt ? burnt : 0}</Typography>
                    <Typography component="h4">$15.000.000</Typography>
                  </Box>
                ) : (
                  <Box className="rght_side">
                    <AthenaSkeleton variant="rectangular" height={28} width={80} />
                    <AthenaSkeleton variant="rectangular" height={28} width={80} />
                    <AthenaSkeleton variant="rectangular" height={28} width={80} />
                    <AthenaSkeleton variant="rectangular" height={28} width={80} />
                    <AthenaSkeleton variant="rectangular" height={28} width={80} />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Box className="about_bx">
              <Accordion className="ftr_acc">
                <AccordionSummary>
                  <Typography>About</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>
                      <Box component="a" href="/team">
                        Project Team
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/terms-and-conditions">
                        Terms Of Service
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="https://athenacryptobank.io/privacy" target="_blank">
                        Privacy Policy
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="https://athenacryptobank.io/contact" target="_blank">
                        Contact Us
                      </Box>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Box className="about_bx">
              <Accordion className="ftr_acc">
                <AccordionSummary>
                  <Typography>Products</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>
                      <Box component="a" href="/">
                        Governance
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/">
                        Liquidity
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/">
                        Launchpools
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/">
                        Analytics
                      </Box>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Box className="about_bx">
              <Accordion className="ftr_acc">
                <AccordionSummary>
                  <Typography>Services</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>
                      <Box component="a" href="/referral">
                        Referral program
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/">
                        ATH Token
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/">
                        Apply to Launch
                      </Box>
                    </li>
                    <li>
                      <Box component="a" href="/">
                        Analytics
                      </Box>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Box className="cmmnty_box">
              <Typography component="h4">Community</Typography>
              <Box className="icon_bx">
                {LINK_BTNS.map((link, index) => (
                  <Box component="a" target="_blank" href={link.url} key={index}>
                    <Box component="img" src={link.link} height={36} width={36} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
