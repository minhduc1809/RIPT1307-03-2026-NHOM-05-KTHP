import { ArrowUpOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const ButtonScrollToTop = () => {
  const onClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: 50, right: 30, zIndex: 2 }}>
      <Tooltip title="Lên trên">
        <Button onClick={onClick} type="primary" size="small" icon={<ArrowUpOutlined />} />
      </Tooltip>
    </div>
  );
};

export default ButtonScrollToTop;
