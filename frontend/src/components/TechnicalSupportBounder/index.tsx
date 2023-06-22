import { getInfo, getPermission } from '@/services/ant-design-pro/api';
import { type Login } from '@/services/ant-design-pro/typings';
import axios from '@/utils/axios';
import { ToolOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { history, useIntl, useModel } from 'umi';
import FormPostIssue from './Form';
import { currentRole } from '@/utils/ip';

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
  const handleRole = async (role: { access_token?: string; permissions: Login.IPermission[] }) => {
    if (!role || !role.access_token) return;
    handleAxios(role?.access_token);

    let curUser = initialState?.currentUser;
    if (!curUser) curUser = (await getInfo())?.data?.data;
    setInitialState({
      ...initialState,
      currentUser: curUser,
      authorizedPermissions: role.permissions,
    });

    localStorage.removeItem('failed');
    if (
      currentRole &&
      role.permissions.length &&
      !role.permissions.find((item) => item.rsname === currentRole)
    )
      history.replace('/403');
    // Callback Đăng nhập từ Trang chủ hoặc từ Login
    else if (window.location.pathname === '/' || window.location.pathname === '/user/login') {
      const defaultloginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: 'success',
      });
      message.success(defaultloginSuccessMessage);
      history.replace('/dashboard');
    } else if (hasAuthParams())
      // Tới trang không có query để load lại dữ liệu
      history.replace(window.location.pathname);
  };

  /**
   * Lấy thông tin permissions
   * @param token
   * @returns
   */
  const getSwapToken = async (token: { access_token: string }): Promise<Login.IPermission[]> => {
    if (token?.access_token) {
      handleAxios(token.access_token);
      const res = await getPermission();
      if (res && res?.data) return res.data;
    }
    return Promise.reject('Invalid token');
  };

  /**
   * Automatically sign-in in first load
   */
  useEffect(() => {
    if (!auth.activeNavigator && !auth.isLoading) {
      const autoFailed = localStorage.getItem('failed');
      // Nếu chưa đăng nhập thì chuyển đến màn đăng nhập của keyloak luôn
      if (!hasAuthParams() && !auth.isAuthenticated) {
        console.log('1', autoFailed);
        if (!autoFailed || window.location.pathname !== '/user/login') auth.signinRedirect(); // Tránh load nhiều lần
      } else if (auth.user?.access_token) {
        getSwapToken({ access_token: auth.user.access_token })
          .then((permissions) => handleRole({ access_token: auth.user?.access_token, permissions }))
          .catch(() => {
            // Nếu ko thể swap token, có thể do token đã hết hạn, hoặc bị đăng xuất rồi
            if (!autoFailed)
              if (window.location.pathname === '/user/login') {
                notification.warn({
                  message: 'Phiên làm việc đã hết hạn',
                  description: 'Đang chuyển hướng tới trang đăng nhập...',
                });
                setTimeout(() => {
                  localStorage.setItem('failed', '1');
                  auth.signinRedirect();
                }, 1500);
              } else {
                history.replace('/user/login');
              }
          });
      } else if (window.location.pathname === '/') history.replace('/user/login');
    }
    console.log(auth.isAuthenticated, auth.activeNavigator, auth.isLoading); // Đừng bỏ đi
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading]);

  /**
   * Handle token changed, auto refresh token
   */
  useEffect(() => {
    if (auth.user?.access_token) handleAxios(auth.user.access_token);
  }, [auth.user?.access_token]);

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
