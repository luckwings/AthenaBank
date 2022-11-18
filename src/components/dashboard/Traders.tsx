import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useLoader } from "../Loader";
import { TraderInfo } from "../../pages/TradersList";
import TraderDetailAPI, { TraderDetailModel } from "../../helpers/TraderDetailAPI";
import getSign from "../../helpers/get-sign";
import { toFixed4 } from "../../helpers/toFixed4";

export default function Traders() {
  const [data, setData] = useState<TraderDetailModel[]>([]);
  const [profit, setProfit] = useState(0);
  const {
    el: loader,
    show,
    hide,
  } = useLoader(
    <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} xl={4} data-aos="fade-up" key={item}>
          <Skeleton variant="rectangular" height={117} />
        </Grid>
      ))}
    </>
  );

  useEffect(() => {
    show();
    setData([]);
    TraderDetailAPI.getAll().then((traders) => {
      const profits = traders.slice(0, 50).map((trader) => trader.lastYearPerformance);
      setProfit(profits.reduce((acc, curr) => acc + curr, 0) / profits.length);
      setData(traders.slice(0, 6));
      hide();
    });
  }, [show, hide]);

  return (
    <Box className="trader_main_bx">
      <Box className="trdr_info_bx">
        <Box className="lft_info">
          <Typography component="h2" className="def_h2" data-aos="fade-up">
            Top Performing Traders
          </Typography>
          <Typography data-aos="fade-up" data-aos-duration="800">
            Follow our top performing traders/youtubers to learn and enhance your asset management returns to
            unprecedented levels. Improve your ROI over time thanks to our highly experienced traders.
          </Typography>
          <Link to="/traderslist" className="def_yylw_btn yllw_a" data-aos="zoom-in">
            Discover People
          </Link>
        </Box>
        <Box className="rght_info" data-aos="fade-up" data-a="1200">
          <Box className="txt_cntnt">
            <Typography component="h1" className={profit < 0 ? "red_txt" : ""}>
              {getSign(profit)}
              {toFixed4(profit)}%
            </Typography>
            <Typography>AVERAGE YEAR PROFIT</Typography>
            <Typography className="lght_txt">Of our 50 most copied traders for 2021</Typography>
          </Box>
          <Box className="img_cntnt">
            <Box component="img" src="/img/avrg_img.png" />
          </Box>
        </Box>
      </Box>
      <Grid container spacing={4}>
        {loader}
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} xl={4} data-aos="fade-up" key={index}>
            <TraderInfo data={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
