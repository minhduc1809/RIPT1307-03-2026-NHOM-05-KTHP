/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormCapLaiMatKhau = (props: { onCancel: any }) => {
  const [form] = Form.useForm();

  const { loading, record, adminChangePasswordModel } = useModel('quanlytaikhoan');
  return (
    <Card loading={loading} title="Cấp lại mật khẩu">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          adminChangePasswordModel({ user_id: record?._id, ...values });
        }}
        form={form}
      >
        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[...rules.required, ...rules.password]}
        >
          <Input placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>

          <Button onClick={() => props?.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormCapLaiMatKhau;
