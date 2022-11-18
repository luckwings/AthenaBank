import { ApexOptions } from "apexcharts";

interface Options {
  label: string;
  desc: string;
  keyValueMap: Record<string, number>;
}

export default function getChartData(options: Options) {

  const series: number[] = [];
  const labels: string[] = [];

  for (const key in options.keyValueMap) {
    labels.push(key);
    series.push(options.keyValueMap[key]);
  }

  const chartData: ApexOptions = {
    chart: {
      width: 100,
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: options.label,
              formatter: () => options.desc,
              fontSize: "14px",
              fontFamily: "$f_primary",
              fontWeight: "normal",
              color: "#fff",
            },
            value: {
              show: true,
              fontSize: "12px",
              fontFamily: "$f_primary",
              fontWeight: "normal",
              color: "rgba(255,255,255, 0.5)",
              offsetY: -5,
              formatter: function (val: any) {
                return val;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 350,
        options: {
          chart: {
            width: 315,
          },
        },
      },
    ],
    legend: {
      position: "bottom",
      offsetY: 0,
      offsetX: 20,
      height: 50,
      width: 250,
      labels: {
        colors: "white",
      },
    },
    series,
    labels
  };

  return chartData;
}
