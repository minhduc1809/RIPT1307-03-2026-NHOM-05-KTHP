import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<VanBanQuyDinh.IRecord>('loai-phong-ban');

  return {
    ...objInit,
  };
};
