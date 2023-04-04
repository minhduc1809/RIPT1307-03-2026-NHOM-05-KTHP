import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<VanBanQuyDinh.IRecord>('van-ban');

  return {
    ...objInit,
  };
};
