import TinyEditor from '@/components/TinyEditor/Tiny';
import rules from '@/utils/rules';
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';

const FormBaiVietChung = () => {
  const [form] = Form.useForm();
  const { loading, record, putSettingModel, setVisibleForm } = useModel('setting');
  return (
    <Card title={'Chỉnh sửa'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          putSettingModel({
            key: record?.key ?? '',
            data: { ...record, value: values?.value?.text ?? '' },
          });
        }}
        form={form}
      >
        <Form.Item
          name="value"
          label="Nội dung bài viết"
          initialValue={{ text: record?.value || '' }}
          rules={[...rules.textEditor]}
        >
          <TinyEditor height={750} />
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

export default FormBaiVietChung;
