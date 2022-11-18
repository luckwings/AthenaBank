import { PeriodData } from "./ProjectDetailModel";

export default class FundingPeriodDataModel {
  name: string;
  image: string;
  baseToken: string;
  token: string;
  lockPercent: number;
  chartPercent: number;
  raised: number;
  target: number;
  ratio: number;
  openForLevels: number[];
  endDate: Date;
  invested: number;
  feesPaid: number;
  tokenAmount: number;
  levelFeeReduction: number[];
  currentLvl: number;
  fundingStartTime: Date;
}

export function getDummyFundingPeriodData(periodData: PeriodData) {
  const date = new Date();
  date.setDate(date.getDate() + 2);

  return {
    ...periodData,
    raised: 172,
    target: 200,
    ratio: 50,
    openForLevels: [3, 2],
    endDate: date,
    invested: 254.14,
    feesPaid: 54,
    tokenAmount: 3000,
    levelFeeReduction: [40, 30, 25, 20],
    currentLvl: 0
  } as FundingPeriodDataModel;
}
