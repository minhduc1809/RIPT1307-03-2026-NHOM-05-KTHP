import { getPhanNhomByUserId } from '@/services/PhanQuyen/phanquyen';
import rules from '@/utils/rules';
import { Button, Card, Form, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormPhanNhom = () => {
  const [form] = Form.useForm();
  const { danhSachNhomVaiTro, setVisibleForm, putUserPhanNhomModel, recordUser, loading } =
    useModel('phanquyen');

  const getPhanNhom = async () => {
    if (recordUser?._id) {
      const response = await getPhanNhomByUserId(recordUser?._id);
      form.setFieldsValue({
        nhomVaiTroId: response?.data?.data?.danhSachPhanNhom?.map(
          (item: PhanQuyen.PhanNhom) => item.nhomVaiTroId,
        ),
      });
    }
  };

  useEffect(() => {
    getPhanNhom();
  }, [recordUser?._id]);

  return (
    <Card title={'Chỉnh sửa nhóm vai trò'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          putUserPhanNhomModel({
            userId: recordUser?._id ?? '',
            danhSachPhanNhom: values?.nhomVaiTroId?.map((item: string) => ({
              nhomVaiTroId: item,
              mucDo: 'Tất cả',
            })),
          });
        }}
        form={form}
      >
        <Form.Item label="Nhóm vai trò" name="nhomVaiTroId" rules={[...rules.required]}>
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

export default FormPhanNhom;
