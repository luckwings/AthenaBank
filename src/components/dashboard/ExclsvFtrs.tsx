import React from 'react';
import {
    Box,
    Typography,
    Grid,
  } from "@mui/material";

export default function ExclsvFtrs() {
  return (
    <>
        <Box className="exlsvftr_bx">
            <Typography component="h2" className="def_h2" data-aos="fade-up" data-aos-duration="800">Exclusive Features</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box className="def_ftr_bx" data-aos="fade-up" data-aos-duration="1000">
                        <Box className="ftr_lft_cntnt">
                            <Box className="bg_bx">
                                <Box component="img" src="/img/features_01.svg" />
                            </Box>
                        </Box>
                        <Box className="ftr_rght_cntnt">
                            <Typography component="h6">Secure by design</Typography>
                            <Typography>With introduction of smart contracts, investment activities will move from a centralized platform to a fully decentralized one.</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className="def_ftr_bx" data-aos="fade-up" data-aos-duration="1200">
                        <Box className="ftr_lft_cntnt">
                            <Box className="bg_bx">
                                <Box component="img" src="/img/features_02.svg" />
                            </Box>
                        </Box>
                        <Box className="ftr_rght_cntnt">
                            <Typography component="h6">Downgrading fees</Typography>
                            <Typography>ATH token can nonetheless be acquired and held in a smart contract to aquire a higher level and qualify for early presale participation/investment funds and lower fees.</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className="def_ftr_bx" data-aos="fade-up" data-aos-duration="1400">
                        <Box className="ftr_lft_cntnt">
                            <Box className="bg_bx">
                                <Box component="img" src="/img/features_03.svg" />
                            </Box>
                        </Box>
                        <Box className="ftr_rght_cntnt">
                            <Typography component="h6">Tokens discount</Typography>
                            <Typography>Athena allows its investors to acquire digital assets at a discounted price compared to the public offering. Users who own ATH, the platform’s native token, gets a discount based on the number of tokens held and locked on the platform.</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className="def_ftr_bx" data-aos="fade-up" data-aos-duration="1600">
                        <Box className="ftr_lft_cntnt">
                            <Box className="bg_bx">
                                <Box component="img" src="/img/features_04.svg" />
                            </Box>
                        </Box>
                        <Box className="ftr_rght_cntnt">
                            <Typography component="h6">Staking rewards</Typography>
                            <Typography>Locking a certain amount of USDT or BTC users can earn a net annual passive income of around 7%. Athena’s staking function connects automatically to other DeFi platforms, such as Venus or BeFi, to allow users to farm directly from the Athena website.</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className="def_ftr_bx" data-aos="fade-up" data-aos-duration="1800">
                        <Box className="ftr_lft_cntnt">
                            <Box className="bg_bx">
                                <Box component="img" src="/img/features_05.svg" />
                            </Box>
                        </Box>
                        <Box className="ftr_rght_cntnt">
                            <Typography component="h6">DYOR datas</Typography>
                            <Typography>All of the projects that will be available to participate in Athena platform, will go into a thorough research to ensure the security of the users investments.</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className="def_ftr_bx" data-aos="fade-up" data-aos-duration="2000">
                        <Box className="ftr_lft_cntnt">
                            <Box className="bg_bx">
                                <Box component="img" src="/img/features_06.svg" />
                            </Box>
                        </Box>
                        <Box className="ftr_rght_cntnt">
                            <Typography component="h6">Risk level alert</Typography>
                            <Typography>The risk of the projects available in Athena platform will be visible for the people, Our team research and carefully select the best projects to minimize the risk of investing.</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}
