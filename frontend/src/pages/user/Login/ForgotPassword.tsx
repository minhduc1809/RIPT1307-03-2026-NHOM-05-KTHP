/* eslint-disable no-param-reassign */
import { forgotPassword } from '@/services/ant-design-pro/api';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, message } from 'antd';

const FormForgotPassword = (props: { onCancel: any }) => {
  const [form] = Form.useForm();

  return (
    <Card title="Quên mật khẩu">
      <Form
        onFinish={async (values) => {
          try {
            await forgotPassword(values);
            message.success(
              'Vui lòng kiểm tra hòm thư điện tử để nhận được hướng dẫn tạo mật khẩu mới',
            );
            props.onCancel();
          } catch (err) {
            message.error('Email không tồn tại trong hệ thống');
          }
        }}
        form={form}
      >
        <Form.Item name="email" label="Email" rules={[...rules.email]}>
          <Input
            style={{ width: '100%' }}
            min={0}
            max={1000}
            placeholder="Nhập địa chỉ email để nhận hướng dẫn tạo mật khẩu mới"
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>
          <Button onClick={() => props.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormForgotPassword;
