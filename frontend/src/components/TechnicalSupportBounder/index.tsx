import { ToolOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import FormPostIssue from './Form';
import { hasAuthParams, useAuth } from 'react-oidc-context';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const auth = useAuth();

  // automatically sign-in
  useEffect(() => {
    if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  const onCancel = () => setVisible(false);

  const onOpen = () => setVisible(true);

  return (
    <>
      {props.children}
      {window.location.pathname !== '/user/login' && (
        <Tooltip title="Phản hồi kĩ thuật" placement="topLeft">
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
    </>
  );
};

export default TechnicalSupportBounder;
