import { EuroCircleOutlined, FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const HuongDanDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'HDSD' && initialState) {
        window.open('https://dkxt.apd.edu.vn/api-v3/file/6247b7ac3c3c4d7ffb2a38db/hdsd.pdf');
        return;
      }
      if (key === 'HDTT') {
        window.open(
          'https://dkxt.apd.edu.vn/api-v3/file/6246a47d61ed770f349d7e7d/huongdanthanhtoan.pdf',
        );
        return;
      }
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
      <Menu.Item key="HDSD">
        <FileTextOutlined />
        Hướng dẫn sử dụng
      </Menu.Item>
      <Menu.Divider />

      <Menu.Item key="HDTT">
        <EuroCircleOutlined />
        Hướng dẫn nộp lệ phí
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <QuestionCircleOutlined />
        </span>
      </HeaderDropdown>
    </>
  );
};

export default HuongDanDropdown;
