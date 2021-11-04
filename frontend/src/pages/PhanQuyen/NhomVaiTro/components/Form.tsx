/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Role } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormNhomVaiTro = () => {
  const [form] = Form.useForm();

  const { loading, recordNhomVaiTro, setVisibleForm, edit, postNhomVaiTroModel } =
    useModel('phanquyen');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          postNhomVaiTroModel(values);
        }}
        form={form}
      >
        <Form.Item
          name="_id"
          label="Tên nhóm"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={recordNhomVaiTro?._id}
        >
          <Input placeholder="Tên nhóm" />
        </Form.Item>

        <Form.Item
          rules={[...rules.required]}
          name="vaiTro"
          label="Vai trò hệ thống"
          initialValue={'can_bo'}
        >
          <Select disabled placeholder="Chọn đối tượng">
            {['can_bo'].map((item) => (
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
