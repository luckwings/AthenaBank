import React, { useCallback } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useWeb3Context } from "../../hooks";
import { accountEllipsis } from "../../helpers";
import { ATHLevelContract } from "../../abi";
import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import useApi, { useAsyncRender } from "../../hooks/useApi";
import AthenaSkeleton from "../AthenaSkeleton";
import getSign from "../../helpers/get-sign";
import TraderLockAPI from "../../helpers/TraderLockAPI";
import { TraderlockContract } from "../../helpers/traderlock-contract";
import UserAPI from "../../helpers/userAPI";
import { hexToBase64 } from "../../helpers/hex-64";

export default function UsernameDetail() {
  const { address, provider, chainID } = useWeb3Context();
  const getData = useCallback(async () => {
    const addresses = getAddresses(chainID);
    const contract = new ethers.Contract(addresses.LP_LEVEL_ADDRESS, ATHLevelContract, provider);
    const level = await contract.athLevel(address);
    return Number(level);
  }, [address, chainID, provider]);

  const { data: currentLvl, loadUI } = useApi(getData);

  const call = useCallback(async () => {
    if (!address) {
      return new Promise<{ profit: string; profitPercent: string }>((res) => res({ profit: "", profitPercent: "" }));
    }
    const traderLocks = await TraderLockAPI.getAll();
    let init = 0;
    let bal = 0;

    for (const row of traderLocks.filter((item) => item.trader.address === address)) {
      const contract = new TraderlockContract(row.contract, provider, chainID, address, row.lpTokenPair);
      const data = await contract.getCurrentBalance(row);
      init += data.initialBalance;
      bal += data.currentBalance;
    }

    const profit = bal - init;
    const profitPercent = ((bal - init) * 100) / (init === 0 ? 1 : init);

    return {
      profit: (+profit.toFixed(4)).toLocaleString(),
      profitPercent: (+profitPercent.toFixed(2)).toLocaleString(),
    };
  }, [address, chainID, provider]);

  const { data: profitData, loadUI: profitLoadUI } = useApi(call);

  const userRender = useAsyncRender(() => UserAPI.get(address), [address]);

  const userName = (data) =>
    data.firstName || data.lastName ? `${data.firstName} ${data.lastName}` : accountEllipsis(address);

  const ref = () => {
    if (address) {
      return `athenacryptobank.io?ref=${hexToBase64(address)}`;
    }
    return "";
  };

  return (
    <>
      <Box className="ursnm_dtl_main_bx">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className="lft_grid_bx">
              <Typography component="h3" gutterBottom>
                UserName
              </Typography>
              <Box className="cpy_btn_bx">
                {userRender(
                  <AthenaSkeleton variant="rectangular" height={32} width={130} />,
                  (data) => (
                    <>
                      <Typography>{data && userName(data)}</Typography>
                      <Button className="copy_btn" onClick={() => navigator.clipboard.writeText(userName(data))}>
                        <Box component="img" src="/img/copy_green_ic.svg" />
                        COPY
                      </Button>
                    </>
                  ),
                  (err) => (
                    <>
                      <Typography>{!address ? "Connect Wallet" : "Cannot fetch Username..."}</Typography>
                    </>
                  )
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box className="rght_grid_bx">
              <Box className="innr_bx">
                <Typography className="lght_txt" gutterBottom>
                  Referral
                </Typography>
                {address ? (
                  <Box className="cpy_btn_bx">
                    <Typography> {address ? `athen...${ref().substring(ref().length - 4)}` : ""} </Typography>
                    <Button className="copy_btn" onClick={() => navigator.clipboard.writeText(ref())}>
                      <Box component="img" src="/img/copy_green_ic.svg" />
                      COPY
                    </Button>
                  </Box>
                ) : (
                  "Connect Wallet"
                )}
              </Box>
              <Box className="innr_bx">
                <Typography className="lght_txt" gutterBottom>
                  Current Level
                </Typography>
                {loadUI(
                  <AthenaSkeleton variant="rectangular" width={100} />,
                  <Typography> LEVEL {currentLvl || 0} </Typography>,
                  <Typography>{!address ? "Connect Wallet" : "Cannot fetch level..."}</Typography>
                )}
              </Box>
              <Box className="innr_bx">
                <Typography className="lght_txt" gutterBottom>
                  Recent Profit
                </Typography>
                {profitLoadUI(
                  <AthenaSkeleton variant="rectangular" width={100} />,
                  address ? (
                    <Typography>
                      {profitData?.profit} USDT
                      <span className={+profitData?.profitPercent < 0 ? "red_txt" : ""}>
                        {/* <Box component="img" src="/img/prft_up_img.svg" /> */}
                        {getSign(+profitData?.profitPercent)}
                        {profitData?.profitPercent}%
                      </span>
                    </Typography>
                  ) : (
                    <Typography>Connect Wallet</Typography>
                  ),
                  <Typography>Cannot get data...</Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
