import ResultWithLogo from '@/components/ResultWithLogo';
import { ETrangThaiTrungTuyen } from '@/utils/constants';
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import TrungTuyen from './TrungTuyen';
import logo from '@/assets/logo.png';
import moment from 'moment';
import { Spin } from 'antd';

const XacNhanNhapHoc = () => {
  const { getMyKetQuaXetTuyenModel, record, setRecord, loading } = useModel('ketquaxettuyen');
  const {
    getDotTuyenSinhByIdModel,
    record: recordDot,
    setRecord: setRecordDot,
    loading: loadingDot,
  } = useModel('dottuyensinh');
  const {
    getMyHoSoXetTuyenModel,
    recordHoSo,
    setRecordHoSo,
    loading: loadingHoSo,
  } = useModel('hosoxettuyen');
  const isChuaDenThoiGianCongBo = moment(recordDot?.thoiGianCongBoKetQua).isAfter();
  const idDot = localStorage.getItem('dot');
  useEffect(() => {
    if (idDot) {
      getDotTuyenSinhByIdModel(idDot);
    } else history.push('/phuongthucxettuyen');
  }, [idDot]);

  useEffect(() => {
    if (recordDot?._id) {
      getMyHoSoXetTuyenModel(recordDot?._id);
    }
  }, [recordDot?._id]);

  useEffect(() => {
    if (recordDot?._id && recordHoSo?._id && !isChuaDenThoiGianCongBo) {
      getMyKetQuaXetTuyenModel(recordDot?._id);
    }
  }, [recordDot?._id, recordHoSo?._id]);

  useEffect(() => {
    return () => {
      setRecordHoSo(undefined);
      setRecordDot(undefined);
      setRecord(undefined);
    };
  }, []);

  let contentComponent = <div />;

  if (recordDot?._id) {
    if (isChuaDenThoiGianCongBo) {
      contentComponent = (
        <div>
          <ResultWithLogo
            logo={logo}
            title={'Chưa đến thời gian công bố kết quả xét tuyển'}
            subTitle={`Thời gian công bố kết quả ${moment(recordDot?.thoiGianCongBoKetQua).format(
              'HH:mm DD/MM/YYYY',
            )}`}
          />
        </div>
      );
    } else {
      if (recordHoSo === null) {
        <ResultWithLogo logo={logo} title="Bạn không có hồ sơ trong đợt tuyển sinh này" />;
      } else if (recordHoSo && record?._id) {
        if (record?.trangThai === ETrangThaiTrungTuyen.TRUNG_TUYEN)
          contentComponent = <TrungTuyen />;
        else
          contentComponent = (
            <ResultWithLogo
              logo={logo}
              title="Rất tiếc hồ sơ của bạn không đủ điều kiện trúng tuyển trong đợt tuyển sinh này"
            />
          );
      }
    }
  }

  return <Spin spinning={loading || loadingDot || loadingHoSo}>{contentComponent}</Spin>;
};

export default XacNhanNhapHoc;
