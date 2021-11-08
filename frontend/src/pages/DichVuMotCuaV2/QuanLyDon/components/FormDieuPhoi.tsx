/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Button, Card, Form, Select } from 'antd';
import { useModel } from 'umi';

const FormDieuPhoi = (props: { onCancel: any }) => {
  const [form] = Form.useForm();
  const { loading, recordDonThaoTac, dieuPhoiDonModel } = useModel('dichvumotcuav2');
  const { danhSachChuyenVienXuLy } = useModel('phanquyen');
  return (
    <Card title="Điều phối đơn">
      <Form
        // labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (!recordDonThaoTac?._id) return;
          const chuyenVien = danhSachChuyenVienXuLy?.find(
            (item) => item.id === values?.idChuyenVien,
          );
          dieuPhoiDonModel({
            idDonThaoTac: recordDonThaoTac._id,
            data: {
              nguoiDuocGiao: {
                _id: chuyenVien?.id?.toString() ?? '',
                hoTen: chuyenVien?.name ?? '',
                gioiTinh: chuyenVien?.gioi_tinh || '',
                ngaySinh: chuyenVien?.ngay_sinh ?? '',
                maDinhDanh: chuyenVien?.ma_dinh_danh ?? '',
              },
            },
          });

          props?.onCancel();
        }}
        form={form}
      >
        <Form.Item rules={[...rules.required]} name="idChuyenVien" label="Chuyên viên xử lý">
          <Select
            allowClear
            showSearch
            placeholder="Chọn chuyên viên xử lý"
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {danhSachChuyenVienXuLy?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>
          <Button
            onClick={() => {
              props?.onCancel();
            }}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormDieuPhoi;
