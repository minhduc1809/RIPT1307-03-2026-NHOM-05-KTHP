import avatar from '@/assets/admin.png';
import { ClusterOutlined, ContactsOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, { Component, useRef, useState } from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { Dispatch } from 'umi';
import { connect, Link } from 'umi';
import styles from './Center.less';
import Profile from './components/Profile';
import Projects from './components/Projects';
import type { CurrentUser, TagType } from './data.d';
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
  currentUser: Partial<CurrentUser>;
  currentUserLoading: boolean;
}
interface CenterState {
  tabKey?: 'editProfile' | 'changePassword';
}

const TagList: React.FC<{ tags: CurrentUser['tags'] }> = ({ tags }) => {
  const ref = useRef<Input | null>(null);
  const [newTags, setNewTags] = useState<TagType[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];
    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: inputValue }];
    }
    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>Tag</div>
      {(tags || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

class Center extends Component<CenterProps, CenterState> {
  // static getDerivedStateFromProps(
  //   props: accountAndcenterProps,
  //   state: accountAndcenterState,
  // ) {
  //   const { match, location } = props;
  //   const { tabKey } = state;
  //   const path = match && match.path;

  //   const urlTabKey = location.pathname.replace(`${path}/`, '');
  //   if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
  //     return {
  //       tabKey: urlTabKey,
  //     };
  //   }

  //   return null;
  // }

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

  renderUserInfo = (currentUser: Partial<CurrentUser>) => (
    <div className={styles.detail}>
      <p>
        <ContactsOutlined
          style={{
            marginRight: 8,
          }}
        />
        {localStorage.getItem('vaiTro') === 'sinh_vien' ? 'Sinh viên' : 'Chưa xác định'}
      </p>
      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser?.email}
      </p>
      <p>
        <HomeOutlined
          style={{
            marginRight: 8,
          }}
        />
        {(currentUser.geographic || { province: { label: '' } }).province.label}
        {
          (
            currentUser.geographic || {
              city: {
                label: 'Chưa xác định',
              },
            }
          ).city.label
        }
      </p>
    </div>
  );

  render() {
    const { tabKey } = this.state;
    const { currentUser } = this.props;
    // console.log('this.props :>> ', this.props);
    const dataLoading = false;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser?.avatar || avatar} />
                    <div className={styles.name}>{currentUser?.name || 'Chưa cập nhật'}</div>
                    <div>{currentUser?.email?.[1] || 'Chưa cập nhật'}</div>
                  </div>
                  {this.renderUserInfo(currentUser)}
                  <Divider dashed />
                  <TagList tags={currentUser.tags || []} />
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>Tag</div>
                    <Row gutter={36}>
                      {currentUser.notice &&
                        currentUser.notice.map((item) => (
                          <Col key={item.id} lg={24} xl={12}>
                            <Link to={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </Link>
                          </Col>
                        ))}
                    </Row>
                  </div>
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
