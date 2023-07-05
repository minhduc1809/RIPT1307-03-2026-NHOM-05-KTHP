import useInitModel from '@/hooks/useInitModel';
import { type ThongBao } from '@/services/ThongBao/typing';
import { ipNotif } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<ThongBao.IRecord>('notification', undefined, undefined, ipNotif);

  return {
    ...objInit,
  };
};
