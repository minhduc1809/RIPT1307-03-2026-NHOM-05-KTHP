import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiNhapHoc, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const ChuaKhoaHoSoNhapHoc = () => {
  return (
    <Card title="Hồ sơ chưa khóa">
      <TableDanhSachTrungTuyen
        type="nhaphoc"
        hideTrangThai
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN,
          trangThaiNhapHoc: ETrangThaiNhapHoc.CHUA_KHOA,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default ChuaKhoaHoSoNhapHoc;
