import Footer from '@/components/Footer';
import { getInfo, login } from '@/services/ant-design-pro/api';
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
  // const [visibleRole, setVisibleRole] = useState<boolean>(false);
  // const [arrRole, setArrRole] = useState<{ vai_tro: string; token: string }[]>([]);

  const intl = useIntl();

  const handleRole = async (role: { token: string; vai_tro: string }) => {
    const defaultloginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: 'success',
    });
    localStorage.setItem('token', role?.token);
    localStorage.setItem('vaiTro', role?.vai_tro);
    const info = await getInfo();
    const phanNhom = await getPhanNhom();
    setInitialState({
      ...initialState,
      currentUser: info?.data?.data ?? {},
      phanNhom,
    });
    message.success(defaultloginSuccessMessage);
    history.push(data?.path?.[role?.vai_tro] ?? '/');
  };

  const handleSubmit = async (values: { login: string; password: string }) => {
    setSubmitting(true);
    try {
      const msg = await login({ ...values });
      if (msg.status === 201 && msg?.data?.data?.accessTokens?.length > 0) {
        // if (msg?.data?.data?.accessTokens?.length === 1) {
        handleRole(msg?.data?.data?.accessTokens?.[0]);
        localStorage.setItem('accessTokens', JSON.stringify(msg?.data?.data?.accessTokens ?? []));
        // } else {
        //   localStorage.setItem('accessTokens', JSON.stringify(msg?.data?.data?.accessTokens ?? []));
        //   setVisibleRole(true);
        //   setArrRole(msg?.data?.data?.accessTokens ?? []);
        // }
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
      {/* <SelectRole /> */}
      {/* <div className={styles.lang}>{SelectLang && <SelectLang />}</div> */}
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src="/logo.png" />
                <span className={styles.title}>Sổ tay APD</span>
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
                </Tabs>

                {type === 'account' && (
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
            {/* <Modal
            footer={
              <Button
                type="primary"
                onClick={() => {
                  setVisibleRole(false);
                  localStorage.removeItem('token');
                  localStorage.removeItem('vaiTro');
                  localStorage.removeItem('accessTokens');
                }}
              >
                Hủy
              </Button>
            }
            width="400px"
            onCancel={() => {
              setVisibleRole(false);
              localStorage.removeItem('token');
              localStorage.removeItem('vaiTro');
              localStorage.removeItem('accessTokens');
            }}
            visible={visibleRole}
            title="Chọn vai trò"
          >
            <SelectRoles roles={arrRole} type="login" />
          </Modal> */}
          </ConfigProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

export { goto };
