/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormCoSoDaoTao = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postCoSoDaoTaoModel, edit, record, putCoSoDaoTaoModel } =
    useModel('cosodaotao');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} cơ sở đào tạo`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putCoSoDaoTaoModel(record?._id ?? '', values);
          } else {
            postCoSoDaoTaoModel(values);
          }
        }}
        form={form}
      >
        <Form.Item
          name="ten"
          label="Tên cơ sở"
          initialValue={record?.ten}
          rules={[...rules.required]}
        >
          <Input placeholder="Tên cơ sở" />
        </Form.Item>
        <Form.Item
          name="tenVietTat"
          label="Tên viết tắt"
          initialValue={record?.tenVietTat}
          rules={[...rules.required]}
        >
          <Input placeholder="Tên viết tắt" />
        </Form.Item>
        <Form.Item name="kyHieu" label="Ký hiệu" initialValue={record?.kyHieu}>
          <Input placeholder="Ký hiệu" />
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

export default FormCoSoDaoTao;
