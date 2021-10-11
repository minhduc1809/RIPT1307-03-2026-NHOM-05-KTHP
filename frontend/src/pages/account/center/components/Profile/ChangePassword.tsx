import { changePassword } from '@/services/ant-design-pro/api';
import data from '@/utils/data';
import rules from '@/utils/rules';
import { Button, Form, Input, message } from 'antd';

const ChangePassword = () => {
  const [form] = Form.useForm();

  return (
    <div style={{ textAlign: 'center' }}>
      <Form
        onFinish={async (values) => {
          if (values.newPassword.trim() !== values.retypePassword.trim()) {
            message.error('Nhập lại mật khẩu mới chưa đúng');
            return;
          }
          try {
            const res = await changePassword(values);
            if (res.status === 201) {
              message.success('Đổi mật khẩu thành công');
            }
            form.resetFields();
          } catch (error: any) {
            const { response } = error;
            message.error(data.error[response?.data?.errorCode]);
          }
        }}
        labelCol={{ span: 24 }}
        style={{ width: '50%', textAlign: 'center' }}
        form={form}
      >
        <Form.Item rules={[...rules.required]} name="oldPassword" label="Mật khẩu cũ">
          <Input placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          rules={[...rules.required, ...rules.password]}
          label="Mật khẩu mới"
        >
          <Input placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="retypePassword"
          rules={[...rules.required, ...rules.password]}
          label="Nhập lại mật khẩu mới"
        >
          <Input placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
