import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const TatCaHoSoNhapHoc = () => {
  return (
    <Card title="Tất cả hồ sơ nhập học">
      <TableDanhSachTrungTuyen
        type="nhaphoc"
        hideTrangThai
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default TatCaHoSoNhapHoc;
