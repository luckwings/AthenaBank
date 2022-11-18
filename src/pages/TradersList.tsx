import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useLoader } from "../components/Loader";
import getSign from "../helpers/get-sign";
import TraderDetailAPI, { TraderDetailModel } from "../helpers/TraderDetailAPI";

export function TraderInfo({ data }: { data: TraderDetailModel }) {
  const isPositive = data.lastYearPerformance >= 0;

  return (
    <Link to={`/traderlockhistory/${data.address}`} className="orng_brdr_link">
      <Box className="def_trdr_bx">
        <Box className="lft_trdr_bx">
          <Box component="img" className="traderpreview" src={data.image} />
        </Box>
        <Box className="rght_trdr_bx">
          <Typography className="yllw_txt">{data.risksTaken} RISKK</Typography>
          <Typography component="h5">
          {data.name}
            {/* {data.name} <span>- {data.username}</span> */}
          </Typography>
          <Typography className={isPositive ? "green_txt" : "red_txt"}>
            {getSign(data.lastYearPerformance)}
            {data.lastYearPerformance}%<span>GAIN (LAST 12M)</span>
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

export default function TradersList() {
  const [data, setData] = useState<TraderDetailModel[]>([]);
  const [tillIndex, setTillIndex] = useState(15);
  const {
    el: loader,
    show,
    hide,
  } = useLoader(
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
        <Grid item xs={12} sm={6} xl={4} key={item}>
          <Skeleton variant="rectangular" height={117} />
        </Grid>
      ))}
    </>
  );

  useEffect(() => {
    show();
    setData([]);
    TraderDetailAPI.getAll()
    .then((traders) => {
      setData(traders);
      hide();
    });
  }, [show, hide]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Box className="trdr_list_main_bx trader_lock_bx">
        <Typography component="h2" className="def_h2">
          Traders List
        </Typography>
        <Grid container spacing={4}>
          {loader}
          {data
            .filter((_, index) => index < tillIndex)
            .map((item, index) => (
              <Grid item xs={12} sm={6} xl={4} key={index}>
                <TraderInfo data={item} />
              </Grid>
            ))}
        </Grid>
        {data.length > tillIndex && (
          <Button className="def_yylw_btn viewmore_btn" onClick={() => setTillIndex((prev) => prev + 3)}>
            View More
          </Button>
        )}
      </Box>
    </>
  );
}
