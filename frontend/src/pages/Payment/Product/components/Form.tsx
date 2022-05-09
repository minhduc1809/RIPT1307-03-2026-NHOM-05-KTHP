import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormProduct = () => {
  const [form] = Form.useForm();
  const { setVisibleForm, loading, postModel } = useModel('product');
  return (
    <Card title="Thêm mới">
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={(values) => {
          postModel({
            ...values,
            unitLabel: '',
            metaData: {
              ...values.metaData,
              loai: 'Tuyển sinh',
            },
          });
        }}
      >
        <Form.Item rules={[...rules.required]} name="code" label="Mã lệ phí">
          <Input placeholder="Mã lệ phí" />
        </Form.Item>

        <Form.Item rules={[...rules.required]} name="name" label="Tên lệ phí">
          <Input placeholder="Tên lệ phí" />
        </Form.Item>
        <Form.Item name={['metaData', 'hinhThuc']} label="Hình thức">
          <Select
            placeholder="Hình thức"
            options={['Xét tuyển', 'Nhập học'].map((item) => ({ label: item, value: item }))}
          />
        </Form.Item>
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

export default FormProduct;
