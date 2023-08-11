import { tienVietNam } from '@/utils/utils';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import vi from './vi.json';
import _ from 'lodash';

const DonutChart = (props: DataChartType) => {
	const { xAxis, yAxis, height, colors, formatY, showTotal, width } = props;

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
						horizontalAlign: 'center',
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
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: showTotal,
						total: {
							show: showTotal,
							label: 'Tổng số',
							formatter: (w: any) => {
								const val = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
								return formatY ? formatY(val) : tienVietNam(val);
							},
						},
					},
				},
			},
		},
	};

	const series = yAxis?.[0] || [];

	return <Chart options={options} series={series} type='donut' height={height ?? 350} width={width ?? 500} />;
};

export default DonutChart;
