import DataSet from '@antv/data-set';
import { Axis, Chart, Coord, Geom, Guide, Label, Legend, Tooltip } from 'bizcharts';

const Donut = (props: {
  data: { x: any; y: any }[];
  hideLabel?: boolean;
  hideLegend?: boolean;
  height?: number;
  labelTong?: string;
}) => {
  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();
  dv.source(props?.data ?? []).transform({
    type: 'percent',
    field: 'y',
    dimension: 'x',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: (val: number) => {
        return `${(val * 100).toFixed(2)}%`;
      },
    },
  };
  return (
    <div>
      <Chart padding={0} height={props?.height ?? 500} data={dv} scale={cols} forceFit>
        <Coord type={'theta'} radius={0.6} innerRadius={0.8} />
        <Axis name="percent" />
        <Legend visible={!props?.hideLegend} layout="horizontal" position="bottom" />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Guide>
          <Html
            position={['50%', '50%']}
            html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">Tổng số<br><span style="color:#262626;font-size:1.5em">${props.data.reduce(
              (sum, currentValue) => {
                return sum + currentValue.y;
              },
              0,
            )}</span>${props?.labelTong ?? ''}</div>`}
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color="x"
          tooltip={[
            'x*y*percent',
            (x, y, percent) => {
              return {
                name: x,
                value: `${y} (${(percent * 100).toFixed(2)}%)`,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        >
          {!props?.hideLabel && (
            <Label
              content="percent"
              formatter={(val, x) => {
                return `${x.point.x}: ${val}`;
              }}
            />
          )}
        </Geom>
      </Chart>
    </div>
  );
};

export default Donut;
