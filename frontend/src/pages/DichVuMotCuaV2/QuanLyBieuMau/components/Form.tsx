import { useModel } from 'umi';
import FormBieuMau from './FormTaoBieuMau';
import FormTaoQuyTrinh from './FormTaoQuyTrinh';
import FormThongTinChung from './FormThongTinChung';
import { useEffect } from 'react';

const Form = () => {
  const { current } = useModel('dichvumotcuav2');
  const { setRecord } = useModel('thanhtoan');

  useEffect(() => {
    return () => {
      setRecord(undefined);
    };
  }, []);

  return (
    <>
      <div>
        {current === 2 && <FormTaoQuyTrinh />}
        {current === 1 && <FormBieuMau />}
        {current === 0 && <FormThongTinChung />}
      </div>
    </>
  );
};

export default Form;
