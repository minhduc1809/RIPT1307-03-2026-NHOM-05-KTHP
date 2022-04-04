import avatar from '@/assets/logo.png';
import type { Login } from '@/services/ant-design-pro/typings';
import {
  CalendarOutlined,
  ClusterOutlined,
  ContactsOutlined,
  ManOutlined,
  UserOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import type { Input } from 'antd';
import { Card, Col, Row } from 'antd';
import moment from 'moment';
import { Component } from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import styles from './Center.less';
import Profile from './components/Profile';
import EditCCCD from './components/Profile/EditCCCD';
import ChangePassword from './components/Profile/ChangePassword';

import type { ModalState } from './model';

const operationTabList = [
  {
    key: 'editCCCD',
    tab: 'Thông tin cá nhân',
  },
  // {
  //   key: 'editProfile',
  //   tab: <span>Thông tin cá nhân</span>,
  // },
  {
    key: 'changePassword',
    tab: 'Đổi mật khẩu',
  },
];

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch;
  currentUser: Partial<Login.Profile>;
  currentUserLoading: boolean;
}
interface CenterState {
  tabKey?: 'editProfile' | 'editCCCD';
}

class Center extends Component<CenterProps, CenterState> {
  state: CenterState = {
    tabKey: 'editCCCD',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndcenter/fetchCurrent',
    });
  }

  onTabChange = (key: string) => {
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'editProfile') {
      return <Profile />;
    }
    if (tabKey === 'editCCCD') {
      return <EditCCCD />;
    }
    if (tabKey === 'changePassword') {
      return <ChangePassword />;
    }

    return null;
  };

  renderUserInfo = (currentUser: Partial<Login.Profile>) => {
    const role = currentUser?.systemRole;
    let roleText = 'Chưa xác định';
    if (role === 'ThiSinh') roleText = 'Thí sinh';
    else if (role === 'ChuyenVien') roleText = 'Chuyên viên';
    return (
      <div className={styles.detail}>
        <p>
          <ContactsOutlined
            style={{
              marginRight: 8,
            }}
          />
          {roleText}
        </p>
        <p>
          <UserOutlined
            style={{
              marginRight: 8,
            }}
          />
          {currentUser?.ten || ''}
        </p>
        <p>
          <CalendarOutlined
            style={{
              marginRight: 8,
            }}
          />
          {currentUser?.ngaySinh ? moment(currentUser?.ngaySinh).format('DD/MM/YYYY') : ''}
        </p>
        <p>
          {currentUser?.gioiTinh === 'Nam' ? (
            <ManOutlined
              style={{
                marginRight: 8,
              }}
            />
          ) : (
            <WomanOutlined />
          )}
          {currentUser?.gioiTinh ?? ''}
        </p>
        <p>
          <ClusterOutlined
            style={{
              marginRight: 8,
            }}
          />
          {currentUser?.email || ''}
        </p>
      </div>
    );
  };

  render() {
    const { tabKey } = this.state;
    const { currentUser } = this.props;
    const dataLoading = false;
    return (
      <GridContent>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 1000 }}>
            <Row gutter={24}>
              <Col lg={8} md={24}>
                <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
                  {!dataLoading && (
                    <div>
                      <div className={styles.avatarHolder}>
                        <img style={{ width: 70 }} alt="" src={currentUser?.anhDaiDien || avatar} />
                        <div className={styles.name}>{currentUser?.ten || 'Chưa cập nhật'}</div>
                        <div>{currentUser?.email || currentUser?.email || 'Chưa cập nhật'}</div>
                      </div>
                      {this.renderUserInfo(currentUser)}
                    </div>
                  )}
                </Card>
              </Col>
              <Col lg={14} md={24}>
                <Card
                  className={styles.tabsCard}
                  bordered={false}
                  tabList={operationTabList}
                  activeTabKey={tabKey}
                  onTabChange={this.onTabChange}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {this.renderChildrenByTabKey(tabKey)}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(
  ({
    loading,
    accountAndcenter,
  }: {
    loading: { effects: Record<string, boolean> };
    accountAndcenter: ModalState;
  }) => ({
    currentUser: accountAndcenter.currentUser,
    currentUserLoading: loading.effects['accountAndcenter/fetchCurrent'],
  }),
)(Center);
