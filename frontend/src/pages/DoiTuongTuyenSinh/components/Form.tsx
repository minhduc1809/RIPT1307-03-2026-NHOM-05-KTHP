/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormDoiTuongTuyenSinh = () => {
  const [form] = Form.useForm();
  const {
    loading,
    setVisibleForm,
    postDoiTuongTuyenSinhModel,
    edit,
    record,
    putDoiTuongTuyenSinhModel,
  } = useModel('doituongtuyensinh');
  const { danhSach } = useModel('hinhthucdaotao');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} năm tuyển sinh`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putDoiTuongTuyenSinhModel(record?._id ?? '', values);
          } else {
            postDoiTuongTuyenSinhModel(values);
          }
        }}
        form={form}
      >
        <Form.Item
          initialValue={record?.maDoiTuong}
          name="maDoiTuong"
          label="Mã đối tượng"
          rules={[...rules.required]}
        >
          <Input placeholder="Mã đôi tượng" />
        </Form.Item>

        <Form.Item
          initialValue={record?.tenDoiTuong}
          name="tenDoiTuong"
          label="Tên đối tượng"
          rules={[...rules.required]}
        >
          <Input placeholder="Tên đôi tượng" />
        </Form.Item>

        <Form.Item initialValue={record?.moTa} name="moTa" label="Mô tả">
          <Input.TextArea rows={2} placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          initialValue={record?.hinhThucDaoTao?._id}
          name="hinhThucDaoTao"
          label="Hình thức đào tạo"
          rules={[...rules.required]}
        >
          <Select
            allowClear
            placeholder="Hình thức đào tạo"
            options={danhSach?.map((item) => ({ value: item._id, label: item.ten }))}
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

export default FormDoiTuongTuyenSinh;
