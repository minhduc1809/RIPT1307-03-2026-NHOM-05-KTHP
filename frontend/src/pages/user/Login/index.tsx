import Footer from '@/components/Footer';
import { getInfoGV, getInfoSV, login } from '@/services/ant-design-pro/api';
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
  // const [userLoginState, setUserLoginState] = useState<IRecordLogin.RootObject>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      const msg = await login({ ...values });
      if (msg.status === 201 && msg?.data?.data?.accessToken) {
        const defaultloginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'success',
        });

        // set các quyền mà user có thể truy cập vào redux và bật modal chọn lên
        // console.log(`msg.data.authorizedRoles`, msg.data.authorizedRoles);
        // setInitialState({
        //   ...initialState,
        // });
        localStorage.setItem('token', msg?.data?.data?.accessToken);

        localStorage.setItem('vaiTro', msg?.data?.data?.user.vai_tro);
        let info;

        if (msg?.data?.data.user.vai_tro === 'giang_vien') {
          info = await getInfoGV();
        } else if (msg?.data?.data.user.vai_tro === 'sinh_vien') {
          info = await getInfoSV();
          console.log(`info`, info);
        }

        setInitialState({
          ...initialState,
          currentUser: info?.data,
        });

        message.success(defaultloginSuccessMessage);
        history.push('/');

        return;
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
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.png" />
              <span className={styles.title}>Hệ Thống Đào Tạo Trực Tuyến Từ Xa</span>
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
                handleSubmit(values as API.LoginParams);
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
        </ConfigProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

export { goto };
