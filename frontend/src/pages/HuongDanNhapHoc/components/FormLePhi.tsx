import { FormItem } from '@/components/FormItem';
import rules from '@/utils/rules';
import { currencyFormat } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormLePhi = (props: { modelName: any; fieldName: string }) => {
  const [form] = Form.useForm();
  const { danhSach } = useModel('product');
  const model = useModel(props.modelName);
  const danhSachLePhi = model?.[`danhSach${props.fieldName}`];
  const setDanhSachLePhi = model?.[`setDanhSach${props.fieldName}`];
  const setVisibleForm = model?.[`setVisibleForm${props.fieldName}`];
  const edit = model?.[`edit${props.fieldName}`];
  const record = model?.[`record${props.fieldName}`];

  const [recordProduct, setRecordProduct] = useState<ThanhToan.Product | undefined>(
    danhSach?.find((item) => item.prices.map((price) => price._id)?.includes(record?.maLePhi)),
  );

  return (
    <Card title={'Thêm lệ phí'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const recordLePhi = recordProduct?.prices?.find((item) => item._id === values.maLePhi);
          const payload = {
            ...values,
            ...recordLePhi,
            tenProduct: recordProduct?.name,
          };
          const listLePhiTemp = [...danhSachLePhi];
          if (!edit) {
            listLePhiTemp.push(payload);
          } else listLePhiTemp.splice(record?.index ? record.index - 1 : 0, 1, payload);
          setDanhSachLePhi(listLePhiTemp);
          setVisibleForm(false);
        }}
        form={form}
      >
        <Row gutter={[20, 0]}>
          <Col span={24}>
            <Form.Item
              initialValue={recordProduct?._id}
              rules={[...rules.required]}
              name="lePhi"
              label="Chọn lệ phí"
            >
              <Select
                onChange={(val) => {
                  setRecordProduct(danhSach.find((item) => item._id === val));
                  form.setFieldsValue({
                    maLePhi: undefined,
                  });
                }}
                placeholder="Chọn lệ phí"
                options={danhSach.map((item) => ({ label: item.name, value: item._id }))}
              />
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              initialValue={record?.maLePhi}
              rules={[...rules.required]}
              name="maLePhi"
              label="Chọn mức giá"
            >
              <Select
                placeholder="Chọn mức giá"
                options={recordProduct?.prices
                  .filter((item) => item.active)
                  .map((item) => ({
                    label: `${currencyFormat(item.unitAmount)} ${item.currency}`,
                    value: item._id,
                  }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormItem
              name="required"
              label="Bắt buộc nộp"
              initialValue={record?.required ?? false}
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
            <FormItem initialValue={record?.ghiChu} name="ghiChu" label="Ghi chú">
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
              setVisibleForm(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormLePhi;
