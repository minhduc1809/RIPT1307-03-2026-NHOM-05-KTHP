import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const DaKhoaHoSoNhapHoc = () => {
  return (
    <Card title="Danh sách đã khóa hồ sơ nhập học">
      <TableDanhSachTrungTuyen
        paramCondition={{
          trangThaiNhapHoc: ETrangThaiNhapHoc.DA_KHOA,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default DaKhoaHoSoNhapHoc;
