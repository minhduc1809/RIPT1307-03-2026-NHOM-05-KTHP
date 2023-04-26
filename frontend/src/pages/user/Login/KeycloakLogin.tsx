import { Button } from 'antd';
import { useAuth } from 'react-oidc-context';

const LoginWithKeycloak = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Đang chuyển tới trang đăng nhập...</div>;
  }

  if (auth.error) {
    return <div>Có lỗi xảy ra... {auth.error.message}</div>;
  }

  return (
    <div>
      <Button
        onClick={() => void auth.signinPopup()}
        type="primary"
        style={{
          marginTop: 8,
          width: '100%',
        }}
        size="large"
      >
        Đăng nhập bằng VWA Connect
      </Button>
    </div>
  );
};

export default LoginWithKeycloak;
