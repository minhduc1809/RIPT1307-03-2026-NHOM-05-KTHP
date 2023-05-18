import { tienVietNam } from '@/utils/utils';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import vi from './vi.json';

const DonutChart = (props: DataChartType) => {
  const { title, xAxis, yAxis, yLabel, height, colors, formatY } = props;

  const options = {
    chart: {
      defaultLocale: 'vi',
      locales: [vi],
    },
    labels: xAxis,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)),
      },
    },
    colors,
    fill: {
      colors,
    },
  };

  const series = yAxis || [];

  return (
    <Chart options={options} series={series} type="donut" height={height ?? 350} width={600} />
  );
};

export default DonutChart;
