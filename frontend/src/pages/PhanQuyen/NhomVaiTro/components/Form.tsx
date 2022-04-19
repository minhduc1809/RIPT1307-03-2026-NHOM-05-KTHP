/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Role } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormNhomVaiTro = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, edit, postNhomVaiTroModel, putNhomVaiTroModel } =
    useModel('phanquyen');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) putNhomVaiTroModel({ _id: record?._id, data: values });
          else postNhomVaiTroModel(values);
        }}
        form={form}
      >
        <Form.Item
          name="_id"
          label="Tên nhóm vai trò"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={record?._id}
        >
          <Input disabled={edit} placeholder="Tên nhóm vai trò" />
        </Form.Item>

        <Form.Item
          rules={[...rules.required]}
          name="vaiTro"
          label="Vai trò hệ thống"
          initialValue={record?.vaiTro ?? []}
        >
          <Select mode="multiple" placeholder="Chọn đối tượng">
            {['nhan_vien', 'Admin', 'quan_tri'].map((item) => (
              <Select.Option key={item} value={item}>
                {Role?.[item] ?? ''}
              </Select.Option>
            ))}
          </Select>
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

export default FormNhomVaiTro;
