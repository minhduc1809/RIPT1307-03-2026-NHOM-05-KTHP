/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormUser = () => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, record, adminPutProfileUserModel } = useModel('user');
  return (
    <Card loading={loading} title={`${record?.name ?? ''} - Chỉnh sửa thông tin`}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          adminPutProfileUserModel({
            partner_id: record?.partner_id?.[0],
            ...values,
            ngay_sinh: values?.ngay_sinh?.format('YYYY-MM-DD'),
          });
        }}
        form={form}
      >
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12}>
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
          </Col>
          <Col xs={24} md={12}>
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
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormUser;
