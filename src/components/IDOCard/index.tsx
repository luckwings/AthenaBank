import { Grid, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { ethers } from "ethers";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { IDOContract } from "../../abi";
import { getAddresses } from "../../constants";
import { convertWei } from "../../helpers/convert-wei";
import { useWeb3Context } from "../../hooks";
import { ProjectDetailModel } from "../../models/ProjectDetailModel";
import AthenaSkeleton from "../AthenaSkeleton";
import BorderLinearProgress from "../BorderLinearProgress";
import { useLoader } from "../Loader";

const IDOCard = ({ data, extraProps }: { data: ProjectDetailModel; extraProps?: Record<string, string> }) => {
  const [raised, setRaised] = useState<number>(null);
  const [target, setTarget] = useState<number>(null);

  const { provider, chainID } = useWeb3Context();
  const contract = useMemo(() => new ethers.Contract(data.contractAddress, IDOContract, provider), [data, provider]);
  const loader = useLoader(null);

  const getDataFromContract = useCallback(async () => {
    loader.show();
    setRaised(convertWei(await contract.totalFundRaised()));
    setTarget(convertWei(await contract.totalAmount()));
    loader.hide();
  }, [contract, loader]);

  useEffect(() => {
    getDataFromContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid item xs={12} sm={6} md={6} lg={6} xl={4} {...extraProps}>
      <Link to={`/dyorareadetail?address=${data.contractAddress}`} className="orng_brdr_link">
        <Box className="ido_boxes">
          <Box className="top_bx">
            <Box className="img_box vert-move">
              <Box component="img" src="/img/gmblf_img.png" />
            </Box>
            <Box className="cntnt_box">
              <Typography component="h2">{data.periodData.name}</Typography>
              <Box className="innr_cntnt_bx">
                <Box className="green_cntnt same_cntnt">
                  <Box component="img" src="/img/green_lock_ic.svg" />
                  <Typography>{data.periodData.lockPercent}</Typography>
                </Box>
                <Box className="yllw_cntnt same_cntnt">
                  <Box component="img" src="/img/grah_ic.svg" />
                  <Typography>{data.periodData.chartPercent}</Typography>
                </Box>
                <Box className="white_cntnt same_cntnt">
                  <Box component="img" src="/img/clipboard_ic.svg" />
                  <Typography>Audit</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="mddl_cntnt">
            <Box className="prgrss_up">
              {/* <Typography>Presale Ended</Typography>
              <Typography>Market Initialization</Typography> */}
            </Box>
            <Box className="def_prgrss">
              {loader.loading ? (
                <Box sx={{ flexGrow: 1 }}>
                  <AthenaSkeleton variant="rectangular" height={10} />
                </Box>
              ) : (
                <Box sx={{ flexGrow: 1 }}>
                  <BorderLinearProgress variant="determinate" value={(raised * 100) / target} />
                </Box>
              )}
            </Box>
            <Box className="prgrss_dwn">
              <Typography>
                {loader.loading ? (
                  <AthenaSkeleton width={220} />
                ) : (
                  `${raised} / ${target} ${data.periodData.baseToken} Raised`
                )}
              </Typography>
              {/* <Typography>2 BNB</Typography> */}
            </Box>
          </Box>
          <Box className="bttm_cntnt">
            <Box className="def_slct">
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select defaultValue="" displayEmpty inputProps={{ "aria-label": "Without label" }}>
                  <MenuItem value="">
                    <em>Chart</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="roi_box">
              <Typography>
                ROI: <span> 158% </span>
              </Typography>
              <Box component="img" src="/img/polygon_ic.svg" />
            </Box>
            <Box className="chat_box">
              <Box component="img" src="/img/chat_ic.svg" />
              <Typography>15</Typography>
            </Box>
            <Box className="usrs_box">
              <Box component="img" src="/img/user_prsn_ic.svg" />
              <Typography>320</Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    </Grid>
  );
};

export default IDOCard;
