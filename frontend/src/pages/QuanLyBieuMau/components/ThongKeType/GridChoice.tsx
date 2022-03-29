import DataSet from '@antv/data-set';
import { Axis, Chart, Geom, Legend, Tooltip } from 'bizcharts';

const Groupedcolumn = (props: { ketQua: BieuMau.ThongKeLuaChonGrid[] }) => {
  const data = props.ketQua?.map((item) => {
    const record = {
      name: item.noiDungHang,
    };
    item.thongKeCot.forEach((cot) => {
      record[`${cot.noiDungCot}`] = cot?.soLuong ?? 0;
    });
    return record;
  });

  const fields = props.ketQua?.[0]?.thongKeCot?.map((item) => {
    return item.noiDungCot;
  });
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields,
    // 展开字段集
    key: '月份',
    // key字段
    value: '月均降雨量', // value字段
  });
  return (
    <div>
      <Chart height={400} data={dv} forceFit>
        <Axis name="月份" />
        <Axis name="月均降雨量" />
        <Legend />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
        />
        <Geom
          type="interval"
          position="月份*月均降雨量"
          color={'name'}
          adjust={[
            {
              type: 'dodge',
              marginRatio: 1 / 32,
            },
          ]}
        />
      </Chart>
    </div>
  );
};
export default Groupedcolumn;
