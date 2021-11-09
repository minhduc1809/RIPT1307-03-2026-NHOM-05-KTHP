import { useModel } from 'umi';
import FormBieuMau from './FormTaoBieuMau';
import FormTaoQuyTrinh from './FormTaoQuyTrinh';

const Form = () => {
  const { current } = useModel('dichvumotcuav2');

  return (
    <>
      <div>
        {current === 1 && <FormTaoQuyTrinh />}
        {current === 0 && <FormBieuMau />}
      </div>
    </>
  );
};

export default Form;
