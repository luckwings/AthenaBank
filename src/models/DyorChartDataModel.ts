import { Chart } from "./ProjectDetailModel";
export default class DyorChartDataModel implements Chart {
  public team: number;
  public liquidity: number;
  public lock: number;
  public community: number;
  public marketing: number;
  public estimatedInitialMarketcap: number;
  public label: string;
  public desc: string;
  public socials: {
    linkedIn: string;
    website: string;
    email: string;
    telegram: string;
    twitter: string;
    facebook: string;
    youtube: string;
    twitch: string;
    instagram: string;
  };
}

export function getDummyDyorChartData(): DyorChartDataModel {
  return {
    label: "Token",
    desc: "Distribution",
    team: 20,
    liquidity: 30,
    lock: 25,
    community: 35,
    marketing: 60,
    estimatedInitialMarketcap: 254842.14,
    socials: {
      linkedIn: "string",
      website: "string",
      email: "string",
      telegram: "string",
      twitter: "string",
      facebook: "string",
      youtube: "string",
      twitch: "string",
      instagram: "string",
    },
  };
}
