import { Setting } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Form, Input } from 'antd';
import { useState, useEffect } from 'react';
import styles from '../Login/index.less';

const Register = (props: { back: any }) => {
  const [form] = Form.useForm();
  const [thongTinUser, setThongTinUser] = useState<any>({});

  useEffect(() => {
    form.setFieldsValue({
      email: undefined,
      password: undefined,
    });
  }, []);

  return (
    <div className={styles.main}>
      <Form
        onFinish={(values) => {
          setThongTinUser(values);
        }}
        labelCol={{ span: 24 }}
        form={form}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: 36,
            color: Setting.primaryColor,
          }}
        >
          Đăng ký tài khoản
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              color: Setting.primaryColor,
              fontSize: 18,
            }}
          >
            Thông tin đăng ký
          </span>
          <div style={{ height: 2, width: 150, backgroundColor: Setting.primaryColor }} />
        </div>

        <Form.Item
          style={{ marginBottom: 8 }}
          name="email"
          label="Email"
          rules={[...rules.required, ...rules.email]}
          initialValue={thongTinUser?.email}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="confirmEmail"
          label="Nhập lại email"
          rules={[
            ...rules.required,
            ...rules.email,
            {
              validator: (rule, value, callback) => {
                if (value && value !== form.getFieldValue('email')) {
                  callback('Email không trùng khớp');
                } else {
                  callback();
                }
              },
            },
          ]}
          initialValue={thongTinUser?.confirmEmail}
        >
          <Input placeholder="Nhập lại email" />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          name="password"
          label="Mật khẩu"
          rules={[...rules.required, ...rules.password]}
          initialValue={thongTinUser?.password}
        >
          <Input type="password" placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          name="confirm"
          label="Nhập lại mật khẩu"
          rules={[
            ...rules.password,
            {
              required: true,
              message: 'Bắt buộc',
            },
            {
              validator: (rule, value, callback) => {
                if (value && value !== form.getFieldValue('password')) {
                  callback('Mật khẩu không trùng khớp');
                } else {
                  callback();
                }
              },
            },
          ]}
          initialValue={thongTinUser?.confirm}
        >
          <Input type="password" placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          name="hoTen"
          label="Họ và tên (theo giấy khai sinh)"
          rules={[...rules.required, ...rules.ten]}
          initialValue={thongTinUser?.hoTen}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
          <Button
            type="link"
            onClick={() => {
              props.back();
            }}
          >
            Đã có tài khoản?
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
