import { ETrangThaiNhapHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { uploadMultiFile } from '@/utils/utils';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useModel } from 'umi';
import TableGiayTo from '../HuongDanThuTucNhapHoc/components/TableGiayTo';
import TableLePhi from '../HuongDanThuTucNhapHoc/components/TableLePhi';

const FormTiepNhanHoSoNhapHoc = (props: {
  type?: ETrangThaiNhapHoc;
  onCancel: any;
  idCoSo?: string;
}) => {
  const {
    loading,
    adminTiepNhanHoSoNhapHocModel,
    record,
    adminTiepNhanGiayToNopNhapHocModel,
    setLoading,
  } = useModel('ketquaxettuyen');
  const { record: recordDot } = useModel('dottuyensinh');

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      onFinish={async (values) => {
        setLoading(true);
        let index = 0;
        for (const item of values?.danhSachGiayToNop ?? []) {
          if (item?.urlGiayToNop?.fileList) {
            const urlGiayToNop = await uploadMultiFile(item?.urlGiayToNop?.fileList ?? []);
            values.danhSachGiayToNop[index] = {
              ...values.danhSachGiayToNop[index],
              ...record?.danhSachGiayToNop?.[index],
              urlGiayToNop,
            };
          }
          index += 1;
        }
        const payloadGiayTo: any = {
          danhSachGiayToNop: values?.danhSachGiayToNop || record?.danhSachGiayToNop,
        };
        await adminTiepNhanGiayToNopNhapHocModel(record?._id ?? '', payloadGiayTo);
        await adminTiepNhanHoSoNhapHocModel(recordDot?._id ?? '', record?._id ?? '', {
          trangThaiNhapHoc: props?.type ?? ETrangThaiNhapHoc.DA_KHOA,
          ghiChuTiepNhan: values?.ghiChuTiepNhan,
        });
        props?.onCancel();
      }}
    >
      <div>Danh sách giấy tờ cần nộp</div>
      <TableGiayTo
        mode={props.type === ETrangThaiNhapHoc.YEU_CAU_CHINH_SUA ? 'view' : 'handle'}
        fieldData="danhSachGiayToCanNop"
        fieldName="danhSachGiayToNop"
      />
      <br />
      <div>Danh sách lệ phí cần nộp</div>
      <TableLePhi mode="view" />
      <br />

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
