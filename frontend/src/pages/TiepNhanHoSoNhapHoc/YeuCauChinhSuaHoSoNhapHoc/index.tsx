import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import TableDanhSachTrungTuyen from '@/pages/KetQuaXetTuyen/components/TableDanhSachTrungTuyen';
import { ETrangThaiNhapHoc, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { Card } from 'antd';

const DaXacNhanNhapHoc = () => {
  return (
    <Card title="Yêu cầu chỉnh sửa hồ sơ nhập học">
      <TableDanhSachTrungTuyen
        type="nhaphoc"
        hideTrangThai
        paramCondition={{
          'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN,
          trangThaiNhapHoc: ETrangThaiNhapHoc.YEU_CAU_CHINH_SUA,
        }}
      >
        <FilterDotTuyenSinh />
      </TableDanhSachTrungTuyen>
    </Card>
  );
};

export default DaXacNhanNhapHoc;
