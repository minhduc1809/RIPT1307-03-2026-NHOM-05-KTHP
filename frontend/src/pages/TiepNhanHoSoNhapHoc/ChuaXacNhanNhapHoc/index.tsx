import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const ChuaXacNhanNhapHoc = () => {
  return (
    <Card title="Danh sách chưa xác nhận nhập học">
      <TableDanhSachTrungTuyen
        hideTrangThai
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default ChuaXacNhanNhapHoc;
