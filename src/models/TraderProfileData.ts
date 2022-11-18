export class TraderProfileData {
  public level: number;
  public username: string;
  public name: string;
  public image: string;
  public age: number;
  public location: string;
  public description: string;
  public address: string;
  public profitScore: {
    image: string;
    name: string;
    percent: number;
  };
  public contractAmount: {
    value: number;
    percent: number;
  };
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
    discord: string;
    tradingview: string;
  };
  public contractAddress?: string;
}
