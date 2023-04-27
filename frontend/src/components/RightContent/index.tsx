import { InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { history, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import ModuleSwitch from './ModuleSwitch';
import { Tooltip } from 'antd';
import NoticeIcon from './NoticeIcon/NoticeIcon';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.currentUser) {
    return null;
  }

  return (
    <div className={styles.right}>
      <ModuleSwitch />

      <NoticeIcon />

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
