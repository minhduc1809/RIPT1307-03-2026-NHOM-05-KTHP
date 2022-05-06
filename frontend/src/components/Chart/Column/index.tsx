import { Axis, Chart, Geom, Tooltip } from 'bizcharts';

const Basiccolumn = (props: {
  yLabel?: string;
  xLabel?: string;
  data: { x: string; y: number }[];
}) => {
  const cols = {
    y: {
      tickInterval: (Math.max(...props.data.map((o) => o.y)) / 10).toFixed(0),
      alias: props?.yLabel ?? 'y',
    },
    x: {
      alias: props?.xLabel ?? 'x',
    },
  };
  let name = ' ';
  const dataFinal = [...props.data];
  for (let i = props.data.length; i <= 8; i += 1) {
    dataFinal.push({
      x: name,
      y: 0,
    });
    name += ' ';
  }

  return (
    <div>
      <Chart height={500} data={dataFinal} scale={cols} forceFit>
        <Axis name="x" />
        <Axis name="y" />
        <Tooltip />
        <Geom type="interval" position="x*y" />
      </Chart>
    </div>
  );
};

export default Basiccolumn;
