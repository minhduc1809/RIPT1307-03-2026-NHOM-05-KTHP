import { getInfo, swapToken } from '@/services/ant-design-pro/api';
import { ToolOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip, message, notification } from 'antd';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { history, useIntl, useModel } from 'umi';
import FormPostIssue from './Form';
import axios from '@/utils/axios';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
  const { setInitialState, initialState } = useModel('@@initialState');
  const [visible, setVisible] = useState<boolean>(false);
  const intl = useIntl();
  const auth = useAuth();

  const handleAxios = (access_token: string) => {
    // Add a request interceptor
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${access_token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );
  };

  /**
   * Xử lý token, get info sau khi đăng nhập
   */
  const handleRole = async (role: { access_token: string; refresh_token: string }) => {
    if (!role || !role.access_token || !role.refresh_token) return;
    // Set localStorage for axios configurations
    // localStorage.setItem('token', role?.access_token);
    localStorage.setItem('refreshToken', role?.refresh_token);
    handleAxios(role?.access_token);

    const decoded = jwt_decode(role?.access_token) as any;
    const info = await getInfo();
    setInitialState({
      ...initialState,
      currentUser: info?.data?.data,
      authorizedPermissions: decoded?.authorization?.permissions,
    });

    // Callback Đăng nhập từ Trang chủ hoặc từ Login
    if (window.location.pathname === '/' || window.location.pathname === '/user/login') {
      const defaultloginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: 'success',
      });
      message.success(defaultloginSuccessMessage);
      history.push('/dashboard');
    }
  };

  const getSwapToken = async (token: { access_token: string }) => {
    if (token?.access_token) {
      const res = await swapToken(token);
      if (res && res?.data) return res.data;
    }
    return Promise.reject('Invalid token');
  };

  // automatically sign-in
  useEffect(() => {
    if (!auth.activeNavigator && !auth.isLoading) {
      if (!hasAuthParams() && !auth.isAuthenticated) {
        // Nếu chưa đăng nhập thì chuyển đến màn đăng nhập của keyloak luôn
        localStorage.removeItem('refreshToken');
        auth.signinRedirect();
      } else
        getSwapToken(auth.user as any)
          .then((newToken) => handleRole(newToken))
          .catch(() => {
            // Nếu ko thể swap token, có thể do token đã hết hạn, hoặc bị đăng xuất rồi
            if (window.location.pathname === '/user/login')
              notification.warn({
                message: 'Phiên đăng nhập đã hết hạn',
                description: 'Vui lòng đăng nhập lại!',
              });
            else history.push('/user/login');
          });
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  return (
    <>
      {props.children}

      {window.location.pathname !== '/user/login' && (
        <Tooltip title="Phản hồi kĩ thuật" placement="topLeft">
          <Button
            onClick={() => setVisible(true)}
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

      <Modal
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <FormPostIssue onCancel={() => setVisible(false)} />
      </Modal>
    </>
  );
};

export default TechnicalSupportBounder;
