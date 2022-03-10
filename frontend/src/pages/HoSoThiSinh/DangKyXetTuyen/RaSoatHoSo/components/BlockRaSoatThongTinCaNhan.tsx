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
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}>10. Nơi học THPT</span>}>
          {''}
        </Item>
      </Descriptions>
      <Descriptions
        layout="horizontal"
        bordered
        size="small"
        column={6}
        style={{ marginBottom: 10 }}
      >
        <Item label={<div style={{ width: '50%' }}>Lớp 10</div>} span={6}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.maTruong}
        </Item>
        <Item label={<span>Lớp 11</span>} span={6}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.maTruong}
        </Item>
        <Item label={<span>Lớp 12</span>} span={6}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.maTruong}
        </Item>
      </Descriptions>
      <Descriptions>
        <Item
          span={3}
          label={<span style={{ fontWeight: 'bold' }}>11. Đối tượng ưu tiên tuyển sinh</span>}
        >
          {recordHoSo?.thongTinHocTapTHPT?.doiTuongUuTienTuyenSinh}
        </Item>
        <Item
          span={3}
          label={<span style={{ fontWeight: 'bold' }}> 12. Khu vực ưu tiên tuyển sinh</span>}
        >
          {recordHoSo?.thongTinHocTapTHPT?.khuVucUuTienTuyenSinh}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}> 13. Năm tốt nghiệp</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.namTotNghiep}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}> 14. Hạnh kiểm</span>}>
          {''}
        </Item>
      </Descriptions>

      <Descriptions layout="horizontal">
        <Item label={<span>Lớp 10</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop10?.hanhKiem}
        </Item>
        <Item label={<span>Lớp 11</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop11?.hanhKiem}
        </Item>
        <Item label={<span>Lớp 12 (hoặc Học kỳ 1)</span>}>
          {recordHoSo?.thongTinHocTapTHPT?.truongLop12?.hanhKiem}
        </Item>
      </Descriptions>
    </>
  );
};

export default BlockRaSoatThongTinCaNhan;
