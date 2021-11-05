import { Card, Steps } from 'antd';
import { useModel } from 'umi';
import FormBieuMau from '../QuanLyBieuMau/components/Form';

const { Step } = Steps;
const Form = () => {
  const { current, setCurrent } = useModel('dichvumotcuav2');

  return (
    <>
      {/* <Card
        style={{ border: 'none', zIndex: 1000000, position: 'absolute', top: 0, right: 300 }}
        bodyStyle={{ padding: '14px 0px 0px 0px' }}
      >
        <Steps
          current={current}
          onChange={(val) => {
            setCurrent(val);
          }}
        >
          <Step title="Quy trình" description="" />
          <Step title="Biểu mẫu" description="" />
        </Steps>
      </Card> */}

      <div>
        {current === 0 && <div>abc</div>}
        {current === 1 && <FormBieuMau />}
      </div>
    </>
  );
};

export default Form;
