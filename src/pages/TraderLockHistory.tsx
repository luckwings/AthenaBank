import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Grid, Button, Input, Container } from "@mui/material";
import { useLoader } from "../components/Loader";
import { TraderLock, TraderLockSkeleton } from "../components/trader-lock/TraderLock";
import { TraderLockData } from "../models/TraderLockData";
import TraderLockAPI from "../helpers/TraderLockAPI";
import { useParams } from "react-router-dom";
import TraderDetailAPI from "../helpers/TraderDetailAPI";
import { useAsyncRender } from "../hooks/useApi";
import AthenaSkeleton from "../components/AthenaSkeleton";

const ariaLabel = { "aria-label": "description" };

const DEFAULT_TILL_INDEX = 15;

export default function TraderLockHistory() {
  const params = useParams();
  const [search, setSearch] = useState("");
  const searchChanged = (e) => {
    setSearch(e.target.value);
    setTillIndex(DEFAULT_TILL_INDEX);
  };

  const [tillIndex, setTillIndex] = useState(DEFAULT_TILL_INDEX);
  const {
    el: loaderEl,
    hide,
    show,
    loading: isLoading,
  } = useLoader(
    <Grid item xs={12} sm={6} lg={4}>
      <TraderLockSkeleton />
    </Grid>
  );
  const [data, setData] = useState<TraderLockData[]>([]);

  const displayList = useMemo(() => {
    return data.filter((item) => (item.initialValue?.token || "").toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }, [search, data]);

  useEffect(() => {
    show();
    TraderLockAPI.getAll().then((traderlocks) => {
      setData(traderlocks.filter((item) => item.trader.address === params.useraddress));
      hide();
    });
  }, [show, hide, params.useraddress]);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nameRender = useAsyncRender(() => TraderDetailAPI.getByAddress(params.useraddress), []);
  
  return (
    <Box className="trader_lock_bx" sx={{ minHeight: `calc(100vh - 48px)` }}>
      <Container>
        <Typography component="h2" className="def_h2">
          {nameRender(
            <AthenaSkeleton width={220} height={50} variant="rectangular" />,
            (data) => (
              <>Traderlocks of {data?.name}</>
            ),
            (error) => (
              <>Error while fetching details</>
            )
          )}
        </Typography>
        <Box className="def_trdr_name_bx">
          <Input placeholder="Search" inputProps={ariaLabel} onChange={searchChanged} value={search} />
        </Box>
        <Grid container spacing={4}>
          {loaderEl}
          {loaderEl}
          {loaderEl}
          {!isLoading &&
            displayList.slice(0, tillIndex).map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <TraderLock data={item} />
              </Grid>
            ))}
        </Grid>
        {!isLoading && displayList.length > tillIndex && (
          <Button className="def_yylw_btn viewmore_btn" onClick={() => setTillIndex((prev) => prev + 3)}>
            View More
          </Button>
        )}
        {!isLoading && displayList.length === 0 && (
          <Typography component="h4" className="def_h4">
            No Traderlock found.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
