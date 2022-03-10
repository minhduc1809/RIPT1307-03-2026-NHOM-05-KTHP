import { useModel } from 'umi';
import DangKyNguyenVong from './DangKyNguyenVong';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import QuaTrinhHocTap from './ThongTinHocTap';
import RaSoatHoSo from './RaSoatHoSo';

const Content = () => {
  const { current } = useModel('hosoxettuyen');
  let contentComponent = <div />;
  switch (current) {
    case 0:
      contentComponent = <KhaiBaoThongTinCaNhan />;
      break;
    case 1:
      contentComponent = <QuaTrinhHocTap />;

      break;
    case 2:
      contentComponent = <DangKyNguyenVong />;
      break;
    case 3:
      contentComponent = <RaSoatHoSo />;
      break;
  }

  return <div>{contentComponent}</div>;
};

export default Content;
