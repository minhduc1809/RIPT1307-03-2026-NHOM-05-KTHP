import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiNhapHoc, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const DaKhoaHoSoNhapHoc = () => {
  return (
    <Card title="Đã khóa hồ sơ nhập học">
      <TableDanhSachTrungTuyen
        type="nhaphoc"
        hideTrangThai
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN,
          trangThaiNhapHoc: ETrangThaiNhapHoc.DA_KHOA,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default DaKhoaHoSoNhapHoc;
