import avatar from '@/assets/logo.png';
import type { Login } from '@/services/ant-design-pro/typings';
import {
  CalendarOutlined,
  ClusterOutlined,
  ContactsOutlined,
  ManOutlined,
  UserOutlined,
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

import type { ModalState } from './model';

const operationTabList = [
  {
    key: 'editCCCD',
    tab: 'Thông tin CMT/CCCD',
  },
  {
    key: 'editProfile',
    tab: <span>Thông tin cá nhân</span>,
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

    return null;
  };

  renderUserInfo = (currentUser: Partial<Login.Profile>) => {
    const role = currentUser?.systemRole;
    let roleText = 'Chưa xác định';
    let gioiTinhText = 'Khác';
    if (currentUser?.gioiTinh === 'NAM') gioiTinhText = 'Nam';
    else if (currentUser.gioiTinh === 'NU') gioiTinhText = 'Nữ';
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
          <ManOutlined
            style={{
              marginRight: 8,
            }}
          />
          {gioiTinhText}
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
        <Row gutter={24}>
          <Col lg={7} md={24}>
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
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
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
