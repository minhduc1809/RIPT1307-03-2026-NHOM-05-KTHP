/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';
import { useModel } from 'umi';

const FormBaiHoc = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, edit, danhSachLoaiChuDe, putChuDeModel, addChuDeModel } =
    useModel('chude');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: ChuDe.Record) => {
          // eslint-disable-next-line no-underscore-dangle
          if (edit) putChuDeModel({ id: record._id, data: values });
          else addChuDeModel(values);
        }}
        form={form}
      >
        {!edit && (
          <Form.Item
            name="_id"
            label="Mã chủ đề"
            // eslint-disable-next-line no-underscore-dangle
            initialValue={record?._id}
            rules={[...rules.required, ...rules.text, ...rules.length(30)]}
          >
            <Input placeholder="Mã chủ đề" />
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label="Tên chủ đề"
          rules={[...rules.required, ...rules.text, ...rules.length(30)]}
          initialValue={record?.name}
        >
          <Input placeholder="Tên chủ đề" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại chủ đề"
          rules={[...rules.required]}
          initialValue={record?.type}
        >
          <Select placeholder="Chọn loại chủ đề">
            {danhSachLoaiChuDe.map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="order"
          label="Thứ tự hiển thị"
          rules={[...rules.required]}
          initialValue={record?.order ?? 0}
        >
          <InputNumber min={0} max={1000} placeholder="Thứ tự hiển thị" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
