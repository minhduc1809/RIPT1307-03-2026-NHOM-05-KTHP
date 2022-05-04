import useInitTimeline from '@/hooks/useInitTimeline';
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import LyLichSinhVien from './LyLichSinhVien.tsx';

const ContentNhapHoc = () => {
  const { current } = useModel('hosoxettuyen');
  const { record, getDotTuyenSinhByIdModel } = useModel('dottuyensinh');
  const { getMyKetQuaXetTuyenModel, setRecord } = useModel('ketquaxettuyen');
  const idDot = localStorage.getItem('dot');

  const { setupTimeline } = useInitTimeline();

  useEffect(() => {
    if (idDot && !record?._id) getDotTuyenSinhByIdModel(idDot);
    else if (!idDot) history.push('/phuongthucxettuyen');
  }, [idDot]);

  useEffect(() => {
    if (record?._id) {
      setupTimeline(record);
      getMyKetQuaXetTuyenModel(record?._id);
    }
  }, [record?._id]);

  useEffect(() => {
    return () => {
      setRecord(undefined);
    };
  }, []);

  let contentComponent = <div />;
  switch (current) {
    case 0:
      contentComponent = <LyLichSinhVien />;
      break;
    case 1:
      contentComponent = <div>Thông tin nhập học và thanh toán</div>;
      break;
  }

  return <div>{contentComponent}</div>;
};

export default ContentNhapHoc;
