import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiNhapHoc, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const DaXacNhanNhapHoc = () => {
  return (
    <Card title="Danh sách đã xác nhận nhập học">
      <TableDanhSachTrungTuyen
        hideTrangThai
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.XAC_NHAN,
          trangThaiNhapHoc: {
            $in: [ETrangThaiNhapHoc.CHUA_KHOA, ETrangThaiNhapHoc.YEU_CAU_CHINH_SUA],
          },
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default DaXacNhanNhapHoc;
