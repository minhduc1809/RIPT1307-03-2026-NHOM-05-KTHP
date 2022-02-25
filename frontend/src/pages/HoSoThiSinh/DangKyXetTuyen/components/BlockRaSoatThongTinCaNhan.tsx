import { Descriptions } from 'antd';
import moment from 'moment';
const { Item } = Descriptions;
const BlockRaSoatThongTinCaNhan = () => {
  const rc: any = {};
  return (
    <>
      <Descriptions layout="horizontal" bordered={false}>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>1. Họ và tên</span>}>
          {rc?.hoTen}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>2. Giới tính</span>}>
          {rc?.gioiTinh === 1 ? 'Nữ' : 'Nam'}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>3. Ngày sinh</span>}>
          {moment(rc?.ngaySinh).format('DD/MM/YYYY')}
        </Item>
        <Item span={2} label={<span style={{ fontWeight: 'bold' }}>4. Nơi sinh</span>}>
          {rc?.noiSinh}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>5. CMT/CCCD</span>}>
          {rc?.cmtCccd}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}>6. Địa chỉ liên hệ</span>}>
          {rc?.diaChiLienHe}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>7. Số điện thoại</span>}>
          {rc?.soDienThoai}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>8. Email</span>}>
          {rc?.email}
        </Item>
        <Item span={1} label={<span style={{ fontWeight: 'bold' }}>9. Dân tộc</span>}>
          {rc?.danToc}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}>10. Nơi học THPT</span>}>
          Chưa cập nhật
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
          {rc?.noiHoc?.lop10?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {rc?.noiHoc?.lop10?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {rc?.noiHoc?.lop10?.maTruong}
        </Item>
        <Item label={<span>Lớp 11</span>} span={6}>
          {rc?.noiHoc?.lop11?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {rc?.noiHoc?.lop11?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {rc?.noiHoc?.lop11?.maTruong}
        </Item>
        <Item label={<span>Lớp 12</span>} span={6}>
          {rc?.noiHoc?.lop12?.tenTruong}
        </Item>
        <Item label={<span>Mã tỉnh</span>} span={3}>
          {rc?.noiHoc?.lop12?.maTinh}
        </Item>
        <Item label={<span>Mã trường</span>} span={3}>
          {rc?.noiHoc?.lop12?.maTruong}
        </Item>
      </Descriptions>
      <Descriptions>
        <Item
          span={3}
          label={<span style={{ fontWeight: 'bold' }}>11. Đối tượng ưu tiên tuyển sinh</span>}
        >
          {rc?.doiTuongUuTienTuyenSinh}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}> 12. Khu vực ưu tiên</span>}>
          {rc?.khuVucUuTien}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}> 13. Thí sinh tốt nghiệp</span>}>
          {rc?.noiHoc?.thoiGianTotNghiep === 'Trước năm hiện tại'
            ? 'Trước năm 2021'
            : 'Tốt nghiệp năm 2021'}
        </Item>
        <Item span={3} label={<span style={{ fontWeight: 'bold' }}> 14. Hạnh kiểm</span>}>
          Tốt
        </Item>
      </Descriptions>

      <Descriptions layout="horizontal">
        <Item label={<span>Lớp 10</span>}>{rc?.noiHoc?.lop10?.hanhKiem}</Item>
        <Item label={<span>Lớp 11</span>}>{rc?.noiHoc?.lop11?.hanhKiem}</Item>
        <Item label={<span>Lớp 12 (hoặc Học kỳ 1)</span>}>{rc?.noiHoc?.lop12?.hanhKiem}</Item>
      </Descriptions>
    </>
  );
};

export default BlockRaSoatThongTinCaNhan;
