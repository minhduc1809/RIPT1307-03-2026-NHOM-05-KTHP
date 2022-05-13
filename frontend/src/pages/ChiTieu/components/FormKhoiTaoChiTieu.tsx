import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormKhoiTaoChiTieu = (props: { idCoSo: string; onCancel: any }) => {
  const { loading, adminKhoiTaoChiTieuModel } = useModel('chitieu');

  const { record } = useModel('dottuyensinh');

  const [form] = Form.useForm();

  return (
    <Card title={'Khởi tạo chỉ tiêu'}>
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={async (values) => {
          await adminKhoiTaoChiTieuModel({
            idDotTuyenSinh: record?._id ?? '',
            idCoSoDaoTao: props?.idCoSo ?? '',
            ...values,
          });
          props?.onCancel();
        }}
      >
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item name="chiTieuSoLuong" label="Chỉ tiêu số lượng">
              <InputNumber
                min={0}
                max={1000000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="phanTramTroi" label="Phần trăm trội">
              <InputNumber
                min={0}
                max={10000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="chiTieuDiem" label="Chỉ tiêu điểm">
              <InputNumber
                min={0}
                max={1000000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="replace" label="Loại khởi tạo" rules={[...rules.required]}>
              <Select
                placeholder="Chọn loại"
                options={[
                  { value: true, label: 'Ghi đè tất cả chỉ tiêu' },
                  { value: false, label: 'Chỉ bổ sung cho những ngành chưa có chỉ tiêu' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => props?.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormKhoiTaoChiTieu;
