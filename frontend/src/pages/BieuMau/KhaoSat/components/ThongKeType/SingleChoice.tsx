import DataSet from '@antv/data-set';
import { Axis, Chart, Coord, Geom, Guide, Label, Legend, Tooltip } from 'bizcharts';

const Donut = (props: { ketQua: BieuMau.ThongKeLuaChon; tong: number }) => {
  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();
  dv.source(props?.ketQua ?? []).transform({
    type: 'percent',
    field: 'soLuong',
    dimension: 'noiDungLuaChon',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: (val: number) => {
        return `${val * 100}%`;
      },
    },
  };
  return (
    <div>
      <Chart height={400} data={dv} scale={cols} padding={0} forceFit>
        <Coord type={'theta'} radius={0.6} innerRadius={0.8} />
        <Axis name="percent" />
        <Legend position="bottom" />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Guide>
          <Html
            position={['50%', '50%']}
            html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">Số người trả lời<br><span style="color:#262626;font-size:2.5em">${props.tong}</span>người</div>`}
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color="noiDungLuaChon"
          tooltip={[
            'noiDungLuaChon*percent',
            (noiDungLuaChon, percent) => {
              return {
                name: noiDungLuaChon,
                value: `${percent * 100}%`,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        >
          <Label
            content="percent"
            formatter={(val, noiDungLuaChon) => {
              return `${noiDungLuaChon.point.noiDungLuaChon}: ${val}`;
            }}
          />
        </Geom>
      </Chart>
    </div>
  );
};

export default Donut;
