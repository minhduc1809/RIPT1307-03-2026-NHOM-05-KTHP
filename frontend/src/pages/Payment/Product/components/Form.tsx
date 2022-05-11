import { EHinhThucLePhiTuyenSinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { makeId } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormProduct = () => {
  const [form] = Form.useForm();
  const { setVisibleForm, loading, postModel, getModel } = useModel('product');
  return (
    <Card title="Thêm mới">
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={(values) => {
          postModel(
            {
              ...values,
              unitLabel: '',
              code: values?.code ?? `product_${makeId(9)}`,
              metaData: {
                ...values.metaData,
                loai: 'Tuyển sinh',
              },
            },
            () => {
              getModel(
                {
                  'metaData.loai': 'Tuyển sinh',
                },
                'pageable',
              );
            },
          );
        }}
      >
        <Form.Item rules={[...rules.length(20), ...rules.text]} name="code" label="Mã lệ phí">
          <Input placeholder="Mã lệ phí" />
        </Form.Item>

        <Form.Item
          rules={[...rules.required, ...rules.length(100), ...rules.text]}
          name="name"
          label="Tên lệ phí"
        >
          <Input placeholder="Tên lệ phí" />
        </Form.Item>
        <Form.Item name={['metaData', 'hinhThuc']} label="Hình thức">
          <Select
            allowClear
            placeholder="Hình thức"
            options={Object.values(EHinhThucLePhiTuyenSinh).map((item) => ({
              label: item,
              value: item,
            }))}
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

export default FormProduct;
