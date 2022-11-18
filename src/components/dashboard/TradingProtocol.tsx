import {
  Box,
  Typography,
  Grid,
  Button
} from "@mui/material";

export default function TradingProtocol({liquidity, totalCount, userCount, liquidityLocked}) {

  return (
    <>
      <Box className="trdng_prfl_bx">
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <Box className="the_trdng_bx" data-aos="fade-up" data-aos-duration="800">
              <Typography component="h2" className="def_h2">
                The Trading<br /> Protocol for Everyone!
              </Typography>
              <Typography>AthenaBank helps everyone to partecipate in new IDOs, and increase their investment using a 100% secured managed trader contract. Join a community of over 140 professional trasders today!</Typography>
              <Box className="two_btn_bx">
                <a href='https://docs.google.com/forms/d/e/1FAIpQLSeEMabQm3J5uoDi_xe6fgtX8BEsC9ZwcS6WSGemgGTnRQBraw/viewform' target="_blank">
                <Button className="def_yylw_btn">
                  <Box component="img" src="/img/create_ic.svg" />
                  Partecipate
                </Button>
                </a>
                <a href='/doc/WHITEPAPER_ATHENA_CRYPTO_BANK.pdf' target="_blank">
                  <Button className="def_blue_btn">
                    Whitepaper
                  </Button>
                </a>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="for_boxes_bx">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Box className="def_for_bx pulse" data-aos="fade-up" data-aos-duration="1000">
                    <Typography component="h3">${liquidity}</Typography>
                    <Box className="yllw_insd">
                      <Box component="img" src="/img/ttl_lqdty_ic.svg" />
                      <Typography>Total Liquidity Raised</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className="def_for_bx pulse" data-aos="fade-up" data-aos-duration="1200">
                    <Typography component="h3">{totalCount}</Typography>
                    <Box className="yllw_insd">
                      <Box component="img" src="/img/ttl_project_ic.svg" />
                      <Typography>Total Smart Contracts</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className="def_for_bx pulse" data-aos="fade-up" data-aos-duration="1400">
                    <Typography component="h3">{userCount}</Typography>
                    <Box className="yllw_insd">
                      <Box component="img" src="/img/ttl_prtcpnts_ic.svg" />
                      <Typography>Total Users</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className="def_for_bx pulse" data-aos="fade-up" data-aos-duration="1600">
                    <Typography component="h3">{liquidityLocked}</Typography>
                    <Box className="yllw_insd">
                      <Box component="img" src="/img/ttl_lock_ic.svg" />
                      <Typography>Total ATH Locked</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Box className="athena_img img-fluid vert-move" component="img" src="/img/athena_dsbrd_img.png" data-aos="fade-up" data-aos-duration="2500" />
      </Box>
    </>
  )
}
