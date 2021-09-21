import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useModel } from 'umi';

const FormYeuCauCapGiayXacNhanTinhTrangHocTap = () => {
  const {
    loaiPhongBan,
    loaiGiayTo,
    record,
    setVisibleForm,
    edit,
    loading,
    postDonXacNhanTinhTrangHocTapModel,
  } = useModel('dichvumotcua');
  const [form] = Form.useForm();
  return (
    <Card bodyStyle={{ padding: 60 }} title={loaiGiayTo}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          postDonXacNhanTinhTrangHocTapModel({ ...values, loaiPhongBan, loaiDon: loaiGiayTo });
        }}
        form={form}
      >
        <TieuDe />
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="sinhVienNam"
              label="Là sinh viên năm thứ"
              initialValue={record?.sinhVienNam}
              rules={[...rules.required]}
            >
              <Select placeholder="Là sinh viên năm thứ ?">
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
              <Select placeholder="Hệ đào tạo">
                {['Đại học', 'Cao đẳng', 'Dạy nghề'].map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="nienKhoa"
              label="Khóa học"
              initialValue={record?.nienKhoa}
              rules={[...rules.required]}
            >
              <Input placeholder="Niên khóa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="namHocBatDau"
              label="Từ năm"
              initialValue={record?.namHocBatDau}
              rules={[...rules.required]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Từ năm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="namHocKetThuc"
              label="Đến năm"
              initialValue={record?.namHocKetThuc}
              rules={[...rules.required]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Đến năm" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="lyDo"
              label="Lý do"
              initialValue={record?.lyDo}
              rules={[...rules.required]}
            >
              <Input.TextArea rows={3} placeholder="Lý do" />
            </Form.Item>
          </Col>
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
