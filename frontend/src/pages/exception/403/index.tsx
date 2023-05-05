import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';

const NotAccessible = () => (
  <Result
    status="403"
    title="Truy cập bị từ chối"
    style={{
      background: 'none',
    }}
    subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
    extra={
      <Button type="primary" icon={<HomeOutlined />} onClick={() => (window.location.href = '/')}>
        Về trang chủ
      </Button>
    }
  />
);

export default NotAccessible;
