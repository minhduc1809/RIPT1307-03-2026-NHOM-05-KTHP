import rules from '@/utils/rules';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import { useModel } from 'umi';

const BieuMauThaoTac = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
}) => {
  const { danhSach } = useModel('donvi');

  return (
    <Row gutter={[20, 0]}>
      <Col xs={24} lg={12}>
        <Form.Item
          labelCol={{ span: 24 }}
          name={[props.field.name, 'hanXuLy']}
          label="Hạn xử lý"
          rules={[...rules.required]}
        >
          <DatePicker showTime style={{ width: '100%' }} format="HH:mm DD/MM/YYYY" />
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          labelCol={{ span: 24 }}
          name={[props.field.name, 'idDonVi']}
          label="Đơn vị"
          rules={[...rules.required]}
        >
          <Select placeholder="Chọn đơn vị">
            {danhSach?.map((item) => (
              <Select.Option value={item.id}>{item.ten_don_vi}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BieuMauThaoTac;
