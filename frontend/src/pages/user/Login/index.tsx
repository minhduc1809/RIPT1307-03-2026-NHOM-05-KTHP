import Footer from '@/components/Footer';
import LoginWithKeycloak from '@/pages/user/Login/KeycloakLogin';
import { adminlogin, getInfo } from '@/services/ant-design-pro/api';
import data from '@/utils/data';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tabs, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import OneSignal from 'react-onesignal';
import Recaptcha from 'react-recaptcha';
import { history, useIntl, useModel } from 'umi';
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
  const [count, setCount] = useState<number>(Number(localStorage?.getItem('failed')) || 0);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isVerified, setIsverified] = useState<boolean>(true);
  const [visibleCaptcha, setVisibleCaptcha] = useState<boolean>(false);
  const [visibleCaptcha2, setVisibleCaptcha2] = useState<boolean>(false);
  const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();
  const recaptchaRef = useRef(null);
  const intl = useIntl();
  const [form] = Form.useForm();

  const getUserIdOnesignal = async () => {
    const id = await OneSignal.getUserId();
    setOneSignalId(id);
  };

  useEffect(() => {
    getUserIdOnesignal();
  }, []);

  /**
   * Xử lý token, get info sau khi đăng nhập
   */
  const handleRole = async (
    role: {
      accessToken: string;
      refreshToken: string;
      idToken: string;
    },
    vaiTro?: string,
  ) => {
    const defaultloginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: 'success',
    });
    localStorage.setItem('token', role?.accessToken);
    localStorage.setItem('refreshToken', role?.refreshToken);
    localStorage.setItem('id_token', role?.idToken);
    localStorage.setItem('vaiTro', vaiTro ?? 'guest');

    const info = await getInfo();
    setInitialState({
      ...initialState,
      currentUser: info?.data?.data ?? {},
    });
    message.success(defaultloginSuccessMessage);
    history.push(data?.path?.[vaiTro ?? 'guest'] ?? '/');
  };

  // Callback after login with KeyCloak
  const handleLoginWithKeycloak = async (
    accessToken: string,
    refreshToken: string,
    idToken: string,
    oneId: string,
  ) => {
    handleRole({ accessToken, refreshToken, idToken });
  };

  const handleSubmit = async (values: { login: string; password: string }) => {
    try {
      if (!isVerified) {
        message.error('Vui lòng xác thực Captcha');
        return;
      }
      setSubmitting(true);
      const msg = await adminlogin({ ...values, username: values?.login ?? '' });
      if (msg.status === 200 && msg?.data?.data?.accessToken) {
        handleRole(msg?.data?.data, 'Admin');
        localStorage.removeItem('failed');
      }
    } catch (error) {
      if (count >= 4) {
        setIsverified(false);
        setVisibleCaptcha(!visibleCaptcha);
        setVisibleCaptcha2(true);
      }
      setCount(count + 1);
      localStorage.setItem('failed', (count + 1).toString());
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'failure',
      });
      message.error(defaultloginFailureMessage);
    }
    setSubmitting(false);
  };

  const verifyCallback = (response: any) => {
    if (response) setIsverified(true);
    else setIsverified(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img alt="logo" className={styles.logo} src="/logo-full-white.svg" />
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: 'tab',
              })}
            />
            <Tabs.TabPane
              key="accountAdmin"
              tab={intl.formatMessage({
                id: 'pages.login.accountLoginAdmin.tab',
                defaultMessage: 'tab',
              })}
            />
          </Tabs>

          {type === 'account' ? (
            <LoginWithKeycloak
              title="Đăng nhập với SSO"
              oneSignalId={oneSignalId}
              onLoginSuccess={handleLoginWithKeycloak}
            />
          ) : type === 'accountAdmin' ? (
            <Form
              form={form}
              onFinish={async (values) =>
                handleSubmit(values as { login: string; password: string })
              }
              layout="vertical"
            >
              <Form.Item label="" name="login" rules={[...rules.required]}>
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: 'Nhập tên đăng nhập',
                  })}
                  prefix={<UserOutlined className={styles.prefixIcon} />}
                  size="large"
                />
              </Form.Item>
              <Form.Item label="" name="password" rules={[...rules.required]}>
                <Input.Password
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: 'Nhập mật khẩu',
                  })}
                  prefix={<LockOutlined className={styles.prefixIcon} />}
                  size="large"
                />
              </Form.Item>

              <Button type="primary" block size="large" loading={submitting}>
                {intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: 'submit',
                })}
              </Button>
            </Form>
          ) : null}

          <br />
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => {
                window.open(
                  'https://slinkid.ptit.edu.vn/auth/realms/master/login-actions/reset-credentials',
                );
              }}
              type="link"
            >
              Quên mật khẩu?
            </Button>
            {type === 'accountAdmin' && visibleCaptcha && count >= 5 && (
              <Recaptcha
                ref={recaptchaRef}
                size="normal"
                sitekey="6LelHsEeAAAAAJmsVdeC2EPNCAVEtfRBUGSKireh"
                render="explicit"
                hl="vi"
                // onloadCallback={callback}
                verifyCallback={verifyCallback}
              />
            )}
            {type === 'accountAdmin' && !visibleCaptcha && visibleCaptcha2 && count >= 5 && (
              <Recaptcha
                ref={recaptchaRef}
                size="normal"
                sitekey="6LelHsEeAAAAAJmsVdeC2EPNCAVEtfRBUGSKireh"
                render="explicit"
                hl="vi"
                // onloadCallback={callback}
                verifyCallback={verifyCallback}
              />
            )}
          </div>
        </div>
      </div>

      <div className="login-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Login;

export { goto };
