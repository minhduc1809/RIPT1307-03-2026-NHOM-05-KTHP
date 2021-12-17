/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormToChucCanBo = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, edit, postCanBoModel, putCanBoModel } =
    useModel('tochuccanbo');
  const { danhSach } = useModel('donvi');
  return (
    <Card loading={loading} title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.ngay_sinh = values.ngay_sinh.format('YYYY-MM-DD');
          if (edit) putCanBoModel(record.id, values);
          else postCanBoModel(values);
        }}
        form={form}
      >
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
          <Col xs={24}>
            <Form.Item
              initialValue={record?.don_vi_goc}
              name="don_vi_goc"
              label="Đơn vị"
              rules={[...rules.required]}
            >
              <Select
                filterOption={(value, option) => includes(option?.props.children, value)}
                showSearch
                placeholder="Chọn đơn vị"
              >
                {danhSach?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.ten_don_vi} ({item.display_name})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="chuc_danh"
              label="Chức danh"
              initialValue={record?.chuc_danh || undefined}
            >
              <Input placeholder="Chức danh" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="email_to_chuc"
              label="Email"
              initialValue={record?.email_to_chuc}
              // rules={[...rules.email]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Lưu
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormToChucCanBo;
