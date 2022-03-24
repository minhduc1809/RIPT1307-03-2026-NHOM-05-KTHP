import { useModel } from 'umi';
import useInitTimeline from '@/hooks/useInitTimeline';
import DangKyNguyenVong from './DangKyNguyenVong';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import QuaTrinhHocTap from './ThongTinHocTap';
import RaSoatHoSo from './RaSoatHoSo';
import { ETrangThaiHoSo } from '@/utils/constants';
import ResultKhoaHoSo from './components/ResultKhoaHoSo';
import ChuaMoDangKy from './components/ChuaMoDangKy';
import QuaThoiGianDangKy from './components/QuaThoiGianDangKy';
import { useEffect } from 'react';
import moment from 'moment';

const Content = () => {
  const { current } = useModel('hosoxettuyen');
  const { recordHoSo } = useModel('hosoxettuyen');
  const { record, getDotTuyenSinhByIdModel } = useModel('dottuyensinh');
  const idDot = localStorage.getItem('dot');

  const { data, setupTimeline } = useInitTimeline();

  useEffect(() => {
    if (idDot) getDotTuyenSinhByIdModel(idDot);
  }, []);

  useEffect(() => {
    if (record?._id) setupTimeline(record);
  }, [record?._id]);

  console.log('data', data);
  const moDangKyTime = moment(data[0]?.title).format('YYYY/MM/DD HH:mm:ss');
  const ketThucDangKyTime = moment(data[1]?.title).format('YYYY/MM/DD HH:mm:ss');
  const today = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

  // let d = '2021/03/23 11:20:50'

  let contentComponent = <div />;

  if (today.valueOf() < moDangKyTime.valueOf()) {
    contentComponent = <ChuaMoDangKy />;
  }
  if (today.valueOf() >= ketThucDangKyTime.valueOf()) {
    contentComponent = <QuaThoiGianDangKy />;
  }
  if (today.valueOf() >= moDangKyTime.valueOf() && today.valueOf() < ketThucDangKyTime.valueOf()) {
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
  }

  return <div>{contentComponent}</div>;
};

export default Content;
