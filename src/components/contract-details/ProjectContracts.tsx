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

export interface ProjectContractRow {
  contractAddress: string;
  name: string;
  investedAmount: number;
  token: string;
  claimedAmount: number;
  claimableAmount: number;
  image: string;
}

export interface ProjectContractsProps {
  rows: ProjectContractRow[];
}

export default function ProjectContracts({ rows }) {
  return (
    <>
      <Box className="def_trdng_tbl def_tbl">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>IDO</TableCell>
                <TableCell align="center">Invested Amount</TableCell>
                <TableCell align="center">Claimed Amount</TableCell>
                <TableCell align="center">Claimable Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Box className="img_txt_bx">
                      <Box component="img" src={row.image} />
                      <Link to={`/dyorareadetail?address=${row.contractAddress}`}>
                        <Typography>{row.name}</Typography>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {row.investedAmount} {row.token}
                  </TableCell>
                  <TableCell align="center">
                    {row.claimedAmount} {row.token}
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
