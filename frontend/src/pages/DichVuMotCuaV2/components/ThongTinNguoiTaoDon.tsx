import { Descriptions } from 'antd';
import moment from 'moment';

const ThongTinNguoiTaoDon = (props: { record?: Login.Profile }) => {
  return (
    <Descriptions>
      <Descriptions.Item>Họ và tên: {props?.record?.name}</Descriptions.Item>
      <Descriptions.Item>
        Ngày sinh:
        {props?.record?.ngay_sinh ? moment(props?.record?.ngay_sinh)?.format('DD/MM/YYYY') : ''}
      </Descriptions.Item>
      <Descriptions.Item>Mã sinh viên: {props?.record?.ma_dinh_danh}</Descriptions.Item>
      <Descriptions.Item>Chuyên ngành: {props?.record?.ma_dinh_danh}</Descriptions.Item>
      <Descriptions.Item>Lớp chuyên ngành: {props?.record?.ma_dinh_danh}</Descriptions.Item>
      <Descriptions.Item>Khóa học: {props?.record?.ma_dinh_danh}</Descriptions.Item>
    </Descriptions>
  );
};

export default ThongTinNguoiTaoDon;
