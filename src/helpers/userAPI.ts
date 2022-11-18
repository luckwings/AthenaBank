import { get } from "./basic-fetch";
import axios from "axios";

export interface UserModel {
  walletAddress: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  address: string;
  location: string;
  company: string;
  hasAcceptedTOS: boolean;
  telegram: string;
  discord: string;
  referrer: string;
}

const UserAPI = {
  get: (address: string) => get<UserModel>(`user/find/${address}`),
  modify: (address: string, data: UserModel) => axios.post<string>(`${process.env.REACT_APP_BACKEND_URL}/user/modify/${address}`, data),
  acceptTOS: (address: string) => axios.post<string>(`${process.env.REACT_APP_BACKEND_URL}/user/accept-tos/${address}`),
  getCount: () => get<number>(`user/count`),
};

export default UserAPI;
