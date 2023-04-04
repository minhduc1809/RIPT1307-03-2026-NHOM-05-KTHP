import { ToolOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import FormPostIssue from './Form';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const onCancel = () => {
    setVisible(false);
  };

  const onOpen = () => {
    setVisible(true);
  };

  return (
    <div>
      {props.children}
      {window.location.pathname !== '/user/login' && (
        <Tooltip title="Phản hồi kĩ thuật">
          <Button
            onClick={onOpen}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 34,
              zIndex: 10,
            }}
            shape="circle"
            size="large"
            type="primary"
          >
            <ToolOutlined />
          </Button>
        </Tooltip>
      )}
      <Modal bodyStyle={{ padding: 0 }} footer={false} visible={visible} onCancel={onCancel}>
        <FormPostIssue onCancel={onCancel} />
      </Modal>
    </div>
  );
};

export default TechnicalSupportBounder;
