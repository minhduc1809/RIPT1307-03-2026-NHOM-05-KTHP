import Footer from '@/components/Footer';
import { adminlogin, getInfo, getInfoAdmin, login } from '@/services/ant-design-pro/api';
import data from '@/utils/data';
import { getPhanNhom } from '@/utils/utils';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { ConfigProvider, message, Tabs } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import React, { useState } from 'react';
import { FormattedMessage, history, Link, useIntl, useModel } from 'umi';
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
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const handleRole = async (role: { accessToken: string; user: Login.Profile }) => {
    const defaultloginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: 'success',
    });
    localStorage.setItem('token', role?.accessToken);
    localStorage.setItem('vaiTro', role?.user?.vai_tro);
    const info = await getInfo();
    const phanNhom = await getPhanNhom();
    setInitialState({
      ...initialState,
      currentUser: info?.data?.data ?? {},
      phanNhom,
    });
    message.success(defaultloginSuccessMessage);
    history.push(data?.path?.[role?.user?.vai_tro] ?? '/');
  };

  const handleSubmit = async (values: { login: string; password: string }) => {
    setSubmitting(true);
    try {
      if (type === 'account') {
        const msg = await login({ ...values });
        if (msg.status === 201) {
          handleRole(msg?.data?.data);
        }
      } else {
        const msg = await adminlogin({ ...values, username: values?.login ?? '' });
        if (msg.status === 201 && msg?.data?.data?.accessToken) {
          const defaultloginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'success',
          });
          localStorage.setItem('token', msg?.data?.data?.accessToken);
          localStorage.setItem('vaiTro', msg?.data?.data.user.systemRole);
          const info = await getInfoAdmin();
          setInitialState({
            ...initialState,
            currentUser: info?.data?.data,
          });
          message.success(defaultloginSuccessMessage);
          history.push(data?.path?.[msg?.data?.data?.user?.systemRole] ?? '/');
          return;
        }
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
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.png" />
              <span className={styles.title}>
                HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG - HỆ ĐẠI HỌC TỪ XA
              </span>
            </Link>
          </div>
        </div>
        <ConfigProvider locale={viVN}>
          <div className={styles.main}>
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
                render: (_, dom) => dom.pop(), // ko hỉu
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              onFinish={async (values) => {
                handleSubmit(values as { login: string; password: string });
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
                <Tabs.TabPane
                  key="accountAdmin"
                  tab={intl.formatMessage({
                    id: 'pages.login.accountLoginAdmin.tab',
                    defaultMessage: 'tab',
                  })}
                />
              </Tabs>

              {(type === 'account' || type === 'accountAdmin') && (
                <>
                  <ProFormText
                    name="login"
                    fieldProps={{
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
          </div>
        </ConfigProvider>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

export { goto };
