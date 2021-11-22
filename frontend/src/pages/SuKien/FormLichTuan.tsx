/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Input } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const { RangePicker } = DatePicker;

const FormLichTuan = (props: { onCancel: any }) => {
  const { addModel, updModel, edit, record } = useModel('lichtuan');

  const [form] = Form.useForm();
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: LichTuan.Record) => {
          values.thoiGianBatDau = values?.thoiGian?.[0];
          values.thoiGianKetThuc = values?.thoiGian?.[1];
          delete values.thoiGian;
          if (!edit) {
            await addModel({ ...values });
          } else {
            values._id = record?._id;
            await updModel({ ...values });
          }
          props?.onCancel();
        }}
        form={form}
      >
        <Form.Item
          rules={[...rules.required]}
          initialValue={record?.noiDungCongViec}
          name="noiDungCongViec"
          label="Nội dung công việc"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea placeholder="Nội dung công việc" rows={3} />
        </Form.Item>
        <Form.Item
          initialValue={[
            record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
            record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
          ]}
          rules={[...rules.required]}
          name="thoiGian"
          label="Thời gian bắt đầu - kết thúc"
          style={{ marginBottom: 0 }}
        >
          <RangePicker style={{ width: '100%' }} showTime format="HH:mm DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          initialValue={record?.diaDiem}
          rules={[...rules.required]}
          name="diaDiem"
          label="Địa điểm"
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="Địa điểm" />
        </Form.Item>
        <Form.Item
          initialValue={record?.chuTri}
          rules={[...rules.required]}
          name="chuTri"
          label="Chủ trì"
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="Chủ trì" />
        </Form.Item>
        <Form.Item
          initialValue={record?.thanhPhanThamDu}
          rules={[...rules.required]}
          name="thanhPhanThamDu"
          label="Thành phần tham dự"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea placeholder="Thành phần tham dự" rows={3} />
        </Form.Item>
        <Form.Item
          name="donViChuanBi"
          label="Đơn vị chuẩn bị"
          style={{ marginBottom: 0 }}
          initialValue={record?.donViChuanBi}
        >
          <Input placeholder="Đơn vị chuẩn bị" />
        </Form.Item>
        <Form.Item
          name="donViPhoiHop"
          label="Đơn vị phối hợp"
          style={{ marginBottom: 0 }}
          initialValue={record?.donViPhoiHop}
        >
          <Input placeholder="Đơn vị phối hợp" />
        </Form.Item>
        <Form.Item
          rules={[...rules.required]}
          name="ghiChu"
          label="Ghi chú"
          initialValue={record?.ghiChu}
        >
          <Input.TextArea placeholder="Ghi chú (nếu có)" rows={3} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Lưu' : 'Thêm mới'}
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

export default FormLichTuan;
