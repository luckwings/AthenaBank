export interface ProjectDetailModel {
  chart: Chart;
  name: string;
  description: string;
  listingOn: string;
  listingOnTokenImageLink: string;
  contractAddress: string;
  saleId: string;
  totalSupply: number;
  totalSupplyIn: string;
  hardCap: number;
  hardCapIn: string;
  presale: Presale;
  listingRate: number;
  listingRateIn: string;
  contribution: Contribution;
  liquidityUnlockDate: string;
  tokenId?: string;
  periodData: PeriodData;
}

export interface Chart {
  label: string;
  desc: string;
  team: number;
  liquidity: number;
  lock: number;
  community: number;
  marketing: number;
  estimatedInitialMarketcap: number;
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
  };
}

export interface Presale {
  rate: number;
  token: string;
  startTime: string;
  endTime: string;
}

export interface Contribution {
  min: number;
  max: number;
  token: string;
}

export interface PeriodData {
  name: string;
  image: string;
  baseToken: string;
  token: string;
  lockPercent: number;
  chartPercent: number;
}

export function getDummyProjectDetail(): ProjectDetailModel {
  return {
    chart: {
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
    },
    name: "Project Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius imperdiet erat, eu egestas est scelerisque feugiat. Cras finibus turpis id ligula tincidunt congue. Sed in erat ut mi sagittis tempus.",
    listingOn: "PancakeSwap",
    listingOnTokenImageLink: "/img/pancake_ic.png",
    contractAddress: "0x5458B1...099220",
    saleId: "0x05a1",
    totalSupply: 1000000000000,
    totalSupplyIn: "INSP",
    hardCap: 250,
    hardCapIn: "BNB",
    presale: {
      rate: 1100000,
      token: "BETIFY/BNB",
      startTime: "2022-05-06T17:03:08.113Z",
      endTime: "2022-05-06T17:03:08.113Z",
    },
    listingRate: 900000,
    listingRateIn: "BETIFY/BNB",
    contribution: {
      min: 0.1,
      max: 1,
      token: "BNB",
    },
    liquidityUnlockDate: "2022-05-06T17:03:08.113Z",
    periodData: {
      name: "Gamblefi",
      image: "/img/gmblf_img.png",
      baseToken: "BNB",
      token: "BETIFY",
      lockPercent: 60,
      chartPercent: 80,
    },
  };
}
