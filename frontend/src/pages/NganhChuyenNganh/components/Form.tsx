/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormNganhChuyenNganh = () => {
  const [form] = Form.useForm();
  const {
    loading,
    setVisibleForm,
    postNganhChuyenNganhModel,
    edit,
    record,
    putNganhChuyenNganhModel,
  } = useModel('nganhchuyennganh');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ngành/chuyên ngành`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putNganhChuyenNganhModel(record?._id ?? '', values);
          } else {
            postNganhChuyenNganhModel(values);
          }
        }}
        form={form}
      >
        <Form.Item
          rules={[...rules.required]}
          initialValue={record?.ten}
          name="ten"
          label="Tên ngành/chuyên ngành"
        >
          <Input placeholder="Tên ngành/chuyên ngành" />
        </Form.Item>

        <Form.Item
          rules={[...rules.required]}
          initialValue={record?.ma}
          name="ma"
          label="Mã ngành/chuyên ngành"
        >
          <Input placeholder="Mã ngành/chuyên ngành" />
        </Form.Item>
        <Form.Item initialValue={record?.kyHieu} name="kyHieu" label="Ký hiệu ngành/chuyên ngành">
          <Input placeholder="Ký hiệu ngành/chuyên ngành" />
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

export default FormNganhChuyenNganh;
