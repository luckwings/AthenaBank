import { Box, Typography, Grid } from "@mui/material";
import { Fragment } from "react";
import { accountEllipsis } from "../../helpers";
import { ProjectDetailModel } from "../../models/ProjectDetailModel";
import AthenaSkeleton from "../AthenaSkeleton";

export default function ProjectDetail({ data }: { data: ProjectDetailModel }) {
  return (
    <Box className="prjct_dscrptn">
      <Typography component="h3">{data.name}</Typography>
      <Typography className="lght_txt">{data.description}</Typography>
      <Typography component="h3">Token Sale Details</Typography>
      <Grid container spacing={0}>
        {generateSaleDetailItems(data)}
      </Grid>
    </Box>
  );
}

class ISaleDetailItemProps {
  constructor(
    public title: string,
    public value: string,
    public valueClassName?: string,
    public extras?: JSX.Element
  ) {}
}

const SaleDetailItem = ({ title, value, valueClassName, extras }: ISaleDetailItemProps) => (
  <>
    <Grid item xs={6} xl={6} className="lft_cntnt">
      <Typography>{title}</Typography>
    </Grid>
    <Grid item xs={6} xl={6} className="rght_cntnt">
      <Typography className={valueClassName}>
        {value}
        {extras}
      </Typography>
    </Grid>
  </>
);

function generateSaleDetailItems(data: ProjectDetailModel) {
  const props = [
    new ISaleDetailItemProps(
      "Listing On",
      data.listingOn,
      "",
      data.listingOnTokenImageLink ? <Box component="img" src={data.listingOnTokenImageLink} alt="" /> : null
    ),
    new ISaleDetailItemProps("Token Address", accountEllipsis(data.contractAddress), "yllw_txt"),
    new ISaleDetailItemProps("Sale ID", data.saleId),
    new ISaleDetailItemProps("Total Supply", `${data.totalSupply} ${data.totalSupplyIn}`),
    new ISaleDetailItemProps("Hard Cap", `${data.hardCap} ${data.hardCapIn}`),
    new ISaleDetailItemProps("Presale Rate", `${data.presale.rate} ${data.presale.token}`),
    new ISaleDetailItemProps("Listing Rate", `${data.listingRate} ${data.listingRateIn}`),
    new ISaleDetailItemProps("Minimum Contribution", `${data.contribution.min} ${data.contribution.token}`),
    new ISaleDetailItemProps("Maximum Contribution", `${data.contribution.max} ${data.contribution.token}`),
    new ISaleDetailItemProps("Presale Start Time", data.presale.startTime?.toLocaleString()),
    new ISaleDetailItemProps("Presale End Time", data.presale.endTime?.toLocaleString()),
    new ISaleDetailItemProps("Liquidity Unlock Date", new Date(data.liquidityUnlockDate)?.toLocaleString()),
  ];

  return props.map((item) => <SaleDetailItem key={item.title} {...item} />);
}

// const DUMMY_DATA: ISaleDetailItemProps[] = [
//     new ISaleDetailItemProps(
//       "Listing On",
//       "PancakeSwap",
//       "",
//       <Box component="img" src="/img/pancake_ic.png" alt="" />
//     ),
//     new ISaleDetailItemProps("Token Address", "0x5458B1...099220", "yllw_txt"),
//     new ISaleDetailItemProps("Sale ID", "0x05a1"),
//     new ISaleDetailItemProps("Total Supply", "1,000,000,000,000 INSP"),
//     new ISaleDetailItemProps("Hard Cap", "250 BNB"),
//     new ISaleDetailItemProps("Presale Rate", "1,100,000 BETIFY/BNB"),
//     new ISaleDetailItemProps("Listing Rate", "900,000 BETIFY/BNB"),
//     new ISaleDetailItemProps("Minimum Contribution", "0.1 BNB"),
//     new ISaleDetailItemProps("Maximum Contribution", "1 BNB"),
//     new ISaleDetailItemProps("Presale Start Time", "1 Dec 2021 at 23:30"),
//     new ISaleDetailItemProps("Presale End Time", "3 Dec 2021 at 23:30"),
//     new ISaleDetailItemProps("Liquidity Unlock Date", "1 Dec 2023 at 02:30"),
// ];

export const ProjectDetailSkeleton = () => {
  return (
    <Box className="prjct_dscrptn">
      <Typography component="h3">
        <AthenaSkeleton width={"100%"} variant="rectangular" height={26} />
      </Typography>
      <Typography className="lght_txt">
        <AthenaSkeleton width={"100%"} variant="rectangular" height={26} sx={{ mb: 1 }} />
        <AthenaSkeleton width={"100%"} variant="rectangular" height={26} sx={{ mb: 1 }} />
        <AthenaSkeleton width={"100%"} variant="rectangular" height={26} sx={{ mb: 1 }} />
      </Typography>
      <Typography component="h3">Token Sale Details</Typography>
      <Grid container spacing={0}>
        {[
          "Listing On",
          "Token Address",
          "Sale ID",
          "Total Supply",
          "Hard Cap",
          "Presale Rate",
          "Listing Rate",
          "Minimum Contribution",
          "Maximum Contribution",
          "Presale Start Time",
          "Presale End Time",
          "Liquidity Unlock Date",
        ].map((title) => (
          <Fragment key={title}>
            <Grid item xs={6} xl={6} className="lft_cntnt">
              <Typography>{title}</Typography>
            </Grid>
            <Grid item xs={6} xl={6} className="rght_cntnt">
              <Typography>
                <AthenaSkeleton width={"100%"} variant="rectangular" height={26} />
              </Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
};
