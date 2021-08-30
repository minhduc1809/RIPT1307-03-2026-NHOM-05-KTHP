/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormPhanHoi = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, traLoiPhanHoiModel } = useModel('phanhoi');
  return (
    <Card loading={loading} title="Trả lời phản hồi">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: PhanHoi.Record) => {
          // eslint-disable-next-line no-underscore-dangle
          traLoiPhanHoiModel({ id: record._id, data: { noiDungTraLoi: values.noiDungTraLoi } });
        }}
        form={form}
      >
        <p>Nội dung phản hồi: {record.noiDungPhanHoi}</p>
        {record.daTraLoi ? (
          <p>Nội dung trả lời: {record.noiDungTraLoi}</p>
        ) : (
          <Form.Item
            name="noiDungTraLoi"
            label="Nội dung trả lời"
            initialValue={record?.noiDungTraLoi}
            rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung" />
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!record.daTraLoi && (
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Gửi
            </Button>
          )}
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormPhanHoi;
