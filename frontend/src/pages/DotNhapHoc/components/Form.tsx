import { useModel } from 'umi';
import FormHuongDanNhapHoc from './FormHuongDanNhapHoc';
import FormThongTinChung from './FormThongTinChung';
import { useEffect } from 'react';

const Form = () => {
  const { current, setCurrent } = useModel('dotnhaphoc');

  useEffect(() => {
    setCurrent(0);
  }, []);

  return (
    <>
      <div>
        {current === 0 && <FormThongTinChung />}
        {current === 1 && <FormHuongDanNhapHoc />}
      </div>
    </>
  );
};

export default Form;
