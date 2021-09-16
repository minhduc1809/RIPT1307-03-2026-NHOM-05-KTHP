import { Pie } from '@ant-design/charts';

const ThongKeSingleChoice = (props: { ketQua: any }) => {
  return (
    <Pie
      angleField="soLuong"
      colorField="noiDungLuaChon"
      data={props.ketQua}
      label={{
        type: 'inner',
        visible: true,
        offset: '-50%',
        style: { textAlign: 'center' },
        autoRotate: false,
      }}
    />
  );
};

export default ThongKeSingleChoice;
