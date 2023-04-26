import { InfoCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
// import NoticeIcon from '../NoticeIcon';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.currentUser) {
    return null;
  }

  return (
    <Space className={styles.right}>
      <a onClick={() => history.push('/tienichkhac/gioithieu')} title="Giới thiệu học viện">
        <InfoCircleOutlined />
      </a>

      {/* {!access.admin && !access.guest && <NoticeIcon />} */}
      <Avatar menu />
    </Space>
  );
};

export default GlobalHeaderRight;
