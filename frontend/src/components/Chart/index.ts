export * from './ColumnChart';
export * from './LineChart';
export * from './DonutChart';

export type DataChartType = {
  title?: string;
  xAxis: string[];
  yAxis: number[];
  yLabel: string;
  height?: number;
  type?: 'bar' | 'area';
  colors?: string[];
  formatY?: (val: number) => string;
};
