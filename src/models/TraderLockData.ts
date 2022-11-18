import { TraderContractData } from "./TraderContractData";

export type PeriodName = "TRADING" | "FUNDING" | "CLAIMING" | "FUTURE";

export interface Trader {
  socials: {
    linkedIn: string;
    website: string;
    email: string;
    telegram: string;
    twitter: string;
    facebook: string;
    youtube: string;
    twitch: string;
    instagram: string;
    discord: string;
    tradingview: string;
  };
  profitScore: {
    image: string;
    name: string;
    percent: number;
  };
  contractAmount: {
    value: number;
    percent: number;
    currency: string;
  };
  name: string;
  address: string;
  username: string;
  image: string;
  risksTaken: number;
  lastYearPerformance: number;
  location: string;
  age: number;
  description: string;
  level: number;
  tags: string;
  contractAddress?: string;
}

export interface TraderLockData {
  initialValue: {
    balance: number;
    token: string;
  };
  actualValue: {
    percent: number;
    balance: number;
    token: string;
    usd: number;
  };
  contract: string;
  periodName: PeriodName;
  // periodEndTime: number;
  // remainingTime: number;
  image?: string;
  tokenId?: string;
  traderUsername: string;
  fundingStartTime: number;
  fundingPeriod: number;
  contractDetails: TraderContractData;
  tradingPeriod: number;
  trader: Trader;
  lpTokenPair: [
    {
      pairAddress: string;
      token1: {
        address: string;
        name: string;
        logo: string;
        id: string;
      };
      token2: {
        address: string;
        name: string;
        logo: string;
        id: string;
      };
    }
  ];
}

export class TraderLockTagProp {
  constructor(public name: string, public className: string) {}
}
