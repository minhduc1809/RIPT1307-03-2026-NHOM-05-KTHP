/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Button, Card, Form, Select } from 'antd';
import { useModel } from 'umi';

const FormUserQLDT = () => {
  const [form] = Form.useForm();
  const { loading, recordUser, setVisibleForm, putUserPhanNhomModel, danhSachNhomVaiTro, vaiTro } =
    useModel('phanquyen');

  return (
    <Card title={'Chỉnh sửa nhóm vai trò'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          putUserPhanNhomModel({
            userId: recordUser?.user?.id?.toString() || '',
            danhSachNhomVaiTroId: values?.danhSachNhomVaiTroId ?? [],
            vaiTro,
          });
        }}
        form={form}
      >
        <Form.Item
          label="Nhóm vai trò"
          name="danhSachNhomVaiTroId"
          // rules={[...rules.required]}
          initialValue={recordUser?.phanNhom?.danhSachNhomVaiTroId}
        >
          <Select mode="multiple" showSearch placeholder="Nhóm vai trò">
            {danhSachNhomVaiTro.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item._id}
              </Select.Option>
            ))}
          </Select>
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

export default FormUserQLDT;
