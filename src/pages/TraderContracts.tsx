import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Container,
  Collapse,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Input,
  DialogContent,
  TextField,
  IconButton,
  Alert,
  DialogActions,
  Slider,
  Stack,
} from "@mui/material";

import UsernameDetail from "../components/dashboard/UsernameDetail";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BootstrapDialog, { BootstrapDialogTitle } from "../components/BootstrapDialog";
import TraderLockAPI from "../helpers/TraderLockAPI";
import { LoaderUtil } from "../components/Loader";
import { TraderLockData } from "../models/TraderLockData";
import { accountEllipsis } from "../helpers";
import { useWeb3Context } from "../hooks";
import { TraderlockContract, TraderlockContractHistory } from "../helpers/traderlock-contract";
import AthenaSkeleton from "../components/AthenaSkeleton";
import getSign from "../helpers/get-sign";
import useApi from "../hooks/useApi";
import Countdown from "react-countdown";
import { getAddresses } from "../constants";
import { ERC20Contract, TraderContract } from "../abi";
import { ethers } from "ethers";
import { convertWei } from "../helpers/convert-wei";
import { toFixed4 } from "../helpers/toFixed4";

const SORT_MAP = {
  TRADING: 1,
  FUNDING: 2,
  CLAIMING: 3,
  FUTURE: 4,
};

export default function TraderContracts() {
  const { address, provider, chainID } = useWeb3Context();

  const tokenlist = [
    "Terra-Luna",
    "Bitcoin-BTCB",
    "Terra-Luna",
    "Casper-CSPR",
    "Ethereum-CSPR",
    "Casper-BTCB",
    "Aptos-APT",
    "Dogecoin-DOGE",
    "Aptos-APT",
    "Terra-Luna",
    "Casper-CSPR",
    "Ethereum-CSPR",
  ];

  const call = useCallback(() => {
    if (!address) {
      return new Promise<TraderLockData[]>((res) => res([]));
    }
    return TraderLockAPI.getAll()
      .then((traderLocks) => traderLocks.filter((item) => item.trader.address === address))
      .then(async (traderLocks) => {
        for (const row of traderLocks) {
          const contract = new TraderlockContract(row.contract, provider, chainID, address, row.lpTokenPair);
          const period = await contract.getPeriod();
          row.periodName = period;
        }
        traderLocks.sort((a, b) => SORT_MAP[a.periodName.toUpperCase()] - SORT_MAP[b.periodName.toUpperCase()]);
        return traderLocks;
      });
  }, [address, chainID, provider]);

  const { data: rows, loadUI } = useApi(call);

  return (
    <>
      <Box className="trdr_cntrct_main_bx">
        <Container>
          {/* <UsernameDetail /> */}
          <Typography component="h4" className="def_h4">
            Create Trader Contract
          </Typography>
          <Box className="rght_cntnt">
            {/* <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contract</TableCell>
                    <TableCell align="center">Initial Balance</TableCell>
                    <TableCell align="center">Current Balance</TableCell>
                    <TableCell align="center">Fee</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadUI(
                    <>
                      <RowSkeleton />
                      <RowSkeleton />
                      <RowSkeleton />
                      <RowSkeleton />
                    </>,
                    (rows || []).length > 0 ? (
                      rows?.map((row, index) => <Row key={index} row={row} />)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography align="center" mt={1}>
                            No Contracts Available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ),
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography align="center" mt={1}>
                          Can not get the data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer> */}
            <Box className="rgt_bx">
              <Button className="def_yylw_btn">Copy trading in dex</Button>
            </Box>
            <Box className="rgt_bx">
              <Button className="def_blue_btn">Copy trading in cex</Button>
            </Box>
          </Box>
        </Container>
        <Container>
weq
        </Container>
      </Box>
    </>
  );
}

