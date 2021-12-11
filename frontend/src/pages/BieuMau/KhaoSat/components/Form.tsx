import { useModel } from 'umi';
import FormCauHinhBieuMau from './FormCauHinhBieuMau';
import FormThongTinChung from './FormThongTinChung';
import { useEffect } from 'react';

const Form = () => {
  const { current, setCurrent } = useModel('bieumau');

  useEffect(() => {
    setCurrent(0);
  }, []);

  return (
    <>
      <div>
        {current === 0 && <FormThongTinChung />}
        {current === 1 && <FormCauHinhBieuMau />}
      </div>
    </>
  );
};

export default Form;
