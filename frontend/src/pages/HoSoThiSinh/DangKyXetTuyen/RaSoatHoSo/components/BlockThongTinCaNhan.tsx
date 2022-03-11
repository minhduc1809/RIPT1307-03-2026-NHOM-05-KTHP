import { Descriptions } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
const { Item } = Descriptions;
const BlockRaSoatThongTinCaNhan = () => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const hoKhauThuongTru = recordHoSo?.thongTinThiSinh?.hoKhauThuongTru ?? {};
  const diaChiLienHe = recordHoSo?.thongTinThiSinh?.diaChiLienHe ?? {};
  return (
    <>
      <Descriptions layout="horizontal" bordered={false}>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>1. Họ và tên</span>}>
          {recordHoSo?.thongTinThiSinh?.hoDem} {recordHoSo?.thongTinThiSinh?.ten}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>2. Giới tính</span>}>
          {recordHoSo?.thongTinThiSinh?.gioiTinh}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>3. Ngày sinh</span>}>
          {moment(recordHoSo?.thongTinThiSinh?.ngaySinh).format('DD/MM/YYYY')}
        </Item>
        <Item span={2} label={<span style={{ fontWeight: 'bold' }}>4. Nơi sinh</span>}>
          {recordHoSo?.thongTinThiSinh?.loaiNoiSinh === 'TRONG_NUOC'
            ? recordHoSo?.thongTinThiSinh?.noiSinhTrongNuoc?.tenTP
            : recordHoSo?.thongTinThiSinh?.noiSinhNuocNgoai}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>5. CMT/CCCD</span>}>
          {recordHoSo?.thongTinThiSinh?.cmtCccd}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}>6. Hộ khẩu thường trú</span>}>
          {[
            hoKhauThuongTru?.diaChi,
            hoKhauThuongTru?.tenXaPhuong,
            hoKhauThuongTru?.tenQH,
            hoKhauThuongTru?.tenTP,
          ]
            ?.filter((item) => item !== undefined && item !== '')
            ?.join(', ')}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}>6. Địa chỉ liên hệ</span>}>
          {[
            diaChiLienHe?.diaChi,
            diaChiLienHe?.tenXaPhuong,
            diaChiLienHe?.tenQH,
            diaChiLienHe?.tenTP,
          ]
            ?.filter((item) => item !== undefined && item !== '')
            ?.join(', ')}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>7. Số điện thoại</span>}>
          {recordHoSo?.thongTinThiSinh?.soDienThoai}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>8. Email</span>}>
          {recordHoSo?.thongTinThiSinh?.email}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>9. Dân tộc</span>}>
          {recordHoSo?.thongTinThiSinh?.danToc}
        </Item>
      </Descriptions>
    </>
  );
};

export default BlockRaSoatThongTinCaNhan;
