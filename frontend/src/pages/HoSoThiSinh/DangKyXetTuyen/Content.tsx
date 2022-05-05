import logo from '@/assets/logo.png';
import ResultWithLogo from '@/components/ResultWithLogo';
import { ETrangThaiHoSo } from '@/utils/constants';
import { Spin } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import ResultHoSo from './components/ResultKhoaHoSo';
import DangKyNguyenVong from './DangKyNguyenVong';
import KhaiBaoThongTinCaNhan from './KhaiBaoThongTinCaNhan';
import RaSoatHoSo from './RaSoatHoSo';
import QuaTrinhHocTap from './ThongTinHocTap';

const Content = () => {
  const { current, loading, recordHoSo, getMyHoSoXetTuyenModel, setRecordHoSo } =
    useModel('hosoxettuyen');

  const { record, getDotTuyenSinhByIdModel, loading: loadingDot } = useModel('dottuyensinh');
  const idDot = localStorage.getItem('dot');

  useEffect(() => {
    if (idDot && !record?._id) getDotTuyenSinhByIdModel(idDot);
    else if (!idDot) history.push('/phuongthucxettuyen');
  }, [idDot]);

  useEffect(() => {
    if (record?._id) {
      getMyHoSoXetTuyenModel(record?._id);
    }
  }, [record?._id]);

  useEffect(() => {
    return () => {
      setRecordHoSo(undefined);
    };
  }, []);

  const isChuaDenThoiGianDangKy = moment(record?.thoiGianMoDangKy).isAfter();
  const isKetThucThoiGianDangKy = moment(record?.thoiGianKetThucNopHoSo).isBefore();
  let contentComponent = <div />;

  if (record?._id && isChuaDenThoiGianDangKy) {
    contentComponent = (
      <ResultWithLogo
        logo={logo}
        title="Chưa đến thời gian đăng ký"
        subTitle={`Thời gian mở đăng ký ${moment(record?.thoiGianMoDangKy).format(
          'HH:mm DD/MM/YYYY',
        )}`}
      />
    );
  } else if (record?._id && isKetThucThoiGianDangKy) {
    contentComponent = recordHoSo?._id ? (
      <ResultHoSo />
    ) : (
      <ResultWithLogo
        logo={logo}
        title="Đã kết thúc thời gian đăng ký"
        subTitle={'Bạn không có hồ sơ trong đợt xét tuyển này'}
      />
    );
  } else {
    if (recordHoSo?.trangThai === ETrangThaiHoSo.CHUA_KHOA) {
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
    } else {
      contentComponent = recordHoSo?._id ? <ResultHoSo /> : <div />;
    }
  }

  return <Spin spinning={loading || loadingDot}>{contentComponent}</Spin>;
};

export default Content;
