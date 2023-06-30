import Footer from '@/components/Footer';
import { landingUrl } from '@/services/ant-design-pro/constant';
import { currentRole } from '@/utils/ip';
import { GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { history, useModel } from 'umi';

const NotAccessible = () => {
  const auth = useAuth();
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (
      currentRole &&
      initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
    )
      history.replace('/dashboard');
  }, [initialState?.authorizedPermissions]);

  const onLogout = (): void => {
    auth.removeUser();
    auth.signoutRedirect({
      post_logout_redirect_uri: window.location.origin,
      id_token_hint: auth.user?.id_token,
    });
    window.location.href = '/';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <Result
        status="403"
        title="Truy cập bị từ chối"
        style={{
          background: 'none',
        }}
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              type="primary"
              onClick={() => (window.location.href = landingUrl)}
              icon={<GlobalOutlined />}
            >
              Tới trang Cổng thông tin
            </Button>
            <Button icon={<LogoutOutlined />} onClick={onLogout}>
              Đăng xuất
            </Button>
          </div>
        }
      />

      <Footer />
    </div>
  );
};
export default NotAccessible;
