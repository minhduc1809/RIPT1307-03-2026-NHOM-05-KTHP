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
    // axios.interceptors.request.use(
    //   (config) => {
    //     config.headers.Authorization = `Bearer ${access_token}`;
    //     return config;
    //   },
    //   (error) => Promise.reject(error),
    // );
    axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  /**
   * Xử lý token, get info sau khi đăng nhập
   */
  const handleRole = async (role: { access_token: string; refresh_token: string }) => {
    if (!role || !role.access_token || !role.refresh_token) return;
    // Set localStorage for axios configurations
    // localStorage.setItem('token', role?.access_token);
    // localStorage.setItem('refreshToken', role?.refresh_token);
    handleAxios(role?.access_token);

    const decoded = jwt_decode(role?.access_token) as any;
    let curUser = initialState?.currentUser;
    if (!curUser) curUser = (await getInfo())?.data?.data;
    setInitialState({
      ...initialState,
      currentUser: curUser,
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

  /**
   * Swap token để lấy token mới, bao gồm cả thông tin permissions
   * @param token
   * @returns
   */
  const getSwapToken = async (token: { access_token: string }) => {
    if (token?.access_token) {
      handleAxios(token.access_token);
      const res = await swapToken();
      if (res && res?.data) return res.data;
    }
    return Promise.reject('Invalid token');
  };

  /**
   * Automatically sign-in
   */
  useEffect(() => {
    if (!auth.activeNavigator && !auth.isLoading) {
      if (!hasAuthParams() && !auth.isAuthenticated)
        // Nếu chưa đăng nhập thì chuyển đến màn đăng nhập của keyloak luôn
        auth.signinRedirect();
      else
        getSwapToken({ access_token: auth.user?.access_token ?? '' })
          .then((newToken) => handleRole(newToken))
          .catch(() => {
            // Nếu ko thể swap token, có thể do token đã hết hạn, hoặc bị đăng xuất rồi
            if (window.location.pathname === '/user/login') {
              auth.removeUser();
            } else {
              history.replace('/user/login');
              notification.warn({
                message: 'Phiên đăng nhập đã hết hạn',
                description: 'Vui lòng đăng nhập lại!',
              });
            }
            // Chỗ này mặc định sẽ về trang đăng nhập của web để thông báo Phiên đã hết hạn
            // Nếu muốn vào trang đăng nhập SSO luôn thì dùng auth.removeUser()
          });
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.user?.access_token]);

  return (
    <>
      {props.children}

      {window.location.pathname !== '/user/login' && window.location.pathname !== '/403' && (
        <Tooltip title="Phản hồi kĩ thuật" placement="topLeft">
          <Button
            onClick={() => setVisible(true)}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 34,
              zIndex: 10,
              boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 8px 3px',
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
