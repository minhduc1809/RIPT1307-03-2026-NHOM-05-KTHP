import { Axis, Chart, Geom, Tooltip } from 'bizcharts';

const Basiccolumn = (props: {
  yLabel?: string;
  xLabel?: string;
  data: { x: string; y: number }[];
}) => {
  const cols = {
    y: {
      tickInterval: 100,
      alias: props?.yLabel ?? 'y',
    },
    x: {
      alias: props?.xLabel ?? 'x',
    },
  };
  return (
    <div>
      <Chart height={500} data={props?.data ?? []} scale={cols} forceFit>
        <Axis name="x" />
        <Axis name="y" />
        <Tooltip />
        <Geom type="interval" position="x*y" />
      </Chart>
    </div>
  );
};

export default Basiccolumn;
