import { ETrangThaiNhapHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useModel } from 'umi';
// import { TableGiayToXacNhanNhapHoc } from './TableGiayToXacNhanNhapHoc';
// import { TableThongTinKhaiXacNhanNhapHoc } from './TableThongTinKhaiXacNhanNhapHoc';

const FormTiepNhanHoSoNhapHoc = (props: {
  type?: ETrangThaiNhapHoc;
  onCancel: any;
  idCoSo?: string;
}) => {
  const { loading, adminTiepNhanHoSoNhapHocModel, record } = useModel('ketquaxettuyen');
  const { record: recordDot } = useModel('dottuyensinh');

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={async (values) => {
        await adminTiepNhanHoSoNhapHocModel(recordDot?._id ?? '', record?._id ?? '', {
          trangThaiNhapHoc: props?.type ?? ETrangThaiNhapHoc.DA_KHOA,
          ...values,
        });
        props?.onCancel();
      }}
    >
      {/* <TableThongTinKhaiXacNhanNhapHoc />
      <TableGiayToXacNhanNhapHoc /> */}

      <Form.Item
        rules={
          props?.type === ETrangThaiNhapHoc.YEU_CAU_CHINH_SUA
            ? [...rules.required, ...rules.text]
            : [...rules.text]
        }
        label="Ghi chú"
        name="ghiChuTiepNhan"
      >
        <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 20 }}>
        <Button
          icon={<SaveOutlined />}
          loading={loading}
          style={{ marginRight: 8 }}
          htmlType="submit"
          type="primary"
        >
          Lưu
        </Button>

        <Button icon={<CloseOutlined />} onClick={() => props?.onCancel()}>
          Đóng
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormTiepNhanHoSoNhapHoc;
