import logo from '@/assets/logo.png';
import SelectRoles from '@/pages/user/Login/SelectRole';
import { Role } from '@/utils/constants';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu, Modal, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
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
  const [visibleRole, setVisibleRole] = useState<boolean>(false);
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        localStorage.removeItem('vaiTro');
        localStorage.removeItem('token');
        localStorage.removeItem('accessTokens');
        loginOut();
        return;
      }
      if (key === 'settings' && initialState) {
        setVisibleRole(true);
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

  const vaiTro = localStorage.getItem('vaiTro');
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
            src={
              <img
                style={
                  currentUser?.avatar_path
                    ? {}
                    : { objectFit: 'cover', maxWidth: 18, maxHeight: 22 }
                }
                src={currentUser.avatar_path || logo}
              />
            }
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>
            {currentUser?.name || currentUser?.profile?.lastname || ''}{' '}
            {accessTokens?.length > 1 ? `(${Role[vaiTro || '']})` : ''}
          </span>
        </span>
      </HeaderDropdown>
      <Modal
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleRole(false);
            }}
          >
            Hủy
          </Button>
        }
        width="400px"
        onCancel={() => {
          setVisibleRole(false);
        }}
        visible={visibleRole}
        title="Chọn vai trò"
      >
        <SelectRoles
          type="changeRole"
          roles={accessTokens}
          onClose={() => {
            setVisibleRole(false);
          }}
        />
      </Modal>
    </>
  );
};

export default AvatarDropdown;
