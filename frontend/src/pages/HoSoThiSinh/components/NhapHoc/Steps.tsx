import { Card, Steps } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const { Step } = Steps;

const StepperNhapHoc = () => {
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
    <Card title="Quy trình nhập học">
      <Steps current={current} onChange={onChangeStep} direction="vertical">
        <Step title="Bước 1" description="Lý lịch sinh viên" />
        <Step title="Bước 2" description="Upload giấy tờ liên quan" />
        <Step title="Bước 3" description="Hướng dẫn thủ tục nhập học" />
        <Step title="Bước 4" description="Rà soát và nộp hồ sơ" />
      </Steps>
    </Card>
  );
};

export default StepperNhapHoc;
