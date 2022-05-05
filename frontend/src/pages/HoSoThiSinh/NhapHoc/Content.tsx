import logo from '@/assets/logo.png';
import ResultWithLogo from '@/components/ResultWithLogo';
import useInitTimeline from '@/hooks/useInitTimeline';
import { ETrangThaiNhapHoc } from '@/utils/constants';
import { Spin } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import ResultHoSo from './components/ResultKhoaHoSo';
// import DangKyNguyenVong from './DangKyNguyenVong';
import LyLichSinhVien from './LyLichSinhVien.tsx';
import RaSoatHoSo from './RaSoatHoSo';
// import QuaTrinhHocTap from './ThongTinHocTap';

const Content = () => {
  const { current, loading, getMyHoSoXetTuyenModel, setRecordHoSo } = useModel('hosoxettuyen');

  const { record: recordHoSo, getMyKetQuaXetTuyenModel } = useModel('ketquaxettuyen');

  const { record, getDotTuyenSinhByIdModel, loading: loadingDot } = useModel('dottuyensinh');
  const idDot = localStorage.getItem('dot');

  const { setupTimeline } = useInitTimeline();

  const {
    record: recordDotNhapHoc,
    setRecord: setRecordDotNhapHoc,
    getDotNhapHocByIdDotTuyenSinhModel,
  } = useModel('dotnhaphoc');

  useEffect(() => {
    if (idDot && !record?._id) getDotTuyenSinhByIdModel(idDot);
    else if (!idDot) history.push('/phuongthucxettuyen');
  }, [idDot]);

  useEffect(() => {
    if (record?._id) {
      setupTimeline(recordDotNhapHoc);
      getMyHoSoXetTuyenModel(record?._id);
      getDotNhapHocByIdDotTuyenSinhModel(record?._id);
      getMyKetQuaXetTuyenModel(record?._id);
    }
  }, [record?._id]);

  useEffect(() => {
    return () => {
      setRecordHoSo(undefined);
      setRecordDotNhapHoc(undefined);
    };
  }, []);

  const isChuaDenThoiGianNhapHoc = moment(recordDotNhapHoc?.ngayBatDau).isAfter();
  const isKetThucThoiGianNhapHoc = moment(recordDotNhapHoc?.ngayKetThuc).isBefore();
  let contentComponent = <div />;

  if (recordHoSo === null) {
    // khong co ho so trung tuyen
    contentComponent = (
      <ResultWithLogo
        logo={logo}
        title="Rất tiếc hồ sơ của bạn không đủ điều kiện trúng tuyển trong đợt tuyển sinh này"
      />
    );
  } else if (record?._id && recordDotNhapHoc?._id && isChuaDenThoiGianNhapHoc) {
    // co dot nhap hoc, chua den thoi gian nhap hoc
    contentComponent = (
      <ResultWithLogo
        logo={logo}
        title="Chưa đến thời gian nhập học"
        subTitle={`Thời gian bắt đầu nhập học ${moment(recordDotNhapHoc?.ngayBatDau).format(
          'HH:mm DD/MM/YYYY',
        )}`}
      />
    );
  } else if (record?._id && recordDotNhapHoc?._id && isKetThucThoiGianNhapHoc) {
    // co dot nhap hoc, da ket thuc thoi gian nhap hoc
    contentComponent = recordHoSo?._id ? (
      <ResultHoSo />
    ) : (
      <ResultWithLogo
        logo={logo}
        title="Đã kết thúc thời gian nhập học"
        subTitle={'Bạn không có hồ sơ nhập học trong đợt nhập học này'}
      />
    );
  } else if (record?._id && recordDotNhapHoc?._id) {
    // co dot nhap hoc
    if (recordHoSo?.trangThaiNhapHoc === ETrangThaiNhapHoc.CHUA_KHOA) {
      // chua khoa ho so nhap hoc
      switch (current) {
        case 0:
          contentComponent = <LyLichSinhVien />;
          break;
        // case 1:
        //   contentComponent = <QuaTrinhHocTap />;

        //   break;
        // case 2:
        //   contentComponent = <DangKyNguyenVong />;
        //   break;
        case 3:
          contentComponent = <RaSoatHoSo />;
          break;
      }
    } else {
      // da khoa, da tiep nhan, yeu cau chinh sua ho so nhap hoc
      contentComponent = recordHoSo?._id ? <ResultHoSo /> : <div />;
    }
  } else {
    // khong co dot nhap hoc
    contentComponent = (
      <ResultWithLogo logo={logo} title="Chưa có đợt nhập học cho đợt tuyển sinh này" />
    );
  }

  return <Spin spinning={loading || loadingDot}>{contentComponent}</Spin>;
};

export default Content;
