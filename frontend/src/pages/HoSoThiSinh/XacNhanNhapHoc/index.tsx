import ResultWithLogo from '@/components/ResultWithLogo';
import { ETrangThaiTrungTuyen } from '@/utils/constants';
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import TrungTuyen from './TrungTuyen';
import logo from '@/assets/logo.png';

const XacNhanNhapHoc = () => {
  const { getMyKetQuaXetTuyenModel, record } = useModel('ketquaxettuyen');
  const { getDotTuyenSinhByIdModel } = useModel('dottuyensinh');
  const { getMyHoSoXetTuyenModel, recordHoSo } = useModel('hosoxettuyen');
  const idDot = localStorage.getItem('dot');
  useEffect(() => {
    if (idDot) {
      getMyKetQuaXetTuyenModel(idDot);
      getDotTuyenSinhByIdModel(idDot);
      getMyHoSoXetTuyenModel(idDot);
    } else history.push('/phuongthucxettuyen');
  }, [idDot]);

  return (
    <div>
      {recordHoSo?._id && record?.trangThai === ETrangThaiTrungTuyen.TRUNG_TUYEN && <TrungTuyen />}
      {!recordHoSo?._id && (
        <ResultWithLogo logo={logo} title="Bạn không có hồ sơ trong đợt tuyển sinh này" />
      )}
      {recordHoSo?._id && record?.trangThai === ETrangThaiTrungTuyen.KHONG_TRUNG_TUYEN && (
        <ResultWithLogo
          logo={logo}
          title="Rất tiếc hồ sơ của bạn không đủ điều kiện trúng tuyển trong đợt tuyển sinh này"
        />
      )}
    </div>
  );
};

export default XacNhanNhapHoc;
