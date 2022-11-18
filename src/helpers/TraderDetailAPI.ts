import { get } from "./basic-fetch";

export class TraderDetailModel {
  address: string;
  name: string;
  username: string;
  image: string;
  risksTaken: number;
  lastYearPerformance: number;
  location: string;
  age: string;
  description: string;
  level: number;
  socials : {
    linkedIn: string;
    website: string;
    email: string;
    telegram: string
  };
  profitScore: {
    image: string;
    name: string;
    percent: number
  };
  contractAmount: {
    value: number;
    percent: number;
    currency: string;
  };
  tags: string;
}

const TraderDetailAPI = {
  getAll: () => get<TraderDetailModel[]>("trader"),
  get: (traderAddress: string) => get<TraderDetailModel>(`trader/${traderAddress}`),
  getByAddress: (traderAddress: string) => get<TraderDetailModel>(`trader/address/${traderAddress}`),
};

export default TraderDetailAPI;
