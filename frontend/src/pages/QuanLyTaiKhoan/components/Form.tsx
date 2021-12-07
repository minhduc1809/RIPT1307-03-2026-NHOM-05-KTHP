/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormUser = () => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, record, adminPutProfileUserModel } = useModel('user');
  return (
    <Card loading={loading} title="Chỉnh sửa thông tin">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          adminPutProfileUserModel({ user_id: record?.id, ...values });
        }}
        form={form}
      >
        <Form.Item
          name="ngay_sinh"
          label="Ngày sinh"
          rules={[...rules.required]}
          initialValue={record?.ngay_sinh ? moment(record?.ngay_sinh) : undefined}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={(cur) => moment(cur).isAfter(moment())}
            placeholder="Ngày sinh"
          />
        </Form.Item>
        <Form.Item
          initialValue={record?.gioi_tinh || undefined}
          name="gioi_tinh"
          label="Giới tính"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="0">Nam</Select.Option>
            <Select.Option value="1">Nữ</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormUser;
