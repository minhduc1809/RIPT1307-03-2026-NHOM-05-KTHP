import { FormItem } from '@/components/FormItem';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormGiayTo = (props: { modelName: any; fieldName: string }) => {
  const [form] = Form.useForm();
  const model = useModel(props.modelName);
  const danhSachGiayTo = model?.[`danhSach${props.fieldName}`];
  const setDanhSachGiayTo = model?.[`setDanhSach${props.fieldName}`];
  const recordGiayTo = model?.[`record${props.fieldName}`];
  const edit = model?.[`edit${props.fieldName}`];
  const setVisibleFormGiayTo = model?.[`setVisibleForm${props.fieldName}`];

  const { danhSachGiayToCanNop } = useModel('dotnhaphoc');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} giấy tờ`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const listGiayToTemp = [...danhSachGiayTo];
          const giayTo = danhSachGiayToCanNop.find((item) => item.maGiayTo === values.maGiayTo);
          if (!edit) {
            listGiayToTemp.push({ ...giayTo, ...values });
          } else
            listGiayToTemp.splice(recordGiayTo?.index ? recordGiayTo.index - 1 : 0, 1, {
              ...giayTo,
              ...values,
            });
          setDanhSachGiayTo(listGiayToTemp);
          setVisibleFormGiayTo(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <FormItem
              rules={[...rules.required]}
              name="maGiayTo"
              label="Giấy tờ"
              initialValue={recordGiayTo?.maGiayTo}
            >
              <Select
                placeholder="Chọn giấy tờ"
                options={danhSachGiayToCanNop.map((item) => ({
                  label: item.ten,
                  value: item.maGiayTo,
                }))}
              />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem
              name="soLuong"
              label="Số lượng"
              initialValue={recordGiayTo?.soLuong ?? 1}
              rules={[...rules.required]}
            >
              <InputNumber style={{ width: '100%' }} min={1} max={100} placeholder="Số lượng" />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem
              name="required"
              label="Bắt buộc nộp"
              initialValue={recordGiayTo?.required ?? false}
              rules={[...rules.required]}
              style={{ marginBottom: 6 }}
            >
              <Radio.Group
                options={[
                  { value: true, label: 'Có' },
                  { value: false, label: 'Không' },
                ].map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
              />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem
              name="requiredOnline"
              label="Nộp Online"
              initialValue={recordGiayTo?.requiredOnline ?? false}
              rules={[...rules.required]}
              style={{ marginBottom: 6 }}
            >
              <Radio.Group
                options={[
                  { value: true, label: 'Có' },
                  { value: false, label: 'Không' },
                ].map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
              />
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem name="ghiChu" label="Ghi chú" initialValue={recordGiayTo?.ghiChu}>
              <Input.TextArea rows={2} placeholder="Ghi chú" />
            </FormItem>
          </Col>
        </Row>
        <FormItem style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button
            onClick={() => {
              setVisibleFormGiayTo(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormGiayTo;
