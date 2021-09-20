import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormYeuCauCapGiayXacNhanTinhTrangHocTap = () => {
  const { loaiPhongBan, loaiGiayTo, record, setVisibleForm, edit, loading } =
    useModel('dichvumotcua');
  const [form] = Form.useForm();
  return (
    <Card title={loaiGiayTo}>
      <Form labelCol={{ span: 24 }} onFinish={async (values) => {}} form={form}>
        <TieuDe />
        <Row>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="sinhVienNam"
              label="Là sinh viên năm thứ"
              initialValue={record?.sinhVienNam}
              rules={[...rules.required]}
            >
              <Select>
                {['Năm nhất', 'Năm hai', 'Năm ba', 'Năm tư'].map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="heDaoTao"
              label="Hệ đào tạo"
              initialValue={record?.heDaoTao}
              rules={[...rules.required]}
            >
              <Select>
                {['Đại học', 'Cao đẳng', 'Dạy nghề'].map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}></Col>
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Lưu' : 'Thêm'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormYeuCauCapGiayXacNhanTinhTrangHocTap;
