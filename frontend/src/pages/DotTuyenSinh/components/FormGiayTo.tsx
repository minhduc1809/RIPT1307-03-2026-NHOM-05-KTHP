/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useModel } from 'umi';

const FormGiayTo = (props: { fieldName: 'danhSachGiayToNopHoSo' | 'danhSachGiayToNopOnline' }) => {
  const [form] = Form.useForm();
  const modelDotTuyenSinh = useModel('dottuyensinh');
  const { editGiayTo: edit, setVisibleFormGiayTo, recordGiayTo } = modelDotTuyenSinh;

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} giấy tờ`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const listGiayToTemp = [...modelDotTuyenSinh?.[props.fieldName]];
          if (!edit) {
            listGiayToTemp.splice(0, 0, values);
          } else listGiayToTemp.splice(recordGiayTo?.index ? recordGiayTo.index - 1 : 0, 1, values);
          modelDotTuyenSinh?.[`set${props.fieldName}`](listGiayToTemp);
          setVisibleFormGiayTo(false);
        }}
        form={form}
      >
        <Form.Item
          rules={[...rules.required]}
          name="maGiayTo"
          label="Mã giấy tờ"
          initialValue={recordGiayTo?.maGiayTo}
        >
          <Input placeholder="Mã giấy tờ" />
        </Form.Item>
        <Form.Item
          name="ten"
          label="Tên giấy tờ"
          initialValue={recordGiayTo?.ten}
          rules={[...rules.required]}
        >
          <Input placeholder="Tên giấy tờ" />
        </Form.Item>
        <Form.Item
          name="soLuong"
          label="Số lượng"
          initialValue={recordGiayTo?.soLuong ?? 0}
          rules={[...rules.required]}
        >
          <InputNumber min={0} max={100} placeholder="Số lượng" />
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi chú" initialValue={recordGiayTo?.ghiChu}>
          <Input.TextArea rows={2} placeholder="Ghi chú" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleFormGiayTo(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormGiayTo;
