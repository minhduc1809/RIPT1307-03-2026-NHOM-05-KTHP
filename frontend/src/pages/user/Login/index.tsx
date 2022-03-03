import logoGoogle from '@/assets/googleicon.png';
import logo from '@/assets/logo.png';
import Footer from '@/components/Footer';
import { getInfo, login } from '@/services/ant-design-pro/api';
import { Setting } from '@/utils/constants';
import data from '@/utils/data';
import {
  FileExcelOutlined,
  FileTextOutlined,
  LockOutlined,
  NotificationOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Button, Col, ConfigProvider, Divider, message, Row, Tabs, Tooltip } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { useMediaQuery } from 'react-responsive';
import { FormattedMessage, history, Link, useIntl, useModel } from 'umi';
import Register from '../register';
import styles from './index.less';

const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 2000);
};

const Login: React.FC = () => {
  const isMediumScreen = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const isNotSmallScreen = useMediaQuery({
    query: '(min-width: 411px)',
  });
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const intl = useIntl();

  const handleRole = async (role: { accessToken: string; user: Login.Profile }) => {
    const defaultloginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: 'success',
    });
    localStorage.setItem('token', role?.accessToken);
    localStorage.setItem('vaiTro', role?.user?.systemRole);
    const info = await getInfo();
    // const phanNhom = await getPhanNhom();
    setInitialState({
      ...initialState,
      currentUser: info?.data?.data ?? {},
      settings: {
        primaryColor: 'daybreak',
        layout: role?.user?.systemRole === 'Admin' ? 'side' : 'top',
      },
      // phanNhom,
    });
    message.success(defaultloginSuccessMessage);
    if (role?.user?.emailVerify?.verified === true || role?.user?.systemRole === 'Admin')
      history.push(data?.path?.[role?.user?.systemRole || 'guest'] ?? '/');
    else history.push('/kichhoattaikhoan');
  };

  const handleSubmit = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    try {
      const msg = await login({ ...values });
      if (msg.status === 201) {
        handleRole(msg?.data?.data);
      }
    } catch (error) {
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'failure',
      });
      message.error(defaultloginFailureMessage);
    }
    setSubmitting(false);
  };

  const responseFacebook = (response: any) => {
    // this.props.dispatch({
    //   type: 'login/loginFacebook',
    //   payload: {
    //     accessToken: response.accessToken,
    //   },
    // });
    console.log('error', response);
  };

  const responseGoogle = (response: any) => {
    // this.props.dispatch({
    //   type: 'login/loginGoogle',
    //   payload: {
    //     accessToken: response.accessToken,
    //   },
    // });
    console.log('error', response);
  };

  const responseGoogleFail = (response: any) => {
    console.log('error', response);
  };

  const responseFacebookFail = (response: any) => {
    console.log('error', response);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isLogin ? (
          <ConfigProvider locale={viVN}>
            <div className={styles.main}>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 30,
                  color: Setting.primaryColor,
                }}
              >
                <img style={{ width: 25, height: 35 }} src={logo} /> HỆ THỐNG
                <div style={{ fontSize: isNotSmallScreen ? 25 : 22 }}>XÉT TUYỂN TRỰC TUYẾN</div>
              </div>
              <ProForm
                initialValues={{
                  autoLogin: true,
                }}
                submitter={{
                  searchConfig: {
                    submitText: intl.formatMessage({
                      id: 'pages.login.submit',
                      defaultMessage: 'submit',
                    }),
                  },

                  render: (_, dom) => {
                    return (
                      <>
                        {dom.pop()}
                        <div style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
                          <Link
                            className={styles.link}
                            style={{ cursor: 'pointer' }}
                            to="/user/quenMatKhau"
                          >
                            <FormattedMessage id="pages.login.forgotPassword" />
                          </Link>
                        </div>
                        <Divider style={{ margin: '13px 0px' }} />
                        <div style={{ textAlign: 'center' }}>
                          <Button
                            type="primary"
                            onClick={() => {
                              setIsLogin(false);
                            }}
                            style={{
                              height: 40,
                              padding: '0px 15px',
                              fontSize: 16,
                              borderRadius: 4,
                              // width: '100%',
                            }}
                          >
                            Đăng ký tài khoản
                          </Button>
                        </div>
                        <br />
                        <Row>
                          <Col style={{ marginTop: 8 }} xs={24} md={24}>
                            <FacebookLogin
                              appId="529724911787253"
                              autoLoad={false}
                              fields="name,email,picture"
                              callback={responseFacebook}
                              cssClass={styles.facebookButton}
                              onFailure={responseFacebookFail}
                              icon="fa fa-facebook fa-fw"
                              textButton="Đăng nhập với facebook"
                              size="small"
                              disableMobileRedirect
                            />
                          </Col>

                          <Col style={{ marginTop: 8 }} xs={24} md={24}>
                            <GoogleLogin
                              clientId="912230541378-6b2qhkl6g93bfc8nukkjq1qg2h9jognf.apps.googleusercontent.com"
                              icon={false}
                              // isSignedIn={true}
                              onSuccess={responseGoogle}
                              onFailure={responseGoogleFail}
                              cookiePolicy="single_host_origin"
                              render={(renderProps) => (
                                <Button
                                  className={styles.googleButton}
                                  onClick={renderProps.onClick}
                                >
                                  <img
                                    style={{
                                      height: '1rem',
                                      margin: '0px 4px 3px -10px',
                                      width: '1rem',
                                    }}
                                    src={logoGoogle}
                                  />
                                  Đăng nhập với Google
                                </Button>
                              )}
                            />
                          </Col>
                        </Row>
                      </>
                    );
                  },

                  submitButtonProps: {
                    loading: submitting,
                    size: 'large',
                    style: {
                      width: '100%',
                      borderRadius: 5,
                    },
                  },
                }}
                onFinish={async (values) => {
                  handleSubmit(values as { username: string; password: string });
                }}
              >
                <Tabs activeKey={type} onChange={setType}>
                  <Tabs.TabPane
                    key="account"
                    tab={intl.formatMessage({
                      id: 'pages.login.accountLogin.tab',
                      defaultMessage: 'tab',
                    })}
                  />
                </Tabs>

                {type === 'account' && (
                  <>
                    <ProFormText
                      name="username"
                      fieldProps={{
                        style: { borderRadius: 5 },
                        size: 'large',
                        prefix: <UserOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.username.placeholder',
                        defaultMessage: 'Nhập tên đăng nhập',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.login.username.required"
                              defaultMessage="required!"
                            />
                          ),
                        },
                        // ...rules.username,
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        style: { borderRadius: 5 },
                        size: 'large',
                        prefix: <LockOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.password.placeholder',
                        defaultMessage: 'placeholder: ant.design',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.login.password.required"
                              defaultMessage="required"
                            />
                          ),
                        },
                        // ...rules.password,
                      ]}
                    />
                  </>
                )}
              </ProForm>
              {isNotSmallScreen ? (
                <div style={{ width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
                  <Footer />
                </div>
              ) : (
                <br />
              )}
            </div>
          </ConfigProvider>
        ) : (
          <Register
            back={() => {
              setIsLogin(true);
            }}
          />
        )}
      </div>
      <div className={styles.image}>
        {isMediumScreen && (
          <div className={styles.containericonhuongdan}>
            <Tooltip title="Đề án tuyển sinh">
              <Button
                onClick={() => window.open('https://tuyensinh.ptit.edu.vn/deantuyensinh')}
                className={styles.iconhuongdan}
                icon={<NotificationOutlined />}
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="Tài liệu HDSD">
              <Button
                onClick={() =>
                  window.open(
                    'https://drive.google.com/drive/folders/1iD7GxppVjBIkT_ZqAFFeDRkgg7s8iTMp',
                  )
                }
                className={styles.iconhuongdan}
                icon={<FileTextOutlined />}
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="Video HDSD">
              <Button
                className={styles.iconhuongdan}
                icon={<VideoCameraOutlined />}
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="Danh mục trường THPT chuyên">
              <Button
                onClick={() =>
                  window.open(
                    'https://docs.google.com/spreadsheets/d/1duPQykk4uM6tqdKy6ZAj59zocxadDBNmrUJAsblPk2M/edit?usp=sharing',
                  )
                }
                className={styles.iconhuongdan}
                icon={<FileExcelOutlined />}
                shape="circle"
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

export { goto };
