import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const DaTiepNhanHoSoNhapHoc = () => {
  return (
    <Card title="Danh sách đã tiếp nhận hồ sơ nhập học">
      <TableDanhSachTrungTuyen
        hideTrangThai
        paramCondition={{
          trangThaiNhapHoc: ETrangThaiNhapHoc.DA_TIEP_NHAN,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default DaTiepNhanHoSoNhapHoc;