function Row({ row }: { row: TraderLockData }) {
  const [open, setOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [slippageDialogOpen, setSlippageDialogOpen] = useState(false);
  const [slippage, setSlippage] = useState(3);
  const [balance, setBalance] = useState<number>();
  // const [period, setPeriod] = useState<string>();

  const { provider, address, chainID } = useWeb3Context();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const call = useCallback(async () => {
    if (!address) {
      return;
    }

    const contract = new TraderlockContract(row.contract, provider, chainID, address, row.lpTokenPair);
    // const period = await contract.getPeriod();
    // setPeriod(period);
    return contract.getCurrentBalance(row);
  }, [address, chainID, provider, row]);

  const { data, isLoading, loadUI } = useApi(call);

  const fetchBalance = async () => {
    LoaderUtil.show();
    const signer = await provider.getSigner();
    const contract = await new ethers.Contract(row.contract, TraderContract, provider);
    const currency = await contract.participationToken();
    const currencyContract = await new ethers.Contract(currency, ERC20Contract, signer);
    const walletBal = convertWei(await currencyContract.balanceOf(row.contract));
    LoaderUtil.hide();
    setBalance(walletBal);
    setSwapDialogOpen(true);
  };

  const Skeleton = ({ num }) => {
    return (
      <Box display="flex" gap={3}>
        {Array(num)
          .fill("")
          .map((item, index) => (
            <Box flex={1} key={index}>
              <AthenaSkeleton height={40} />
            </Box>
          ))}
      </Box>
    );
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <Box className="txt_btn_bx">
            {/* <Typography>1F1tAaz5x1...NLbt</Typography> */}
            <Typography>
              <a
                href={"/perioddetail?contract=" + row.contract}
                target="_blank"
                style={{ color: "white", textDecoration: "underline" }}
              >
                {accountEllipsis(row.contract)}
              </a>
            </Typography>
            <Button className="orng_btn">{row.periodName}</Button>
          </Box>
        </TableCell>
        <TableCell align="center">
          {loadUI(<Skeleton num={2} />, `${data?.initialBalance} ${data?.token}`, "Can not get data...")}
        </TableCell>
        <TableCell align="center">
          {loadUI(
            <Skeleton num={3} />,
            <Typography>
              {data?.currentBalance} {data?.token}{" "}
              <span className={data?.percent < 0 ? "red_txt" : ""}>
                {getSign(data?.percent)}
                {data?.percent}%
              </span>
            </Typography>,
            "Can not get data..."
          )}
        </TableCell>
        <TableCell align="center">
          {loadUI(<Skeleton num={4} />, `${data?.fee} ${data?.token}`, "Can not get data...")}
        </TableCell>
        <TableCell align="right">
          <Box className="ic_bx">
            <Button
              onClick={() => {
                setShowChart((prev) => !prev);
                if (!showChart) {
                  setOpen(true);
                }
              }}
            >
              <Box height={24} width={24} component="img" src="/img/grah_ic.svg" />
            </Button>
            <Button>
              <Box component="img" src="/img/wallet_icon.png" onClick={() => fetchBalance()} />
              <WalletDialog
                balance={balance}
                open={swapDialogOpen}
                token={data?.token}
                provider={provider}
                contract={row.contract}
                lpTokenPair={row.lpTokenPair}
                chainID={chainID}
                onClose={() => setSwapDialogOpen(false)}
              />
            </Button>
            <a href={"https://bscscan.com/address/" + row.contract} target="_blank">
              <Box height={24} width={24} component="img" src="/img/bscscan.png" />
            </a>
            <Button>
              <Box component="img" src="/img/setting_ic.svg" onClick={() => setSlippageDialogOpen(true)} />
              <SlippageDialog
                open={slippageDialogOpen}
                onClose={(value) => {
                  setSlippageDialogOpen(false);
                  setSlippage(value);
                }}
              />
            </Button>
          </Box>
        </TableCell>
        <TableCell>
          <IconButton aria-label="expand row" disabled={isLoading} size="small" onClick={() => setOpen(!open)}>
            <Box className={`${open ? "close_arrw" : "open_arrw"} opn_cls_btn`}>
              <Box component="img" src="/img/chart_slct.svg" />
            </Box>
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <CollapsedRow open={open} data={row} slippage={slippage} period={row.periodName} showChart={showChart} />
        </TableCell>
      </TableRow>
    </>
  );
}

const WalletDialog = ({ open, onClose, balance, token, provider, contract, lpTokenPair, chainID }) => {
  const [address, setAddress] = useState("");
  const [balances, setBalances] = useState<{ name; amount; address }[]>([]);
  // const [bal, setBal] = useState(balance);
  // const [name, setName] = useState(token);

  const getBalance = useCallback(
    async (address) => {
      LoaderUtil.show();
      try {
        const traderLockContract = new TraderlockContract(contract, provider, chainID, address, lpTokenPair);
        const balance = await traderLockContract.getAllBalance();
        const balances: { name; amount; address }[] = [];
        for (const key in balance.tokens) {
          const token = balance.tokens[key];
          if (!address || address === key) {
            balances.push({
              name: token.name,
              address: key,
              amount: token.amount,
            });
          }
        }
        setBalances(balances);
        LoaderUtil.hide();
      } catch (e) {
        console.log(e);
      }
      LoaderUtil.hide();
    },
    [chainID, contract, lpTokenPair, provider]
  );

  useEffect(() => {
    getBalance("");
  }, [getBalance]);

  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open} className="swap_dialog">
      <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
        Contract Token Balance
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box className="innr_popup">
          <Box className="pstn_rltv_bx">
            <Box>
              <Typography>Balance</Typography>
              {balances.map((entry) => (
                <Typography component="h6" key={entry.address}>
                  {toFixed4(entry.amount || 0)} {entry.name}
                </Typography>
              ))}
            </Box>
            <Box component="img" src="/img/wllt_mny_ic.svg" />
          </Box>
          <Typography>Add custom token</Typography>
          <Box className="inpt_bx def_inpt_btn">
            <TextField
              fullWidth
              id="fullWidth"
              placeholder="0X...…...0000"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button className="def_yylw_btn" onClick={() => getBalance(address)}>
              Add Token
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

const SlippageDialog = ({ open, onClose }) => {
  const [slippage, setSlippage] = useState(3);

  return (
    <BootstrapDialog
      onClose={() => onClose()}
      aria-labelledby="customized-dialog-title"
      open={open}
      className="swap_dialog"
    >
      <BootstrapDialogTitle id="slippage-dialog-title" onClose={() => onClose()}>
        Slippage
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box className="innr_popup">
          <Box className="inpt_bx def_inpt_btn">
            <TextField
              fullWidth
              id="slippage"
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(+e.target.value)}
            />
            <Button className="def_yylw_btn" onClick={() => onClose(slippage)}>
              OK
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface SwapInputProps {
  whiteListedTokens;
  value;
  onValueChange;
  currency;
  onCurrencyChange;
  disabled?;
  contract?;
  selectDisabled?;
  onBlur?;
  afterEl?;
  onMax?;
  forceUpdate?;
}

const SwapInput = (props: SwapInputProps) => {
  const { provider } = useWeb3Context();
  // const [value, setValue] = useState(100);
  const [max, setMax] = useState(0);
  useEffect(() => {
    if (!props.disabled) {
      getBalance(props.currency);
    }
  }, [props.currency]);

  const Levels = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 25,
      label: "25%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 75,
      label: "75%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  const getSliderValue = () => {
    const val = max > 0 ? (props.value * 100) / max : 0;
    return val > 100 ? 100 : val;
  };

  const getBalance = async (currency) => {
    try {
      const signer = await provider.getSigner();
      const currencyContract = await new ethers.Contract(currency, ERC20Contract, signer);
      const walletBal = convertWei(await currencyContract.balanceOf(props.contract));
      props.onValueChange(walletBal.toString().match(/^-?\d+(?:\.\d{0,10})?/)[0]);
      props.onMax(walletBal.toString().match(/^-?\d+(?:\.\d{0,10})?/)[0]);
      setMax(+walletBal.toString().match(/^-?\d+(?:\.\d{0,10})?/)[0]);
    } catch (e) {
      console.log("Error while fetching max balance", e);
    }
  };

  return (
    <>
      <Box className="two_boxes">
        <Input
          placeholder="00.0000"
          inputProps={{ "aria-label": "description" }}
          value={props.value}
          disabled={props.disabled}
          sx={{ WebkitTextFillColor: "white !important", color: "red" }}
          onBlur={(e) => props.onBlur(e.target.value)}
          onChange={(e) => props.onValueChange(e.target.value)}
        />

        <Box className="def_slct pstn_abslt">
          {!props.disabled && <Button onClick={() => props.currency && getBalance(props.currency)}>Max</Button>}
          <FormControl sx={{ m: 1, minWidth: 126 }}>
            <Select
              value={props.currency}
              onChange={(e) => props.onCurrencyChange(e.target.value)}
              displayEmpty
              disabled={props.selectDisabled}
              inputProps={{ "aria-label": "Without label" }}
            >
              {props.whiteListedTokens.map((item) => (
                <MenuItem value={item.address} key={item.name}>
                  <Box component="img" src={item.logo} height={24} width={24} />
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {props.afterEl}
      </Box>
      {!props.disabled && (
        <Box
          px={5}
          py={1}
          sx={(theme) => ({
            [theme.breakpoints.up("md")]: {
              zoom: 1.23,
              minWidth: 200,
            },
            minWidth: 200,
          })}
        >
          <Slider
            onChange={(_, newVal: number) => {
              // setValue(newVal);
              props.onValueChange(+toFixed4((max * newVal) / 100));
              props.forceUpdate();
            }}
            aria-label="Always visible"
            value={getSliderValue()}
            step={25}
            marks={Levels}
            disabled={max === 0}
            sx={{
              color: "white",
              "& .MuiSlider-markLabel": {
                color: "white",
              },
            }}
          />
        </Box>
      )}
    </>
  );
};

interface CollapsedRowProps {
  open: boolean;
  data: TraderLockData;
  slippage;
  period: string;
  showChart: boolean;
}

const CollapsedRow = (props: CollapsedRowProps) => {
  const [onSwapUpdate, setOnSwapUpdate] = useState(0);
  const [swapFromValue, setSwapFromValue] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [swapFromToken, setSwapFromToken] = useState("");
  const [swapToValue, setSwapToValue] = useState("");
  const [swapToToken, setSwapToToken] = useState("");
  const { address, provider, chainID } = useWeb3Context();
  const rpcURL = getAddresses(chainID).RPC_URL;
  const [error, setError] = useState("");
  const [showTerminateErrorDialog, setShowTerminateErrorDialog] = useState(false);

  useEffect(() => {
    (async () => {
      const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
      const token = await contract.contract.participationToken();
      if (token) {
        setSwapFromToken(token.toLowerCase());
      }
    })();
  }, [address, chainID, props.data.contract, props.data.lpTokenPair, provider]);

  const onSwapClicked = async () => {
    console.log("[onSwapClicked]", swapFromValue, swapFromToken, swapToValue, swapToToken);
    const { flow, pairAddress } = getFlowAndPair();
    const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
    let tokens = {};
    for (const pair of props.data.lpTokenPair) {
      tokens[pair.token1.address.toLowerCase()] = pair.token1;
      tokens[pair.token2.address.toLowerCase()] = pair.token2;
    }
    try {
      await contract.swap(
        pairAddress,
        swapFromValue,
        amountMin,
        flow,
        tokens[swapFromToken.toLowerCase()],
        tokens[swapToToken.toLowerCase()]
      );
      window.location.reload();
    } catch (e) {
      setError("Error while swapping. Please try again after sometime...");
    }
  };
  const onTerminate = async () => {
    const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
    const balance = await contract.getAllBalance();
    const currency = await contract.contract.participationToken();
    let showError = false;
    for (const key in balance.tokens) {
      const token = balance.tokens[key];
      if (currency.toLowerCase() !== key.toLowerCase()) {
        showError = showError || token.amount * token.usdVal > 1;
      }
    }

    if (showError) {
      setShowTerminateErrorDialog(true);
    } else {
      await contract.terminate();
      let tokenBal = balance.tokens[currency.toLowerCase()].amount;
      let usdBal = balance.tokens[currency.toLowerCase()].usdVal * tokenBal;
      const data = await contract.getCurrentBalance(props.data);
      let initialBal = data.initialBalance;
      let percent = data.percent;
      let token = props.data.initialValue.token;
      await TraderLockAPI.updateFinalBal(props.data.contract, tokenBal, usdBal, initialBal, percent, token);
    }
  };

  const getHistory = useCallback(() => {
    return TraderLockAPI.getTransactions(props.data.contract);
  }, [props.data.contract]);

  const historyAPI = useApi(getHistory);

  const getTradingEndTime = useCallback(() => {
    if (!address) {
      return new Promise<{
        tradingEndTime: number;
        fundingEndTime: number;
        fundingStartTime: number;
      }>((res) => res(null));
    }
    const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
    return contract.getTradingEndTime();
  }, [address, chainID, props.data.contract, props.data.lpTokenPair, provider]);
  const tradingEndTimeApi = useApi(getTradingEndTime);

  const getParticipationToken = useCallback(() => {
    if (!address) {
      return new Promise<"">((res) => res(null));
    }
    const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
    return contract.getCurrency();
  }, [address, chainID, props.data.contract, props.data.lpTokenPair, provider]);
  const participationToken = useApi(getParticipationToken);

  const getWhiteListedTokens = useCallback(() => {
    if (!address) {
      return new Promise<{ name: string; logo: string; address: string }[]>((res) => res([]));
    }
    let tokens = {};
    for (const pair of props.data.lpTokenPair) {
      tokens[pair.token1.address] = pair.token1;
      tokens[pair.token2.address] = pair.token2;
    }
    return new Promise<{ name: string; logo: string; address: string }[]>((res) => res(Object.values(tokens)));
  }, [address, props.data.lpTokenPair]);
  const whiteListedTokensApi = useApi(getWhiteListedTokens);

  const toCurrencies = useMemo(() => {
    let tokens: Record<string, { address: string; name: string; logo: string }> = {};
    for (const pair of props.data.lpTokenPair) {
      if (pair.token1.address === swapFromToken) {
        tokens[pair.token2.address] = pair.token2;
      }
      if (pair.token2.address === swapFromToken) {
        tokens[pair.token1.address] = pair.token1;
      }
    }
    return Object.values(tokens);
  }, [props.data.lpTokenPair, swapFromToken]);

  const getFlowAndPair = () => {
    let flow;
    let pairAddress;
    if (!(swapFromToken && swapToToken)) {
      return { flow, pairAddress };
    }
    for (const pair of props.data.lpTokenPair) {
      if (pair.token1.address === swapFromToken && pair.token2.address === swapToToken) {
        flow = 1;
        pairAddress = pair.pairAddress;
      } else if (pair.token2.address === swapFromToken && pair.token1.address === swapToToken) {
        flow = -1;
        pairAddress = pair.pairAddress;
      }
    }
    return { flow, pairAddress };
  };

  useEffect(() => {
    generateToValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.slippage]);

  const generateToValue = () => {
    const { flow, pairAddress } = getFlowAndPair();
    if (flow && pairAddress) {
      const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
      contract
        .getAmoutOutMin(+swapFromValue, pairAddress, flow, props.slippage)
        .then((res) => {
          setAmountMin(res.amountMin.toLocaleString("fullwide", { useGrouping: false }));
          setSwapToValue((+(+res.amountOut).toFixed(4)).toString());
        })
        .catch((e) => {
          console.log("Error while changing value", e);
          if (+swapFromValue === 0) {
            setSwapToValue("0");
          }
        });
    }
  };

  const getValue = (val) => {
    const { flow, pairAddress } = getFlowAndPair();
    if (flow && pairAddress) {
      const contract = new TraderlockContract(props.data.contract, provider, chainID, address, props.data.lpTokenPair);
      contract.getAmoutOutMin(+val, pairAddress, flow, props.slippage).then((res) => {
        setAmountMin(res.amountMin.toLocaleString("fullwide", { useGrouping: false }));
        setSwapToValue((+(+res.amountOut).toFixed(4)).toString());
      });
    }
  };

  const swapInputs = () => {
    if (swapFromToken && swapToToken) {
      setSwapFromToken(swapToToken);
      setSwapToToken(swapFromToken);
      setSwapFromValue(swapToValue);
      setOnSwapUpdate((prev) => prev + 1);
    }
  };

  const getRationData = (row: TraderlockContractHistory) => {
    if (row.from.address?.toLowerCase() === participationToken.data?.toLowerCase()) {
      return (
        +(+(+row.from.value).toFixed(4) / +(+row.to.value).toFixed(4)).toFixed(4) +
        " " +
        row.from.name +
        "/" +
        row.to.name
      );
    } else {
      return (
        +(+(+row.to.value).toFixed(4) / +(+row.from.value).toFixed(4)).toFixed(4) +
        " " +
        row.to.name +
        "/" +
        row.from.name
      );
    }
  };

  useEffect(() => {
    if (onSwapUpdate !== 0) {
      generateToValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSwapUpdate]);

  const swapIconDisabled = !swapFromToken || !swapToToken;

  return (
    <Collapse in={props.open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        {props.showChart && (
          <Box>
            <TradingViewWidget />
          </Box>
        )}
        {(props.period === "FUNDING" || props.period === "TRADING") && (
          <Box className="data_btwn_tbl">
            <Grid container spacing={4}>
              <Grid item xs={4} md={4}>
                {whiteListedTokensApi.loadUI(
                  <AthenaSkeleton variant="rectangular" height={50} />,
                  <SwapInput
                    contract={props.data.contract}
                    whiteListedTokens={whiteListedTokensApi.data || []}
                    value={swapFromValue}
                    onValueChange={setSwapFromValue}
                    currency={swapFromToken}
                    disabled={false}
                    onBlur={generateToValue}
                    onMax={(val) => {
                      getValue(val);
                      setOnSwapUpdate((prev) => prev + 1);
                    }}
                    forceUpdate={() => setOnSwapUpdate((prev) => prev + 1)}
                    onCurrencyChange={(token) => {
                      setSwapFromToken(token);

                      generateToValue();
                    }}
                    afterEl={
                      <SwapHorizIcon
                        className="swap_icon"
                        sx={{ cursor: swapIconDisabled ? "default" : "pointer", opacity: swapIconDisabled ? 0.38 : 1 }}
                        onClick={swapInputs}
                      />
                    }
                  />,
                  null
                )}
              </Grid>
              <Grid item xs={4} md={4}>
                {whiteListedTokensApi.loadUI(
                  <AthenaSkeleton variant="rectangular" height={50} />,
                  <SwapInput
                    contract={props.data.contract}
                    whiteListedTokens={toCurrencies || []}
                    value={swapToValue}
                    disabled={true}
                    selectDisabled={(toCurrencies || []).length === 0}
                    onValueChange={setSwapToValue}
                    currency={swapToToken}
                    onCurrencyChange={(token) => {
                      setSwapToToken(token);
                      // generateToValue();
                      setOnSwapUpdate((prev) => prev + 1);
                    }}
                  />,
                  null
                )}
              </Grid>
              <Grid item xs={4} md={4}>
                <Box className="btn_one_box">
                  <Button
                    className="def_yylw_btn"
                    disabled={tradingEndTimeApi.data?.tradingEndTime <= Date.now() || !swapToValue}
                    onClick={onSwapClicked}
                  >
                    Swap Now
                  </Button>
                  {error && (
                    <Alert severity="error" sx={{ height: 36, minHeight: "36px !important" }}>
                      {error}
                    </Alert>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Box className="trmntnw_bx">
              <Typography>{props.period === "FUNDING" ? "Funding" : "Trading"} Period Over In:</Typography>
              <Typography component="h5">
                {tradingEndTimeApi.loadUI(
                  <AthenaSkeleton />,
                  props.period === "FUNDING" ? (
                    <Countdown date={tradingEndTimeApi.data?.fundingEndTime} />
                  ) : (
                    <Countdown date={tradingEndTimeApi.data?.tradingEndTime} />
                  ),
                  "Can not fetch the data"
                )}
              </Typography>
              {
                <>
                  <Button
                    className="orng_btn"
                    sx={{ "&:disabled": { opacity: 0.38 } }}
                    disabled={tradingEndTimeApi.data?.tradingEndTime <= Date.now()}
                    onClick={onTerminate}
                  >
                    Terminate Now
                  </Button>
                  <TerminateErrorDialog
                    open={showTerminateErrorDialog}
                    onClose={() => setShowTerminateErrorDialog(false)}
                  />
                </>
              }
            </Box>
          </Box>
        )}
        <Typography className="rcnt_txt">Recent swap</Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Ratio</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">View Transaction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyAPI.loadUI(
              <>
                <HistorySkeleton />
                <HistorySkeleton />
                <HistorySkeleton />
              </>,
              <>
                {(historyAPI.data || []).length === 0 && (
                  <TableRow>
                    <TableCell>
                      <Typography gutterBottom variant="body1">
                        No Recent Swaps
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {(historyAPI.data || [])
                  .map((historyRow, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {+(+historyRow.from.value).toFixed(4)} {historyRow.from.name}
                      </TableCell>
                      <TableCell>
                        {+(+historyRow.to.value).toFixed(4)} {historyRow.to.name}
                      </TableCell>
                      <TableCell>{getRationData(historyRow)}</TableCell>
                      <TableCell align="right" className="lght_txt">
                        {/* <ReactTimeAgo date={+historyRow.date} /> */}
                        {new Date(+historyRow.date).toLocaleString()}
                        {/* {new Date(+historyRow.date).toJSON().replace(/T/g, " ").replace(/\..*$/g, "")} */}
                      </TableCell>
                      <TableCell align="right">
                        <a href={rpcURL + historyRow.transactionHash} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                  .reverse()}
              </>,
              <TableRow>
                <TableCell component="th" scope="row">
                  "Error while fetching data"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
};

const HistorySkeleton = () => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <AthenaSkeleton variant="rectangular" width={100} height={40} />
      </TableCell>
      <TableCell>
        <AthenaSkeleton variant="rectangular" width={100} height={40} />
      </TableCell>
      <TableCell>
        <AthenaSkeleton variant="rectangular" width={100} height={40} />
      </TableCell>
      <TableCell align="right" className="lght_txt">
        <AthenaSkeleton variant="rectangular" width={100} height={40} />
      </TableCell>
    </TableRow>
  );
};

const RowSkeleton = () => {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
      <TableCell component="th" scope="row">
        <Box className="txt_btn_bx">
          <AthenaSkeleton variant="rectangular" width={100} height={40} />
        </Box>
      </TableCell>
      <TableCell align="center">
        <AthenaSkeleton variant="rectangular" height={40} />
      </TableCell>
      <TableCell align="center">
        <AthenaSkeleton variant="rectangular" height={40} />
      </TableCell>
      <TableCell align="right">
        <Box className="ic_bx">
          <AthenaSkeleton variant="circular" width={40} height={40} />
          <AthenaSkeleton variant="circular" width={40} height={40} />
        </Box>
      </TableCell>
      <TableCell>
        <AthenaSkeleton variant="circular" width={40} height={40} />
      </TableCell>
    </TableRow>
  );
};

const TradingViewWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js"; // whatever url you want here
    script.charset = "utf-8";
    script.async = true;
    script.onload = function () {
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: "COINBASE:BTCUSD",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,
        container_id: "tradingview_5d209",
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <Box className="tradingview-widget-container">
      <Box id="tradingview_5d209" height={500}></Box>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/symbols/BTCUSD/?exchange=COINBASE"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">BTCUSD Chart</span>
        </a>
        by TradingView
      </div>
    </Box>
  );
};

const TerminateErrorDialog = ({ open, onClose }) => {
  return (
    <BootstrapDialog onClose={() => onClose()} aria-labelledby="NoDataDialog" open={open} className="swap_dialog">
      <BootstrapDialogTitle id="NoDataDialog" onClose={() => onClose()}>
        Contract Termination Error
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box className="innr_popup">
          <Box className="inpt_bx def_inpt_btn">
            <Typography variant="body1" gutterBottom style={{ color: "white" }}>
              Cannot terminate the contract because Investments are available in multiple tokens.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button className="def_yylw_btn" sx={{ minWidth: 120 }} onClick={() => onClose()}>
          OK
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};
