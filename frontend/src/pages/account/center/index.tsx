import avatar from '@/assets/admin.png';
import { ClusterOutlined, ContactsOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import type { Input } from 'antd';
import { Card, Col, Row } from 'antd';
import { Component } from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import styles from './Center.less';
import Profile from './components/Profile';
import Projects from './components/Projects';
import type { ModalState } from './model';

const operationTabList = [
  {
    key: 'editProfile',
    tab: 'Thông tin tài khoản',
  },
  {
    key: 'changePassword',
    tab: <span>Đổi mật khẩu</span>,
  },
];

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch;
  currentUser: Partial<IInfoSV.Data | IInfoGV.Data>;
  currentUserLoading: boolean;
}
interface CenterState {
  tabKey?: 'editProfile' | 'changePassword';
}

class Center extends Component<CenterProps, CenterState> {
  state: CenterState = {
    tabKey: 'editProfile',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndcenter/fetchCurrent',
    });
    dispatch({
      type: 'accountAndcenter/fetch',
    });
  }

  onTabChange = (key: string) => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'editProfile') {
      return <Profile />;
    }
    if (tabKey === 'changePassword') {
      return <Projects />;
    }

    return null;
  };

  renderUserInfo = (currentUser: Partial<IInfoSV.Data | IInfoGV.Data>) => {
    const role = localStorage.getItem('vaiTro');
    let roleText = 'Chưa xác định';
    if (role === 'giang_vien') roleText = 'Giảng viên';
    else if (role === 'can_bo') roleText = 'Cán bộ';
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
          <ClusterOutlined
            style={{
              marginRight: 8,
            }}
          />
          {currentUser?.email_dang_nhap ?? ''}
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
                    <img alt="" src={currentUser?.avatar_path || avatar} />
                    <div className={styles.name}>{currentUser?.TenDayDu || 'Chưa cập nhật'}</div>
                    <div>
                      {currentUser?.email || currentUser?.email_dang_nhap || 'Chưa cập nhật'}
                    </div>
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
