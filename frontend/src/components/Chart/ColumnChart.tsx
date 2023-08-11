import { tienVietNam } from '@/utils/utils';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import vi from './vi.json';
import { type ApexOptions } from 'apexcharts';

const ColumnChart = (props: DataChartType) => {
	const { title, xAxis, yAxis, yLabel, height, type, formatY, colors } = props;

	const options: ApexOptions = {
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
			text: title ?? yLabel[0],
			align: 'left',
			style: {
				fontSize: '14px',
				fontWeight: '600',
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '50%',
			},
		},
		legend: {
			position: 'right',
		},
		responsive: [
			{
				breakpoint: 1600, //xxl
				options: {
					legend: { horizontalAlign: 'center', position: 'bottom' },
					plotOptions: {
						bar: {
							columnWidth: '100%',
						},
					},
				},
			},
		],
		dataLabels: {
			enabled: false,
		},
		yaxis: {
			labels: {
				formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)),
			},
		},
		xaxis: {
			categories: xAxis || [],
		},
		tooltip: {
			y: {
				formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)),
			},
		},
	};

	const series = yLabel.map((y, index) => ({
		name: y,
		data: yAxis?.[index] || [],
		color: colors?.[index] ?? '#007EB9',
	}));

	return <Chart options={options} series={series} type={type ?? 'bar'} height={height ?? 350} />;
};

export default ColumnChart;
