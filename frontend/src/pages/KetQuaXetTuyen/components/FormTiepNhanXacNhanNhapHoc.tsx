import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { uploadMultiFile } from '@/utils/utils';
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
  const { loading, adminTiepNhanXacNhanNhapHocModel, record, setLoading } =
    useModel('ketquaxettuyen');
  const { record: recordDot } = useModel('dottuyensinh');

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={async (values) => {
        setLoading(true);
        let index = 0;
        for (const item of values?.danhSachGiayToXacNhanNhapHoc ?? []) {
          if (item?.urlGiayTo?.fileList) {
            const urlGiayTo = await uploadMultiFile(item?.urlGiayTo?.fileList ?? []);
            values.danhSachGiayToXacNhanNhapHoc[index] = {
              ...values.danhSachGiayToXacNhanNhapHoc[index],
              ...record?.thongTinXacNhanNhapHoc?.danhSachGiayToXacNhanNhapHoc?.[index],
              urlGiayTo,
            };
          }
          index += 1;
        }
        const payload = {
          danhSachGiayToXacNhanNhapHoc: values?.danhSachGiayToXacNhanNhapHoc ?? [],
          danhSachThongTinKhaiXacNhan: values?.danhSachThongTinKhaiXacNhan?.map(
            (item: KetQuaXetTuyen.ThongTinKhaiXacNhan, indexTemp: number) => ({
              ...record?.thongTinXacNhanNhapHoc?.danhSachThongTinKhaiXacNhan?.[indexTemp],
              ...item,
            }),
          ),
          ghiChuTiepNhan: values?.ghiChuTiepNhan,
          trangThaiXacNhan: props?.type ?? ETrangThaiXacNhanNhapHoc.XAC_NHAN,
          ngayTiepNhan: moment().toISOString(),
        };
        await adminTiepNhanXacNhanNhapHocModel(
          record?._id ?? '',
          payload,
          recordDot?._id ?? '',
          props?.idCoSo,
        );
        props?.onCancel();
      }}
    >
      <TableThongTinKhaiXacNhanNhapHoc mode="handle" />
      <TableGiayToXacNhanNhapHoc mode="handle" />

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
