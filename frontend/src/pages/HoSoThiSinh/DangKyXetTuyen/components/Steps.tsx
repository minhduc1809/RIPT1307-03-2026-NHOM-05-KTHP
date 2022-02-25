import { Card, Steps } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { Step } = Steps;

const Stepper = () => {
  const { current, setCurrent } = useModel('hosothisinh');
  useEffect(() => {
    return () => {
      setCurrent(0);
    };
  }, []);
  const onChangeStep = (step: number) => {
    setCurrent(step);
  };
  return (
    <Card title="Quy trình đăng ký">
      <Steps current={current} onChange={onChangeStep} direction="vertical">
        <Step title="Bước 1" description="Khai báo thông tin cá nhân" />
        <Step title="Bước 2" description="Thông tin học tập" />
        <Step title="Bước 3" description="Đăng ký nguyện vọng" />
        <Step title="Bước 4" description="Rà soát và nộp hồ sơ" />
      </Steps>
    </Card>
  );
};

export default Stepper;
