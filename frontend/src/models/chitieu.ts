import useInitModel from '@/hooks/useInitModel';
import { KhoiTaoKetQuaXetTuyen } from '@/services/ChiTieu/chitieu';
import type { EModeKhoiTao } from '@/utils/constants';
import { message } from 'antd';

export default () => {
  const objInit = useInitModel();
  const { setLoading } = objInit;
  const KhoiTaoKetQuaXetTuyenModel = async (
    idDotTuyenSinh: string,
    payload: { mode: EModeKhoiTao },
  ) => {
    if (!idDotTuyenSinh) return;
    try {
      setLoading(true);
      await KhoiTaoKetQuaXetTuyen(idDotTuyenSinh, payload);
      message.success('Khởi tạo thành công');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return {
    KhoiTaoKetQuaXetTuyenModel,
    ...objInit,
  };
};
