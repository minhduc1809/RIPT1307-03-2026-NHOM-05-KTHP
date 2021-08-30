import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row, Select } from 'antd';

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
          <Select>
            {[0, 1].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
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
          <Select>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default NumericRange;
