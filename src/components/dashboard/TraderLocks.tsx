import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { TraderLockData } from "../../models/TraderLockData";
import { useLoader } from "../Loader";
import { TraderLock, TraderLockSkeleton } from "../trader-lock/TraderLock";
import TraderLockAPI from "../../helpers/TraderLockAPI";

export default function TraderLocks() {
  const [data, setData] = useState<TraderLockData[]>([]);
  const {
    el: loaderEl,
    show,
    hide,
    loading: isLoading,
  } = useLoader(
    <Grid item xs={12} sm={6} lg={4} data-aos="fade-up" data-aos-duration="1000">
      <TraderLockSkeleton />
    </Grid>
  );

  useEffect(() => {
    show();
    TraderLockAPI.getAll().then((data) => {
      const finalData = data.slice(-3).reverse();
      setData(finalData);
      hide();
    });
  }, [hide, show]);

  return (
    <Box className="trdrlck_main_bx">
      <Typography component="h2" className="def_h2" data-aos="fade-up" data-aos-duration="800">
        Recent Top Performing Trading Contracts
      </Typography>
      <Grid container spacing={4}>
        {loaderEl}
        {loaderEl}
        {loaderEl}
        {data?.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <TraderLock data={item} />
            </Grid>
          ))}

        {(data.length === 0) && (
          <Box display="flex" justifyContent="center" width="100%" m={4}>
            <Typography variant="h5" data-aos="fade-up" data-aos-duration="800" className="emptydb">
              No Trading Contracts available at the moment. Subscribe to our newsletter to stay updated about our
              upcoming IDO.
            </Typography>
          </Box>
        )}
      </Grid>
      {/* <Link
        className="def_yylw_btn viewmore_btn btnaslnk"
        to="/activetraderlock"
        data-aos="zoom-in"
        data-aos-duration="2200"
      >
        View More
      </Link> */}
    </Box>
  );
}
