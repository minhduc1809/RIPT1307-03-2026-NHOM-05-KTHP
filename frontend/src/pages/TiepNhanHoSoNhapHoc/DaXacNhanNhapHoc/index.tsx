import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const DaXacNhanNhapHoc = () => {
  return (
    <Card title="Danh sách đã xác nhận nhập học">
      <TableDanhSachTrungTuyen
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.XAC_NHAN,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default DaXacNhanNhapHoc;
