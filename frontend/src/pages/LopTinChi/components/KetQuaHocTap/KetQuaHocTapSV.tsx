import { useEffect } from 'react';
import { useModel } from 'umi';
import DetaiKetQuaHocTap from './Detail';

const KetQuaHocTapSV = (props: { id: number }) => {
  const { sinhVienGetKetQuaHocTapByIdLopTinChiModel, ketQuaHocTap } = useModel('loptinchi');

  useEffect(() => {
    if (props.id) sinhVienGetKetQuaHocTapByIdLopTinChiModel(Number(props.id));
  }, []);

  return <DetaiKetQuaHocTap ketQuaHocTap={ketQuaHocTap} />;
};

export default KetQuaHocTapSV;
