import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';

const FormHinhThucDaoTao = () => {
  const [form] = Form.useForm();
  const { edit, record, setVisibleForm, loading, postHinhThucDaoTaoModel, putHinhThucDaoTaoModel } =
    useModel('hinhthucdaotao');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        labelAlign="left"
        onFinish={async (values: HinhThucDaoTao.Record) => {
          if (edit) putHinhThucDaoTaoModel({ id: record?._id ?? '', payload: values });
          else postHinhThucDaoTaoModel(values);
        }}
        form={form}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24}>
            <Form.Item
              name="ten"
              label="Tên hình thức"
              rules={[...rules.required, ...rules.text]}
              initialValue={record?.ten}
            >
              <Input placeholder="Tên hình thức" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="ma" label="Mã" rules={[...rules.required]} initialValue={record?.ma}>
              <Input placeholder="Mã" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="kyHieu"
              label="Ký hiệu"
              rules={[...rules.required]}
              initialValue={record?.kyHieu}
            >
              <Input placeholder="Ký hiệu" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormHinhThucDaoTao;
