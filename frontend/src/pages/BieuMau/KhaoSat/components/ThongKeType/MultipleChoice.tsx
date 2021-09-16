import { Axis, Chart, Coord, Geom, Label, Tooltip } from 'bizcharts';
import numeral from 'numeral';

const BarLabel = (props: { ketQua: BieuMau.ThongKeLuaChon[] }) => {
  const cols = {};
  return (
    <div>
      <Chart height={300} width={800} data={props.ketQua} scale={cols}>
        <Coord transpose />
        <Axis name="noiDungLuaChon" />
        <Axis name="soLuong" visible={false} />
        <Tooltip />
        <Geom
          type="interval"
          position="noiDungLuaChon*soLuong"
          color={['noiDungLuaChon', '#E6F6C8-#3376CB']}
        >
          <Label
            content={['noiDungLuaChon*soLuong', (name, value) => numeral(value || 0).format()]}
          />{' '}
        </Geom>
      </Chart>
    </div>
  );
};

export default BarLabel;
