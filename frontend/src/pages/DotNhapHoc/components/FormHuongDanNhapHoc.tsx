import { useModel } from 'umi';
import { ArrowLeftOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form } from 'antd';

const FormHuongDanNhapHoc = () => {
  const [form] = Form.useForm();

  const { edit, setRecord, setCurrent, record, putModel, postModel } = useModel('dotnhaphoc');

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        form={form}
        onFinish={(values) => {
          if (edit) {
            putModel(record?._id ?? '', { ...record, ...values });
          } else {
            postModel({ ...record, ...values });
          }
        }}
      >
        <Form.Item
          style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
        >
          <Button
            style={{ marginRight: 8 }}
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              const valueView = form.getFieldsValue(true);
              setRecord({ ...record, ...valueView });
              setCurrent(0);
            }}
          >
            Quay lại
          </Button>
          <Button
            icon={edit ? <SaveOutlined /> : <PlusOutlined />}
            //loading={loading}
            loading={false}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormHuongDanNhapHoc;
