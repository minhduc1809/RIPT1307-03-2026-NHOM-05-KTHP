import { forgetPassword } from '@/services/ant-design-pro/api';
import rules from '@/utils/rules';
import { Button, Form, Input, message } from 'antd';

const FormForgetPassword = (props: { onCancel: any }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={async (values) => {
        try {
          const response = await forgetPassword(values);
          if (response?.data?.data?.success) {
            message.success('Đã gửi mật khẩu tạm thời, vui lòng kiểm tra hòm thư điện tử của bạn');
            props?.onCancel();
          }
        } catch (err) {}
      }}
    >
      <Form.Item
        label="Vui lòng nhập email đã dùng để đăng ký tài khoản"
        name="email"
        rules={[...rules.email]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>
      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
          Gửi
        </Button>

        <Button onClick={() => props?.onCancel()}>Đóng</Button>
      </Form.Item>
    </Form>
  );
};

export default FormForgetPassword;
