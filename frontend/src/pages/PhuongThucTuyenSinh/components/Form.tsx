/* eslint-disable no-param-reassign */
import { ELoaiPhuongThucTuyenSinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormPhuongThucTuyenSinh = () => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, postPhuongThucTuyenSinhModel, edit } =
    useModel('phuongthuctuyensinh');
  const { danhSach } = useModel('hinhthucdaotao');
  return (
    <Card loading={loading} title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} phương thức tuyển sinh`}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          postPhuongThucTuyenSinhModel(values);
        }}
        form={form}
      >
        <Form.Item name="hinhThucDaoTao" label="Hình thức đào tạo" rules={[...rules.required]}>
          <Select
            placeholder="Hình thức đào tạo"
            options={danhSach?.map((item) => ({ value: item._id, label: item.ten }))}
          />
        </Form.Item>
        <Form.Item rules={[...rules.required]} name="maPhuongThuc" label="Mã phương thức">
          <Input placeholder="Mã phương thức" />
        </Form.Item>
        <Form.Item rules={[...rules.required]} name="tenPhuongThuc" label="Tên phương thức">
          <Input placeholder="Tên phương thức" />
        </Form.Item>
        <Form.Item rules={[...rules.required]} name="loaiPhuongThuc" label="Loại phương thức">
          <Select
            placeholder="Loại phương thức"
            options={Object.keys(ELoaiPhuongThucTuyenSinh)?.map((item) => ({
              value: ELoaiPhuongThucTuyenSinh[item],
              label: ELoaiPhuongThucTuyenSinh[item],
            }))}
          />
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

export default FormPhuongThucTuyenSinh;
