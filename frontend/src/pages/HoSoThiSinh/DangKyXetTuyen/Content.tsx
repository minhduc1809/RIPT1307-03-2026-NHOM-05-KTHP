import { useModel } from 'umi';
import DangKyNguyenVong from './DangKyNguyenVong';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import QuaTrinhHocTapXetTuyenKetHop from './XetTuyenKetHop/QuaTrinhHocTap';
import RaSoatHoSoXetTuyenKetHop from './XetTuyenKetHop/RaSoatHoSo';
import QuaTrinhHocTapXetTuyenDanhGiaNangLuc from './XetTuyenKetQuaDanhGiaNangLuc/QuaTrinhHocTap';
import RaSoatHoSoXetTuyenDanhGiaNangLuc from './XetTuyenKetQuaDanhGiaNangLuc/RaSoatHoSo';
import QuaTrinhHocTapXetTuyenKetQuaThiTHPT from './XetTuyenKetQuaThiTHPT/QuaTrinhHocTap';
import RaSoatHoSoXetTuyenKetQuaThiTHPT from './XetTuyenKetQuaThiTHPT/RaSoatHoSo';

const Content = () => {
  const { current } = useModel('hosothisinh');
  const idPhuongThuc = localStorage.getItem('phuongThuc');
  let contentComponent = <div />;
  switch (current) {
    case 0:
      contentComponent = <KhaiBaoThongTinCaNhan />;
      break;
    case 1:
      if (idPhuongThuc === '2') contentComponent = <QuaTrinhHocTapXetTuyenKetQuaThiTHPT />;
      else if (idPhuongThuc === '3') contentComponent = <QuaTrinhHocTapXetTuyenKetHop />;
      else contentComponent = <QuaTrinhHocTapXetTuyenDanhGiaNangLuc />;
      break;
    case 2:
      contentComponent = <DangKyNguyenVong />;
      break;
    case 3:
      if (idPhuongThuc === '2') contentComponent = <RaSoatHoSoXetTuyenKetQuaThiTHPT />;
      else if (idPhuongThuc === '3') contentComponent = <RaSoatHoSoXetTuyenKetHop />;
      else contentComponent = <RaSoatHoSoXetTuyenDanhGiaNangLuc />;
      break;
  }

  return <div>{contentComponent}</div>;
};

export default Content;
