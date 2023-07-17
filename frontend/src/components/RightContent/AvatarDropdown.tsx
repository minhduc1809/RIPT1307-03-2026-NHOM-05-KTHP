import logo from '@/assets/logo.png';
import { landingUrl } from '@/services/ant-design-pro/constant';
import { GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { useAuth } from 'react-oidc-context';
import { history, useModel } from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const auth = useAuth();

  const loginOut = async () => {
    const { query = {} } = history.location;
    const { redirect } = query;
    if (window.location.pathname !== '/user/login' && !redirect) {
      auth.removeUser();
      auth.signoutRedirect({
        post_logout_redirect_uri: window.location.origin,
        id_token_hint: auth.user?.id_token,
      });
      window.location.href = '/';
    } else {
      sessionStorage.clear();
      localStorage.clear();
      setInitialState({ ...initialState, currentUser: undefined });
    }
  };

  if (!initialState || !initialState.currentUser)
    return (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );

  const items: ItemType[] = [
    {
      key: 'portal',
      icon: <GlobalOutlined />,
      label: 'Cổng thông tin',
      onClick: () => window.open(landingUrl),
    },
    { type: 'divider', key: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: loginOut,
      danger: true,
    },
  ];
  if (menu && initialState.currentUser.systemRole !== 'Admin') {
    // items.splice(1, 0, {
    //   key: 'password',
    //   icon: <LockOutlined />,
    //   label: 'Đổi mật khẩu',
    //   onClick: () =>
    //     window.open(
    //       keycloakAuthority +
    //         '/login-actions/required-action?execution=UPDATE_PASSWORD&client_id=' +
    //         keycloakClientID,
    //     ),
    // });
    // items.splice(1, 0, {
    //   key: 'center',
    //   icon: <UserOutlined />,
    //   label: 'Trang cá nhân',
    //   onClick: () => history.push('/account/center'),
    // });
  }

  return (
    <>
      <HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            className={styles.avatar}
            src={
              <img
                // style={currentUser?.avatar_path ? {} : { objectFit: 'cover' }}
                src={logo}
              />
            }
            alt="avatar"
          />
          <span className={`${styles.name}`}>
            {initialState.currentUser?.fullname || initialState.currentUser?.username || ''}
          </span>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
