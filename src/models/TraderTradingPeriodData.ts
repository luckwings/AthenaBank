export class TraderTradingPeriodData {
  balance: number;
  token: string;
  percent: number;
  initial: {
    value: number;
    token: string;
  }
  expectedGain: {
    value: number;
    token: string;
    percent: number;
  }
  endDate: Date;
  levelFeeReduction: number[];
  currentLvl: number;
}