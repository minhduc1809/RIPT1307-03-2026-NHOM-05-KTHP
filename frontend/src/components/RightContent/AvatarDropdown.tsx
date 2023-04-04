import logo from '@/assets/logo.png';
import { keycloakLogoutEndpoint } from '@/utils/ip';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const loginOut = async () => {
  const { query = {} } = history.location;
  const { redirect } = query;
  if (window.location.pathname !== '/user/login' && !redirect) {
    const uri = `${window.location.origin}/user/login`;
    const id_token = localStorage.getItem('id_token');
    window.location.href = `${keycloakLogoutEndpoint}?post_logout_redirect_uri=${uri}&id_token_hint=${id_token}`;
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    async (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        loginOut();
        localStorage.clear();
        setInitialState({ ...initialState, currentUser: undefined });
        return;
      }
      history.push(`/account/${key}`);
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

  const accessTokens = localStorage?.getItem('accessTokens')
    ? JSON.parse(localStorage?.getItem('accessTokens') ?? '')
    : [];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && localStorage.getItem('vaiTro') !== 'Admin' && (
        <Menu.Item key="center">
          <UserOutlined />
          Trang cá nhân
        </Menu.Item>
      )}

      {menu && localStorage.getItem('vaiTro') !== 'Admin' && <Menu.Divider />}
      {accessTokens?.length > 1 && (
        <>
          <Menu.Item key="settings">
            <SettingOutlined />
            Đổi vai trò
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
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
                style={currentUser?.avatar_path ? {} : { objectFit: 'cover' }}
                src={currentUser.avatar_path || logo}
              />
            }
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>
            {currentUser?.fullname || currentUser?.profile?.lastname || ''}
          </span>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
