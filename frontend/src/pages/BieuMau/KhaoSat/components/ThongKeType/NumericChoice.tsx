import { Bar } from '@ant-design/charts';

const ThongKeNumericChoice = (props: { ketQua: any }) => {
  return <Bar xField="soLuong" yField="giaTriTuyenTinh" data={props.ketQua} />;
};

export default ThongKeNumericChoice;
