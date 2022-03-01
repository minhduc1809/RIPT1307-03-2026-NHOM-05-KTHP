import { useModel } from 'umi';
import FormCauHinhBieuMau from './FormCauHinhBieuMau';
import FormThongTinChung from './FormThongTinChung';
import { useEffect } from 'react';

const Form = () => {
  const { current, setCurrent } = useModel('bieumau');
  const { setConditionNguoiDungCuThe } = useModel('user');
  const { setCondition: setCondLopHanhChinh } = useModel('lophanhchinh');
  const { setCondition } = useModel('loptinchi');

  useEffect(() => {
    setCurrent(0);
    return () => {
      setConditionNguoiDungCuThe({});
      setCondLopHanhChinh({});
      setCondition({});
    };
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
