/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import mm from 'moment-timezone';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormToChucCanBo = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm } = useModel('tochuccanbo');
  return (
    <Card loading={loading} title="Trả lời phản hồi">
      <Form labelCol={{ span: 24 }} onFinish={async (values) => {}} form={form}>
        <Form.Item
          name="name"
          label="Họ và tên"
          initialValue={record?.name}
          rules={[...rules.required, ...rules.ten]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>

        <Row gutter={[16, 0]}>
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
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button>Lưu</Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormToChucCanBo;
