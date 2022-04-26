import { Space } from 'antd';
import React from 'react';
import { useAccess, useModel } from 'umi';
import NoticeIcon from '../NoticeIcon';
import Avatar from './AvatarDropdown';
import GioiThieuChung from './GioiThieuChung';
import HuongDanDropdown from './HuongDanDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC<{ marginTopGioiThieuChung: number }> = (props: {
  marginTopGioiThieuChung: number;
}) => {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      {!access.adminVaQuanTriVien && (
        <>
          <NoticeIcon />
          <HuongDanDropdown />
          <GioiThieuChung marginTop={props.marginTopGioiThieuChung} />
        </>
      )}
      <Avatar menu />
    </Space>
  );
};

export default GlobalHeaderRight;
