import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const NumericRange = (props: { index: number }) => {
  return (
    <Row>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[props.index, 'gioiHanDuoiTuyenTinh']}
          rules={[...rules.required]}
          style={{ marginBottom: 0 }}
          label="Từ"
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          label="đến"
          rules={[...rules.required]}
          name={[props.index, 'gioiHanTrenTuyenTinh']}
          style={{ marginBottom: 0 }}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default NumericRange;
