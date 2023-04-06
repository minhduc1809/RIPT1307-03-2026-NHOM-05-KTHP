import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<ChucVu.IRecord>('loai-phong-ban');

  return {
    ...objInit,
  };
};
