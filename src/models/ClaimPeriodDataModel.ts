import { PeriodData } from "./ProjectDetailModel";

export default class ClaimPeriodDataModel {
  name: string;
  lockPercent: number;
  chartPercent: number;
  raised: number;
  target: number;
  baseToken: string;
  token: string;
  reserved: number;
  claimed: number;
  readyToClaim: number;
  levelFeeReduction: number[];
  currentLvl: number;
}

export function getDummyClaimPeriodData(periodData: PeriodData) {
  return {
    ...periodData,
    raised: 200,
    target: 200,
    reserved: 5000,
    claimed: 1000,
    readyToClaim: 400,
    levelFeeReduction: [40, 30, 25, 20],
    currentLvl: 0,
  } as ClaimPeriodDataModel;
}
