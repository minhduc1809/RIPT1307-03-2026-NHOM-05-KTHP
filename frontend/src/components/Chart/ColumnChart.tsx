import { tienVietNam } from '@/utils/utils';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import vi from './vi.json';

const ColumnChart = (props: DataChartType) => {
  const { title, xAxis, yAxis: yAsis, yLabel, height, type } = props;

  const options = {
    chart: {
      defaultLocale: 'vi',
      locales: [vi],
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4,
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1,
          },
        },
      },
    },
    title: {
      text: title ?? yLabel,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        formatter: (val: number) => tienVietNam(val),
      },
    },
    xaxis: {
      categories: xAxis || [],
    },
    tooltip: {
      y: {
        formatter: (val: number) => tienVietNam(val),
      },
    },
  };

  const series = [
    {
      name: yLabel,
      data: yAsis || [],
      color: '#007EB9',
    },
  ];

  return <Chart options={options} series={series} type={type ?? 'bar'} height={height ?? 350} />;
};

export default ColumnChart;
