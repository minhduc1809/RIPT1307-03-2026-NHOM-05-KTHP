import { QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Badge, Menu, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { useAccess, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const HuongDanDropdown: React.FC = () => {
  const access = useAccess();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { record } = useModel('dottuyensinh');
  const { getAllHuongDanSuDungModel, danhSach } = useModel('huongdansudung');

  useEffect(() => {
    if (access.thiSinh || access.thiSinhChuaKichHoat) getAllHuongDanSuDungModel();
  }, []);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      window.open(key);
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
      <Menu.SubMenu title="Hướng dẫn hệ thống" key="HDHT">
        {danhSach?.map((item) => (
          <Menu.Item key={item?.tepDinhKem}>{item?.tenHuongDan}</Menu.Item>
        ))}
      </Menu.SubMenu>

      {record?._id && record?.danhSachHuongDanSuDung?.length ? (
        <>
          <Menu.Divider />
          <Menu.SubMenu title="Hướng dẫn theo đợt" key="HDTD">
            {record?.danhSachHuongDanSuDung?.map((item) => (
              <Menu.Item key={item?.tepDinhKem}>{item?.tenHuongDan}</Menu.Item>
            ))}
          </Menu.SubMenu>
        </>
      ) : (
        <div />
      )}
    </Menu>
  );
  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Badge style={{ fontSize: 12, boxShadow: 'none' }} count={2}>
            <QuestionCircleOutlined style={{ fontSize: 20, color: '#fff' }} />
          </Badge>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default HuongDanDropdown;
