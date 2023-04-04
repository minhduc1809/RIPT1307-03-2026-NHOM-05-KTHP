import { Row } from 'antd';
import { useAccess } from 'umi';

const TrangChu = () => {
  const access = useAccess();
  return (
    <>
      <Row gutter={[20, 20]}>HOME</Row>
    </>
  );
};

export default TrangChu;
