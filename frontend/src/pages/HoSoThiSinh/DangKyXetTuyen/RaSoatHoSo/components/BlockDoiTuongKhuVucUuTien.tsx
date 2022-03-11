import { Descriptions } from 'antd';
const { Item } = Descriptions;
import { useModel } from 'umi';

const BlockDoiTuongKhuVucUuTien = (props: {
  indexDoiTuong?: number;
  indexKhuVuc?: number;
  indexNamTotNghiep?: number;
}) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.indexDoiTuong ? `${props?.indexDoiTuong}.` : ''} Đối tượng ưu tiên tuyển sinh
            </span>
          }
        >
          {recordHoSo?.thongTinHocTapTHPT?.doiTuongUuTienTuyenSinh}
        </Item>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.indexKhuVuc ? `${props?.indexKhuVuc}.` : ''} Khu vực ưu tiên tuyển sinh
            </span>
          }
        >
          {recordHoSo?.thongTinHocTapTHPT?.khuVucUuTienTuyenSinh}
        </Item>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.indexNamTotNghiep ? `${props?.indexNamTotNghiep}.` : ''} Năm tốt nghiệp
            </span>
          }
        >
          {recordHoSo?.thongTinHocTapTHPT?.namTotNghiep}
        </Item>
      </Descriptions>
    </>
  );
};

export default BlockDoiTuongKhuVucUuTien;
