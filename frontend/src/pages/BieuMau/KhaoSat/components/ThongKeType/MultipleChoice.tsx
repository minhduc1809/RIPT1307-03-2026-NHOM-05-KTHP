import { Bar } from '@ant-design/charts';

const ThongKeMultipleChoice = (props: { ketQua: any }) => {
  return (
    <Bar
      xField="soLuong"
      yField="noiDungLuaChon"
      data={props.ketQua}
      colorField="noiDungLuaChon"
      legend={{ position: 'top-left' }}
    />
  );
};

export default ThongKeMultipleChoice;
