import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import { TableGiayToXacNhanNhapHoc } from './TableGiayToXacNhanNhapHoc';
import { TableThongTinKhaiXacNhanNhapHoc } from './TableThongTinKhaiXacNhanNhapHoc';

const FormTiepNhanXacNhanNhapHoc = (props: {
  type?: ETrangThaiXacNhanNhapHoc;
  onCancel: any;
  idCoSo?: string;
}) => {
  const { loading, adminTiepNhanXacNhanNhapHocModel, record } = useModel('ketquaxettuyen');
  const { record: recordDot } = useModel('dottuyensinh');

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={async (values) => {
        await adminTiepNhanXacNhanNhapHocModel(
          record?._id ?? '',
          {
            danhSachGiayToXacNhanNhapHoc:
              record?.thongTinXacNhanNhapHoc?.danhSachGiayToXacNhanNhapHoc ?? [],
            danhSachThongTinKhaiXacNhan:
              record?.thongTinXacNhanNhapHoc?.danhSachThongTinKhaiXacNhan ?? [],
            ghiChuTiepNhan: values?.ghiChuTiepNhan,
            trangThaiXacNhan: props?.type ?? ETrangThaiXacNhanNhapHoc.XAC_NHAN,
            ngayTiepNhan: moment().toISOString(),
          },
          recordDot?._id ?? '',
          props?.idCoSo,
        );
        props?.onCancel();
      }}
    >
      <TableThongTinKhaiXacNhanNhapHoc />
      <TableGiayToXacNhanNhapHoc />

      <Form.Item
        rules={
          props?.type === ETrangThaiXacNhanNhapHoc.KHONG_TIEP_NHAN
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

export default FormTiepNhanXacNhanNhapHoc;
