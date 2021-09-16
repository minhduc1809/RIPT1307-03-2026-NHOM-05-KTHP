import { Bar } from '@ant-design/charts';

const ThongKeNumericChoice = (props: { ketQua: any }) => {
  const config = {
    data: props.ketQua,
    xField: 'soLuong',
    yField: 'giaTriTuyenTinh',
    colorField: 'giaTriTuyenTinh',
    meta: {
      soLuong: {
        alias: 'Số lượng',
        formatter: (v: number) => {
          return `${v} lựa chọn`;
        },
      },
      giaTriTuyenTinh: {
        alias: 'Giá trị',
        formatter: (v: string) => {
          return `Giá trị ${v}`;
        },
      },
    },
  };
  return <Bar {...config} />;
};

export default ThongKeNumericChoice;
