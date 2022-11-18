import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, Grid, Button, FormControl, MenuItem, Select, Input, Container } from "@mui/material";
import { PeriodName, TraderLockData } from "../../models/TraderLockData";
import { useLoader } from "../Loader";
import { TraderLock, TraderLockSkeleton } from "./TraderLock";
import TraderLockAPI from "../../helpers/TraderLockAPI";
import { TraderlockContract } from "../../helpers/traderlock-contract";
import { useWeb3Context } from "../../hooks";

const ariaLabel = { "aria-label": "description" };

interface ITraderLockListProps {
  type: PeriodName;
  header: string;
}

const DEFAULT_TILL_INDEX = 15;

export default function TraderLockList(props: ITraderLockListProps) {
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const searchChanged = (e) => {
    setSearch(e.target.value);
    setTillIndex(DEFAULT_TILL_INDEX);
  };
  const handleChange = (event: any) => {
    setToken(event.target.value);
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
  const { address, provider, chainID } = useWeb3Context();

  const displayList = useMemo(() => {
    return data
      .filter((item) => (item.initialValue?.token || "").toLowerCase().indexOf(search.toLowerCase()) !== -1)
      .filter((item) => token === "" || item.initialValue?.token === token);
  }, [search, data, token]);

  const tokens = useMemo(() => {
    const tokenObj = {};
    for (const item of data) {
      tokenObj[item.initialValue.token] = item.initialValue.token;
    }
    return Object.entries(tokenObj).map(([key, value]) => ({ key, value }));
  }, [data]);

  const getTradingContracts = useCallback(async () => {
    const traderlocks = await TraderLockAPI.getAll();
    const finalList: TraderLockData[] = [];
    for (const row of traderlocks) {
      const contract = new TraderlockContract(row.contract, provider, chainID, address, row.lpTokenPair);

      const period = await contract.getPeriod();

      if (period === props.type) {
        finalList.push(row);
      }
    }
    setData(finalList);
    hide();
  }, [address, chainID, hide, props.type, provider]);

  useEffect(() => {
    show();
    getTradingContracts();
  }, [getTradingContracts, show]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className="trader_lock_bx" sx={{ minHeight: `calc(100vh - 48px)` }}>
      <Container>
        <Typography component="h2" className="def_h2">
          {props.header}
        </Typography>
        <Box className="def_trdr_name_bx">
          <Input placeholder="Search" inputProps={ariaLabel} onChange={searchChanged} value={search} />
          <Box className="def_slct name_slct">
            <FormControl sx={{ m: 1 }}>
              <Select
                value={token}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>PARTICIPATION TOKEN</em>
                </MenuItem>
                {tokens.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
