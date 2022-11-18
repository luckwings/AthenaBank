import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import getSign from "../../helpers/get-sign";
import Countdown from "react-countdown";

export interface TradingContractsRow {
  name: string;
  investedAmount: number;
  token: string;
  profit: number;
  profitPercentage: number;
  endTime: number;
  period: string;
  address: string;
  traderImage: string;
}

export interface TradingContractsProps {
  rows: TradingContractsRow[];
}

export default function TradingContracts({ rows }: TradingContractsProps) {
  return (
    <Box className="def_trdng_tbl def_tbl">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Traded Contract</TableCell>
              <TableCell align="center">Invested Amount</TableCell>
              <TableCell align="center">Profit</TableCell>
              <TableCell align="center">Contract Ending</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Link to={"/perioddetail?contract=" + row.address}>
                    <Box className="img_txt_bx">
                      <Box component="img" src={row.traderImage} />
                      <Typography>{row.name}</Typography>
                    </Box>
                  </Link>
                </TableCell>
                <TableCell align="center">
                  {row.investedAmount} {row.token}
                </TableCell>
                <TableCell align="center">
                  <Typography>
                    {row.profit}
                    <span className={row.profitPercentage >= 0 ? "" : "red_txt"}>
                      {getSign(row.profitPercentage)}
                      {row.profitPercentage}%
                    </span>
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Countdown date={row.endTime} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
