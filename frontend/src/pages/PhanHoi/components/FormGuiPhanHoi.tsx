/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormGuiPhanHoi = () => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, userPostPhanHoiModel } = useModel('phanhoi');
  return (
    <Card loading={loading} title="Gửi phản hồi">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: PhanHoi.Record) => {
          userPostPhanHoiModel(values);
        }}
        form={form}
      >
        <Form.Item
          name="noiDungPhanHoi"
          label="Nội dung"
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung" />
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

export default FormGuiPhanHoi;
