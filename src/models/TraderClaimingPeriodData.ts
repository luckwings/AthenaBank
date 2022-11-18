type Amount = {
  value: number;
  token: string;
};

export class TraderClaimingPeriodData {
  balance: number;
  token: string;
  percent: number;
  initial: Amount;
  claimedAmount: number;
  expectedGain: Amount & { percent: number };
  claimed: Amount;
  fees: Amount;
  received: Amount;
  claimingPeriod: number;
  levelFeeReduction: number[];
  currentLvl: number;
}
