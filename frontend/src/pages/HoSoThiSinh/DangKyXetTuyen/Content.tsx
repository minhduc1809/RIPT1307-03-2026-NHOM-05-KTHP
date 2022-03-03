import { useModel } from 'umi';
import DangKyNguyenVong from './DangKyNguyenVong';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import QuaTrinhHocTapXetTuyenKetHop from './XetTuyenKetHop/QuaTrinhHocTap';
import RaSoatHoSoXetTuyenKetHop from './XetTuyenKetHop/RaSoatHoSo';

const Content = () => {
  const { current } = useModel('hosoxettuyen');
  let contentComponent = <div />;
  switch (current) {
    case 0:
      contentComponent = <KhaiBaoThongTinCaNhan />;
      break;
    case 1:
      contentComponent = <QuaTrinhHocTapXetTuyenKetHop />;

      break;
    case 2:
      contentComponent = <DangKyNguyenVong />;
      break;
    case 3:
      <RaSoatHoSoXetTuyenKetHop />;

      break;
  }

  return <div>{contentComponent}</div>;
};

export default Content;
