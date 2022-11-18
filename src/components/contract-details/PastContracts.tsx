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
import getSign from "../../helpers/get-sign";
export interface PastContractsRow {
  name: string;
  investedAmount: number;
  token: string;
  profit: number;
  profitPercentage: number;
  claimableAmount: number;
  image: string;
}

export interface PastContractsProps {
  rows: PastContractsRow[];
}

export default function PastContracts({ rows }: PastContractsProps) {
  return (
    <>
      <Box className="def_trdng_tbl def_tbl">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>IDO</TableCell>
                <TableCell align="center">Invested Amount</TableCell>
                <TableCell align="center">Profit</TableCell>
                <TableCell align="center">Claimable Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Box className="img_txt_bx">
                      <Box component="img" src={row.image} />
                      <Typography>{row.name}</Typography>
                    </Box>
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
                    {row.claimableAmount} {row.token}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
