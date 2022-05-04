import rules from '@/utils/rules';
import { toISOString } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const FormDotNhapHoc = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postDotNhapHocModel, edit, record, putDotNhapHocModel } =
    useModel('dotnhaphoc');

  const { danhSach } = useModel('dottuyensinh');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt nhập học`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.thongTinDotTuyenSinh = values?.thongTinDotTuyenSinh?.map((item: string) => ({
            idDotTuyenSinh: item,
          }));
          values.ngayBatDau = toISOString(values.thoiGian[0]);
          values.ngayKetThuc = toISOString(values.thoiGian[1]);
          if (edit) {
            putDotNhapHocModel(record?._id ?? '', {
              ...values,
              thoiGian: undefined,
            });
          } else {
            postDotNhapHocModel({
              ...values,
              thoiGian: undefined,
            });
          }
        }}
        form={form}
      >
        <Form.Item
          initialValue={record?.tenDot}
          rules={[...rules.required]}
          name="tenDot"
          label="Tên đợt"
        >
          <Input placeholder="Tên đợt" />
        </Form.Item>

        <Form.Item
          rules={[...rules.required]}
          initialValue={record?.thongTinDotTuyenSinh?.map((item) => item.idDotTuyenSinh)}
          name="thongTinDotTuyenSinh"
          label="Thông tin đợt tuyển sinh"
        >
          <Select
            mode="multiple"
            placeholder="Chọn đợt"
            options={danhSach.map((item) => ({ label: item.tenDotTuyenSinh, value: item._id }))}
          />
        </Form.Item>

        <Form.Item initialValue={record?.moTa} name="moTa" label="Mô tả">
          <Input.TextArea placeholder="Mô tả" rows={2} />
        </Form.Item>

        <Form.Item
          rules={[...rules.required]}
          name="thoiGian"
          label="Thời gian bắt đầu - Thời gian kết thúc"
          initialValue={[
            record?.ngayBatDau ? moment(record?.ngayBatDau) : undefined,
            record?.ngayKetThuc ? moment(record?.ngayKetThuc) : undefined,
          ]}
          style={{ marginBottom: 8 }}
        >
          <DatePicker.RangePicker
            format="HH:mm DD-MM-YYYY"
            style={{ width: '100%' }}
            placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
            showTime
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

export default FormDotNhapHoc;
