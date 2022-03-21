import { useModel } from 'umi';
import DangKyNguyenVong from './DangKyNguyenVong';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import QuaTrinhHocTap from './ThongTinHocTap';
import RaSoatHoSo from './RaSoatHoSo';
import { ETrangThaiHoSo } from '@/utils/constants';
import ResultKhoaHoSo from './components/ResultKhoaHoSo';

const Content = () => {
  const { current } = useModel('hosoxettuyen');
  const { recordHoSo } = useModel('hosoxettuyen');
  let contentComponent = <div />;
  if (recordHoSo?.trangThai === ETrangThaiHoSo.chuakhoa) {
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
  } else contentComponent = <ResultKhoaHoSo />;

  return <div>{contentComponent}</div>;
};

export default Content;
