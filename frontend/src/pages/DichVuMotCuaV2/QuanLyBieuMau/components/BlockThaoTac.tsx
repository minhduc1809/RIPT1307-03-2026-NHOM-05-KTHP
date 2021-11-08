import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row, Select } from 'antd';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BieuMauThaoTac = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
}) => {
  const { danhSach } = useModel('donvi');

  return (
    <Row gutter={[20, 0]}>
      <Col xs={24} lg={12}>
        <Form.Item
          labelCol={{ span: 24 }}
          name={[props.field.name, 'idDonVi']}
          label="Đơn vị"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn đơn vị">
            {danhSach?.map((item) => (
              <Select.Option value={item.id.toString()}>{item.ten_don_vi}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          labelCol={{ span: 24 }}
          name={[props.field.name, 'soNgayXuLy']}
          label="Số ngày xử lý"
          rules={[...rules.required]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Số ngày xử lý" min={0} max={300} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BieuMauThaoTac;
