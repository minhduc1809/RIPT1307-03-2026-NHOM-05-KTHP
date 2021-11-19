/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Input } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const { RangePicker } = DatePicker;

const FormLichTuan = (props: { onCancel: any; record: LichTuan.Record; edit: boolean }) => {
  const { addModel, updModel } = useModel('lichtuan');

  const [form] = Form.useForm();
  return (
    <Card title={props.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: LichTuan.Record) => {
          if (!props.edit) {
            values.thoiGianBatDau = values?.thoiGian[0];
            values.thoiGianKetThuc = values?.thoiGian[1];

            delete values.thoiGian;

            await addModel({ ...values });
          } else {
            values.thoiGianBatDau = values?.thoiGian[0];
            values.thoiGianKetThuc = values?.thoiGian[1];

            delete values.thoiGian;
            values._id = props.record._id;

            await updModel({ ...values });
          }
          props?.onCancel();
        }}
        form={form}
      >
        <Form.Item
          rules={[...rules.required]}
          initialValue={props?.record?.noiDungCongViec}
          name="noiDungCongViec"
          label="Nội dung công việc"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          initialValue={[
            props?.record?.thoiGianBatDau ? moment(props?.record?.thoiGianBatDau) : undefined,
            props?.record?.thoiGianKetThuc ? moment(props?.record?.thoiGianKetThuc) : undefined,
          ]}
          rules={[...rules.required]}
          name="thoiGian"
          label="Thời gian bắt đầu - kết thúc"
          style={{ marginBottom: 0 }}
        >
          <RangePicker showTime format="HH:mm DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          initialValue={props?.record?.diaDiem}
          rules={[...rules.required]}
          name="diaDiem"
          label="Địa điểm"
          style={{ marginBottom: 0 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={props?.record?.chuTri}
          rules={[...rules.required]}
          name="chuTri"
          label="Chủ trì"
          style={{ marginBottom: 0 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={props?.record?.thanhPhanThamDu}
          rules={[...rules.required]}
          name="thanhPhanThamDu"
          label="Thành phần tham dự"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="donViChuanBi"
          label="Đơn vị chuẩn bị"
          style={{ marginBottom: 0 }}
          initialValue={props?.record?.donViChuanBi}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="donViPhoiHop"
          label="Đơn vị phối hợp"
          style={{ marginBottom: 0 }}
          initialValue={props?.record?.donViPhoiHop}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[...rules.required]}
          name="ghiChu"
          label="Ghi chú"
          initialValue={props?.record?.ghiChu}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {props.edit ? 'Chỉnh sửa' : 'Thêm mới'}
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
