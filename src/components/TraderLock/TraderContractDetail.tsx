import { Box, Typography } from "@mui/material";
import { accountEllipsis } from "../../helpers";
import { TraderContractData } from "../../models/TraderContractData";
import AthenaSkeleton from "../AthenaSkeleton";

export default function TraderContractDetail({ data, address, userInvested }: { data: TraderContractData; address, userInvested }) {
  return (
    <Box className="cntrct_dlt_bx">
      <Typography className="pdng_btm">Trader Contract Details</Typography>
      <Typography
        component="span"
        variant="body1"
        gutterBottom
        title={data.description}
        // sx={{
        //   WebkitLineClamp: 3,
        //   overflow: "hidden",
        //   display: "-webkit-box",
        //   WebkitBoxOrient: "vertical",
        // }}
      >
        {data.description}
      </Typography>
      <Box className="def_same_bx">
        <Typography gutterBottom>Contract Address</Typography>
        <Typography
          component="a"
          href={"https://bscscan.com/address/" + address}
          variant="h6"
          color="white"
          target="_blank"
          fontWeight={600}
        >
        <Typography component="h6">{accountEllipsis(address)}</Typography>
        </Typography>
      </Box>
      {/* <Box className="def_same_bx">
        <Typography gutterBottom>Trading Pair Allowed</Typography>
        <Typography component="h6">{data.allowed}</Typography>
      </Box> */}
      <Box className="def_same_bx">
        <Typography gutterBottom>Amount Invested by the trader</Typography>
        <Typography component="h6">{userInvested.isLoading ? (
          <AthenaSkeleton height={24} width={120} />
        ): `${userInvested.value} ${userInvested.token}`}</Typography>
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Trading Pair Detail</Typography>
        <Typography component="h6">{data.tradingPairs}</Typography>
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Maximum Loss in %</Typography>
        <Typography component="h6">-10%</Typography>
      </Box>
      {/* <Box className="def_same_bx">
        <Typography gutterBottom>Whitelisted Router</Typography>
        <Typography
          component="a"
          href={"https://bscscan.com/address/" + data.whiteListedAddress}
          variant="h6"
          color="white"
          target="_blank"
          fontWeight={600}
        >
          {accountEllipsis(data.whiteListedAddress)}
        </Typography>
      </Box> */}
      <Box className="def_same_bx">
        <Typography gutterBottom>Trading Mode</Typography>
        <Typography component="h6">Spot - No leverage - No Shorts</Typography>
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Max Trading Period</Typography>
        <Typography component="h6">{data.durationRecap} Days</Typography>
      </Box>
    </Box>
  );
}

export const TraderContractDetailSkeleton = () => {
  return (
    <Box className="cntrct_dlt_bx">
      <Typography className="pdng_btm">Trader Contract Details</Typography>
      <AthenaSkeleton variant="rectangular" height={24} width={120} />
      <Box className="def_same_bx">
        <Typography gutterBottom>Amount Invested by the trader</Typography>
        <AthenaSkeleton variant="rectangular" height={24} width={120} />
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Trading Pair Detail</Typography>
        <AthenaSkeleton variant="rectangular" height={24} width={120} />
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Maximum Loss in %</Typography>
        <AthenaSkeleton variant="rectangular" height={24} width={120} />
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Trading Mode</Typography>
        <AthenaSkeleton variant="rectangular" height={24} width={120} />
      </Box>
      <Box className="def_same_bx">
        <Typography gutterBottom>Max Trading Period</Typography>
        <AthenaSkeleton variant="rectangular" height={24} width={120} />
      </Box>
    </Box>
  );
};
