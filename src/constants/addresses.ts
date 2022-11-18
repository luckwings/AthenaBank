import { Networks } from "./blockchain";

const BSCTESTNET = {
  LP_STAKING_ADDRESS: "0xCfc2402F7A666DcA689a419B08030C12852a038B",
  LP_LEVEL_ADDRESS: "0x1fF06A29aA3d0772F63E2aB809969819aD3F2376",
  IDO: "0x0ee5Eb0e77aC7A1CcEF1eab49c69b150CF7718d1",
  TRADER: "0xc118D2f7AA1dbDc1bc134E64288a14D84Fd162a8",
  ROUTER: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
  RPC_URL: "https://testnet.bscscan.com/tx/",
  ATHENA: "0x3e8d3feA94E2946ae069c0d67389Baa0B0793327",
};

const BSCMAINNET = {
  LP_STAKING_ADDRESS: "0xB3ac5B478b4BFB3d282BC0975e8B6a480B37E2Ce",
  LP_LEVEL_ADDRESS: "0x534701140B39881103E440A0443A5d44F93a8D2B",
  IDO: "0x0ee5Eb0e77aC7A1CcEF1eab49c69b150CF7718d1",
  TRADER: "0xc118D2f7AA1dbDc1bc134E64288a14D84Fd162a8",
  ROUTER: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
  RPC_URL: "https://bscscan.com/tx/",
  ATHENA: "0x5597D204118436B5BcA397aded5aC6923a26033D",
  LAUNCHPADINFO: "0xEFd11C522CaD0AF0BE0804CB42cc369209309030",
  LAUNCHPADFACTORY: "0x57638A7c7340Ad54412Df2aB909ad69019375A02",

};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.BSCMAINNET) return BSCMAINNET;

  throw Error("Network don't support");
};
