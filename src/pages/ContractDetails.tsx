import React, { useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  FormLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
} from "@mui/material";
import UsernameDetail from "../components/dashboard/UsernameDetail";
import TradingContracts, { TradingContractsRow } from "../components/contract-details/TradingContracts";
import ProjectContracts, { ProjectContractRow } from "../components/contract-details/ProjectContracts";
// import PastContracts, { PastContractsRow } from "../components/contract-details/PastContracts";
import { useWeb3Context } from "../hooks";
import TraderLockAPI from "../helpers/TraderLockAPI";
import useApi, { useAsyncRender, useDataApi } from "../hooks/useApi";
import AthenaSkeleton from "../components/AthenaSkeleton";
import { TraderlockContract } from "../helpers/traderlock-contract";
import ProjectAPI from "../helpers/ProjectAPI";
import { toFixed4 } from "../helpers/toFixed4";
import { ethers } from "ethers";
import { IDOContract } from "../abi";
import { convertWei } from "../helpers/convert-wei";
import UserAPI, { UserModel } from "../helpers/userAPI";
import { useState } from "react";

const NA = "Not Setted";

export default function ContractDetails() {
  const { address, provider, chainID } = useWeb3Context();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getTradingContracts = useCallback(async () => {
    if (!address) {
      return new Promise<TradingContractsRow[]>((res) => res([]));
    }
    const traderlocks = await TraderLockAPI.getAll();
    const rows: TradingContractsRow[] = [];
    for (const row of traderlocks) {
      const contract = new TraderlockContract(row.contract, provider, chainID, address, row.lpTokenPair);
      const investedAmount = await contract.getInvestedAmount(address);
      if (investedAmount > 0) {
        const period = await contract.getPeriod();
        const claimedValue = await contract.getClaimedValue(address);
        if (period === "TRADING" || (period === "CLAIMING" && claimedValue !== 0)) {
          const endTime = await contract.getTradingEndTime();
          const currentBal = await contract.getCurrentBalance(row, address);
          rows.push({
            period,
            endTime: endTime.tradingEndTime,
            investedAmount: investedAmount,
            name: row.traderUsername,
            profit: toFixed4((currentBal.percent / 100) * investedAmount),
            profitPercentage: toFixed4(currentBal.percent),
            token: row.initialValue.token,
            traderImage: row.trader.image,
            address: row.contract,
          });
        }
      }
    }
    return rows;
  }, [address, chainID, provider]);

  const { data: tradingContractRows, loadUI } = useApi(getTradingContracts);

  const getPastTradingContracts = useCallback(async () => {
    if (!address) {
      return new Promise<TradingContractsRow[]>((res) => res([]));
    }
    const traderlocks = await TraderLockAPI.getAll();
    const rows: TradingContractsRow[] = [];
    for (const row of traderlocks) {
      const contract = new TraderlockContract(row.contract, provider, chainID, address, row.lpTokenPair);
      const investedAmount = await contract.getInvestedAmount(address);
      // if (investedAmount > 0) {
      const period = await contract.getPeriod();
      const claimedValue = await contract.getClaimedValue(address);
      if (period === "CLAIMING" && claimedValue === 0) {
        const endTime = await contract.getTradingEndTime();
        const currentBal = await contract.getCurrentBalance(row, address);
        rows.push({
          period,
          endTime: endTime.tradingEndTime,
          investedAmount: investedAmount,
          name: row.traderUsername,
          profit: toFixed4((currentBal.percent / 100) * investedAmount),
          profitPercentage: toFixed4(currentBal.percent),
          token: row.initialValue.token,
          traderImage: row.trader.image,
          address: row.contract,
        });
        // }
      }
    }
    return rows;
  }, [address, chainID, provider]);
  const pastTradingContractRenderer = useAsyncRender(getPastTradingContracts, [getPastTradingContracts]);

  const activeProjects = useCallback(async () => {
    if (!address) {
      return new Promise<ProjectContractRow[]>((res) => res([]));
    }
    const rows: ProjectContractRow[] = [];
    const currTime = +new Date();
    const res = await ProjectAPI.getAll();
    const data = res.filter(
      (project) => +new Date(project.presale.startTime) < currTime && +new Date(project.presale.endTime) > currTime
    );
    for (const item of data) {
      const contract = new ethers.Contract(item.contractAddress, IDOContract, provider);
      const sales = await contract.sales(address);
      rows.push({
        contractAddress: item.contractAddress,
        name: item.periodData.name,
        claimedAmount: toFixed4(convertWei(sales.tokensWithdrawn)),
        claimableAmount: sales.allocatedAmount > 0 ? toFixed4(convertWei(await contract.claimableAmount(address))) : 0,
        investedAmount: toFixed4(convertWei(sales.allocatedAmount)),
        token: item.periodData.baseToken,
        image: item.periodData.image,
      });
    }
    return rows;
  }, [address, provider]);

  const { data: activeProjectRows, loadUI: activeProjectsUI } = useApi(activeProjects);
  const pastProjects = useCallback(async () => {
    if (!address) {
      return new Promise<ProjectContractRow[]>((res) => res([]));
    }
    const rows: ProjectContractRow[] = [];
    const currTime = +new Date();
    const res = await ProjectAPI.getAll();
    const data = res.filter(
      (project) => +new Date(project.presale.startTime) < currTime && +new Date(project.presale.endTime) < currTime
    );
    for (const item of data) {
      const contract = new ethers.Contract(item.contractAddress, IDOContract, provider);
      const sales = await contract.sales(address);
      rows.push({
        contractAddress: item.contractAddress,
        name: item.periodData.name,
        claimedAmount: toFixed4(convertWei(sales.tokensWithdrawn)),
        claimableAmount: sales.allocatedAmount > 0 ? toFixed4(convertWei(await contract.claimableAmount(address))) : 0,
        investedAmount: toFixed4(convertWei(sales.allocatedAmount)),
        token: item.periodData.baseToken,
        image: item.periodData.image,
      });
    }
    return rows;
  }, [address, provider]);

  const { data: pastProjectRows, loadUI: pastProjectsUI } = useApi(pastProjects);

  const { data: userData, render: userDataRender } = useDataApi(() => UserAPI.get(address), [address]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [model, setModel] = useState<UserModel>();

  useEffect(() => {
    setModel(userData);
  }, [userData]);

  const onUserDataChange = (e: any, field: keyof UserModel) => {
    setModel({ ...model, [field]: e.target.value });
  };

  const onSave = () => {
    UserAPI.modify(address, model).then(() => setIsEditMode((prev) => !prev));
  };

  return (
    <Box className="cntrct_dtl_main_bx">
      <Container>
        <UsernameDetail />
        <Typography component="h4" className="def_h4">
          Active Trading Contracts
        </Typography>
        {loadUI(
          <TradingContractsSkeleton />,
          (tradingContractRows || []).length === 0 ? (
            <TradingContractsMessageTable message={"No data availale"} />
          ) : (
            <TradingContracts rows={tradingContractRows || []} />
          ),
          <TradingContractsMessageTable message={"Cannot fetch data..."} />
        )}
        <Typography component="h4" className="def_h4">
          Past Trading Contracts
        </Typography>
        {pastTradingContractRenderer(
          <TradingPastContractsSkeleton />,
          (data) =>
            (data || []).length === 0 ? (
              <TradingPastContractsMessageTable message={"No data availale"} />
            ) : (
              <TradingContracts rows={data || []} />
            ),
          () => (
            <TradingPastContractsMessageTable message={"Cannot fetch data..."} />
          )
        )}
        <Typography component="h4" className="def_h4">
          Active Project Contracts
        </Typography>
        {activeProjectsUI(
          <ProjectContractsSkeleton />,
          activeProjectRows?.length === 0 ? (
            <ProjectContractsMessageTable message={"No data availale"} />
          ) : (
            <ProjectContracts rows={activeProjectRows} />
          ),
          <ProjectContractsMessageTable message={"Cannot fetch data..."} />
        )}
        {/* <ProjectContracts /> */}
        <Typography component="h4" className="def_h4">
          Past Contracts
        </Typography>
        {pastProjectsUI(
          <ProjectContractsSkeleton />,
          pastProjectRows?.length === 0 ? (
            <ProjectContractsMessageTable message={"No data availale"} />
          ) : (
            <ProjectContracts rows={pastProjectRows} />
          ),
          <ProjectContractsMessageTable message={"Cannot fetch data..."} />
        )}
        {/* <PastContracts /> */}
        <Typography component="h4" className="def_h4">
          Other Settings
        </Typography>
        <Box className="other_sttng_bx">
          {userDataRender(
            <Grid container spacing={4}>
              {[
                "First Name",
                "Last Name",
                "Email",
                "Is Verified",
                "Address",
                "Location",
                "Company Name",
                "Telegram",
                "Discord",
              ].map((item) => (
                <Grid item xs={12} md={6} key={item}>
                  <FormLabel>{item}</FormLabel>
                  <Typography component="h4">
                    <AthenaSkeleton width={200} />
                  </Typography>
                </Grid>
              ))}
            </Grid>,
            (data) => (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <FormLabel>First Name</FormLabel>
                  <UserDataInput model={model} field="firstName" onChange={onUserDataChange} disabled={!isEditMode} />
                  {/* <Typography component="h4">{data.firstName || NA}</Typography> */}
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Last Name</FormLabel>
                  <UserDataInput model={model} field="lastName" onChange={onUserDataChange} disabled={!isEditMode} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Email</FormLabel>
                  <UserDataInput
                    model={model}
                    field="email"
                    type="email"
                    onChange={onUserDataChange}
                    disabled={!isEditMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Is Verified</FormLabel>
                  <Typography variant="body1">{data.isVerified ? "Yes" : "No"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Address</FormLabel>
                  <UserDataInput model={model} field="address" onChange={onUserDataChange} disabled={!isEditMode} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Location</FormLabel>
                  <UserDataInput model={model} field="location" onChange={onUserDataChange} disabled={!isEditMode} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Telegram</FormLabel>
                  <UserDataInput model={model} field="telegram" onChange={onUserDataChange} disabled={!isEditMode} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormLabel>Discord</FormLabel>
                  <UserDataInput model={model} field="discord" onChange={onUserDataChange} disabled={!isEditMode} />
                </Grid>
                <Grid item xs={12} md={6} display="flex" justifyContent="flex-end" alignItems={"flex-end"} gap={4}>
                  {isEditMode && <Button onClick={onSave}>Save</Button>}
                  <Button onClick={() => setIsEditMode((prev) => !prev)}>{isEditMode ? "Cancel" : "Edit"}</Button>
                </Grid>
              </Grid>
            ),
            (err) => (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography component="h4">{address ? "Cannot fetch data..." : "Connect Wallet"}</Typography>
                </Grid>
              </Grid>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}

type UserDataInputProps = {
  model: UserModel;
  field: keyof UserModel;
  onChange: (e, field: keyof UserModel) => void;
  disabled: boolean;
  type?: string;
};

const UserDataInput = ({ model, field, onChange, disabled, type }: UserDataInputProps) => (
  <TextField
    inputProps={{
      sx: {
        pl: 0,
        py: 1,
        color: "white",
        "&:focus": {
          outline: "none",
        },
      },
    }}
    sx={{
      display: "block",
      "& .MuiOutlinedInput-root": {
        borderBottom: !disabled ? "1px solid white" : "1px solid transparent",
        borderRadius: 0,
      },
    }}
    type={type || "text"}
    value={!model || (disabled && !model[field]) ? NA : model[field]}
    onChange={(e) => onChange(e, field)}
    disabled={disabled}
  />
);

const TradingContractsSkeleton = () => (
  <TableSkeleton headers={["Trading Contract", "Invested Amount", "Profit", "Contract Ending"]} />
);

const TradingPastContractsSkeleton = () => (
  <TableSkeleton headers={["Trading Contract", "Invested Amount", "Profit", "Contract Ending"]} />
);

const ProjectContractsSkeleton = () => (
  <TableSkeleton headers={["IDO", "Invested Amount", "Claimed Amount", "Claimable Amount"]} />
);

// const PastContractsSkeleton = () => (
//   <TableSkeleton headers={["IDO", "Invested Amount", "Profit", "Claimable Amount"]} />
// );

const TradingContractsMessageTable = ({ message }) => (
  <MessageTable headers={["Trading Contract", "Invested Amount", "Profit", "Contract Ending"]} message={message} />
);

const TradingPastContractsMessageTable = ({ message }) => (
  <MessageTable headers={["Trading Contract", "Invested Amount", "Profit", "Contract Ending"]} message={message} />
);

const ProjectContractsMessageTable = ({ message }) => (
  <MessageTable headers={["IDO", "Invested Amount", "Claimed Amount", "Claimable Amount"]} message={message} />
);

// const PastContractsMessageTable = ({ message }) => (
//   <MessageTable headers={["IDO", "Invested Amount", "Profit", "Claimable Amount"]} message={message} />
// );

const TableSkeleton = (props: { headers: string[] }) => {
  return (
    <Box className="def_trdng_tbl def_tbl">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> {props.headers[0]} </TableCell>
              <TableCell align="center"> {props.headers[1]} </TableCell>
              <TableCell align="center"> {props.headers[2]} </TableCell>
              <TableCell align="center"> {props.headers[3]} </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2].map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <AthenaSkeleton variant="rectangular" width={200} height={40} />
                </TableCell>
                <TableCell align="center">
                  <AthenaSkeleton variant="rectangular" width={200} height={40} />
                </TableCell>
                <TableCell align="center">
                  <AthenaSkeleton variant="rectangular" width={200} height={40} />
                </TableCell>
                <TableCell align="center">
                  <AthenaSkeleton variant="rectangular" width={200} height={40} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const MessageTable = (props: { headers: string[]; message: string }) => {
  return (
    <Box className="def_trdng_tbl def_tbl">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> {props.headers[0]} </TableCell>
              <TableCell align="center"> {props.headers[1]} </TableCell>
              <TableCell align="center"> {props.headers[2]} </TableCell>
              <TableCell align="center"> {props.headers[3]} </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row" colSpan={4}>
                <Typography>{props.message}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
