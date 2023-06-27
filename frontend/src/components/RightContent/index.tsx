import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import ModuleSwitch from './ModuleSwitch';
import NoticeIconView from './NoticeIcon';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.currentUser) {
    return null;
  }

  return (
    <div className={styles.right}>
      <ModuleSwitch />

      <NoticeIconView />

      <Tooltip title="Giới thiệu chung" placement="bottom">
        <a onClick={() => history.push('/tienichkhac/gioithieu')}>
          <InfoCircleOutlined />
        </a>
      </Tooltip>

      <Avatar menu />
    </div>
  );
};

export default GlobalHeaderRight;
