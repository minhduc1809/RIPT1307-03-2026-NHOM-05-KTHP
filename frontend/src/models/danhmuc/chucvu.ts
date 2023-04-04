import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<VanBanQuyDinh.IRecord>('chuc-vu');

  return {
    ...objInit,
  };
};
