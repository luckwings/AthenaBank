export class TraderFundingProfileData {
  raised: number;
  target: number;
  token: string;
  contribution: {
    min: number;
    // max: number
  };
  claimingPeriod: number;
  fundingStartTime: Date;
  maxAmountAvailable: number;
  endDate: Date;
  contributedAmount: number;
  levelFeeReduction: number[];
  currentLvl: number;
  openForLevels?: number[];
  isApproved: boolean;
  traderAddress?: string;
}
