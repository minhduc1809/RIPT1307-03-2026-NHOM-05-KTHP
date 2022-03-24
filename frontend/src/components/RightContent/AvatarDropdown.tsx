import logo from '@/assets/logo.png';
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
    history.replace({
      pathname: '/user/login',
    });
  }
};
const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        localStorage.removeItem('vaiTro');
        localStorage.removeItem('token');
        localStorage.removeItem('accessTokens');
        localStorage.removeItem('phuongThuc');
        localStorage.removeItem('dot');
        localStorage.removeItem('nam');
        loginOut();
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
            size="small"
            className={styles.avatar}
            src={<img style={{ objectFit: 'cover', maxWidth: 18, maxHeight: 22 }} src={logo} />}
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>
            {`${currentUser?.hoDem ?? ''} ${currentUser?.ten ?? ''}`}
          </span>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
