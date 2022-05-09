import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useModel } from 'umi';

const FormPrice = () => {
  const [form] = Form.useForm();
  const { setVisibleForm, loading, postModel } = useModel('price');
  return (
    <Card title="Thêm mới">
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={(values) => {
          postModel({
            ...values,
            metaData: {},
          });
        }}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Form.Item rules={[...rules.required]} name="name" label="Tên mức giá">
              <Input placeholder="Tên mức giá" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[...rules.required]} name="unitAmount" label="Mức giá">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100000000}
                placeholder="Mức giá"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[...rules.required]} name="currency" label="Đơn vị">
              <Input placeholder="Đơn vị, vd: VND, USD..." />
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

export default FormPrice;
