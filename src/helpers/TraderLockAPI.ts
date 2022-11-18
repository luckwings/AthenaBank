import { TraderLockData } from "../models/TraderLockData";
import { get } from "./basic-fetch";
import { TraderlockContractHistory } from "./traderlock-contract";
import axios from "axios";

const TraderLockAPI = {
  getAll: () => get<TraderLockData[]>("traderlock"),
  get: (contract: string) => get<TraderLockData>(`traderlock/${contract}`),
  getFromPeriod: (period: string) => get<TraderLockData[]>(`traderlock/with-period/${period}`),
  getTransactions: (address: string) => get<TraderlockContractHistory[]>(`transaction/${address}`),
  saveTransactions: (data: TraderlockContractHistory) =>
    axios.post<TraderlockContractHistory>(`${process.env.REACT_APP_BACKEND_URL}/transaction/add`, data),
  updateFinalBal: (
    address: string,
    tokenBal: number,
    usdBal: number,
    initialBal: number,
    percent: number,
    token: string
  ) =>
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/traderlock/update-final-bal`, {
      address,
      tokenBal,
      usdBal,
      initialBal,
      percent,
      token,
    }),
};

export default TraderLockAPI;
