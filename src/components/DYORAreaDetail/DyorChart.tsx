import { Box, Typography, Grid, Button } from "@mui/material";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import getChartData from "../../helpers/get-chart-data";
import DyorChartDataModel from "../../models/DyorChartDataModel";
import AthenaSkeleton from "../AthenaSkeleton";

interface IDyorChartProps {
  data: DyorChartDataModel;
}

export default function DyorChart({ data }: IDyorChartProps) {
  const chartData = useMemo(
    () =>
      getChartData({
        label: data.label,
        desc: data.desc,
        keyValueMap: {
          Team: data.team,
          Liquidity: data.liquidity,
          Lock: data.lock,
          Community: data.community,
          Marketing: data.marketing,
        },
      }),
    [data]
  );

  const linkBtns = [
    { link: "/img/unvrs_ic.svg", url: data.socials?.website },
    { link: "/img/Facebook.svg", url: data.socials?.facebook },
    { link: "/img/twttr_ic_02.svg", url: data.socials?.twitter },
    { link: "/img/tlgrm_ic_02.svg", url: data.socials?.telegram },
    { link: "/img/YouTube.svg", url: data.socials?.youtube },
    { link: "/img/Twitch.svg", url: data.socials?.twitch },
    { link: "/img/Insta.svg", url: data.socials?.instagram },
    { link: "/img/doc_ic.svg", url: data.socials?.linkedIn },
  ].filter((item) => !!item.url);

  return (
    <Box className="lft_grd_bx">
      <Box className="chrt_bx">
        <Typography component="h3">DYOR Area</Typography>
        <Box className="chart_box_innr">
          <ReactApexChart options={chartData} series={chartData.series} type="donut" width={330} />
        </Box>
      </Box>
      <Box className="click_btn_box">
        <Typography>Click an Item Below for more Details!</Typography>
        <Grid container spacing={1}>
          {CHART_BTNS.map((item) => (
            <BlurBtn title={item} key={item} />
          ))}
        </Grid>
        <Box className="social_bx" flexWrap="wrap" px={6} style={{ paddingBottom: 16 }}>
          {linkBtns.map((entry, index) => (
            <Box component="a" href={entry.url} key={index}>
              <Box component="img" src={entry.link} height={36} width={36} />
            </Box>
          ))}
        </Box>
        <Box className="mrkt_cap_bx">
          <Typography>Estimated Initial Marketcap:</Typography>
          <Typography component="h5">$254,842.14</Typography>
        </Box>
      </Box>
    </Box>
  );
}

const CHART_BTNS = [
  "Fire Rank",
  "TokenSniffer",
  "Disqus Chat",
  "Dxsale Presales Chat",
  "DxLock Token Locker",
  "Presale Tracking Bot",
  "Not Audited",
  "Not KYCed",
];
const BlurBtn = ({ title }) => (
  <Grid item xs={6} md={6} sm={6} className="text-center">
    <Button className="def_blr_btn">{title}</Button>
  </Grid>
);

export const DyorChartSkeleton = () => {
  return (
    <Box className="lft_grd_bx">
      <Box className="chrt_bx">
        <Typography component="h3">DYOR Area</Typography>
        <Box className="chart_box_innr">
          <AthenaSkeleton variant="circular" width={250} height={250} />
        </Box>
      </Box>
      <Box className="click_btn_box">
        <Typography>Click an Item Below for more Details!</Typography>
        <Grid container spacing={1}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid item xs={6} md={6} sm={6} className="text-center" key={item}>
              <AthenaSkeleton variant="rectangular" height={26} width={120} />
            </Grid>
          ))}
        </Grid>
        <Box className="social_bx">
          {[1, 2, 3, 4].map((item) => (
            <AthenaSkeleton key={item} variant="circular" height={36} width={36} />
          ))}
        </Box>
        <Box className="mrkt_cap_bx">
          <Typography gutterBottom>Estimated Initial Marketcap:</Typography>
          <Typography component="h5">
            <AthenaSkeleton width={150} variant="rectangular" height={36} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
