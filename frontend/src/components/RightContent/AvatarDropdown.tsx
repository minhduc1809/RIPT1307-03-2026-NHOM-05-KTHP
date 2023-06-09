import logo from '@/assets/logo.png';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
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
      // auth.removeUser();
      auth.signoutRedirect({
        post_logout_redirect_uri: window.location.origin,
        id_token_hint: auth.user?.id_token,
      });
      window.location.href = '/';
    }
  };

  const onMenuClick = useCallback(
    async (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        loginOut();
        localStorage.clear();
        setInitialState({ ...initialState, currentUser: undefined });
      } else history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = (
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

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  if (!currentUser) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && localStorage.getItem('vaiTro') !== 'Admin' && (
        <Menu.Item key="center">
          <UserOutlined />
          Trang cá nhân
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
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
            {currentUser?.fullname || currentUser?.username || ''}
          </span>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
