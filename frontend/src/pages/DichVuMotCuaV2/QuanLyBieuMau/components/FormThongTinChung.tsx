import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor/Tiny';
import { ArrowRightOutlined } from '@ant-design/icons';

const FormThongTinChung = () => {
  const [form] = Form.useForm();
  const {
    loading,
    edit,
    setCurrent,
    recordThongTinChung,
    setRecordThongTinChung,
    setRecordCauHinhBieuMau,
    recordCauHinhBieuMau,
  } = useModel('dichvumotcuav2');
  return (
    <Card title={edit ? 'Chỉnh sửa thông tin chung' : 'Thêm mới thông tin chung'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          setRecordThongTinChung({
            thongTinThuTuc: values?.thongTinThuTuc,
            thongTinHoSo: values?.thongTinHoSo?.text ?? '',
            thongTinQuyTrinh: values?.thongTinQuyTrinh?.text ?? '',
            thongTinYeuCau: values?.thongTinYeuCau?.text ?? '',
          });
          setRecordCauHinhBieuMau({
            ...recordCauHinhBieuMau,
            ten: values?.ten,
            ghiChu: values?.ghiChu,
          });
          setCurrent(1);
        }}
        form={form}
      >
        <h3 style={{ fontWeight: 'bold' }}>Thông tin thủ tục</h3>
        <Row gutter={[20, 0]}>
          <Col xs={24}>
            <Form.Item
              name="ten"
              label="Tên biểu mẫu"
              initialValue={recordCauHinhBieuMau?.ten}
              rules={[...rules.required, ...rules.text, ...rules.length(100)]}
            >
              <Input placeholder="Tên biểu mẫu" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="ghiChu"
              label="Ghi chú"
              initialValue={recordCauHinhBieuMau?.ghiChu}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input.TextArea placeholder="Ghi chú" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'maThuTuc']}
              label="Mã thủ tục"
              initialValue={recordThongTinChung?.thongTinThuTuc?.maThuTuc}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Mã thủ tục" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'linhVuc']}
              label="Lĩnh vực"
              initialValue={recordThongTinChung?.thongTinThuTuc?.linhVuc}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Lĩnh vực" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'donViThucHien']}
              label="Đơn vị thực hiện"
              initialValue={recordThongTinChung?.thongTinThuTuc?.donViThucHien}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Đơn vị thực hiện" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'capDo']}
              label="Cấp độ"
              initialValue={recordThongTinChung?.thongTinThuTuc?.capDo}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Cấp độ" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'thoiHanGiaiQuyet']}
              label="Thời hạn giải quyết"
              initialValue={recordThongTinChung?.thongTinThuTuc?.thoiHanGiaiQuyet}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Thời hạn giải quyết" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'yeuCauTraPhi']}
              label="Yêu cầu trả phí"
              initialValue={recordThongTinChung?.thongTinThuTuc?.yeuCauTraPhi}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Yêu cầu trả phí" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'coQuanCoThamQuyen']}
              label="Cơ quan có thẩm quyền"
              initialValue={recordThongTinChung?.thongTinThuTuc?.coQuanCoThamQuyen}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Cơ quan có thẩm quyền" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'phamViPhucVu']}
              label="Phạm vi phục vụ"
              initialValue={recordThongTinChung?.thongTinThuTuc?.phamViPhucVu}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Phạm vi phục vụ" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'ketQuaThucHien']}
              label="Kết quả thực hiện"
              initialValue={recordThongTinChung?.thongTinThuTuc?.ketQuaThucHien}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Kết quả thực hiện" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'mauBieu']}
              label="Mẫu biểu"
              initialValue={recordThongTinChung?.thongTinThuTuc?.mauBieu}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Mẫu biểu" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name={['thongTinThuTuc', 'luuY']}
              label="Lưu ý"
              initialValue={recordThongTinChung?.thongTinThuTuc?.luuY}
              rules={[...rules.text, ...rules.length(200)]}
            >
              <Input placeholder="Lưu ý" />
            </Form.Item>
          </Col>
        </Row>
        <h3 style={{ fontWeight: 'bold' }}>Thông tin hồ sơ</h3>
        <Row>
          <Form.Item
            name="thongTinHoSo"
            label=""
            initialValue={{ text: recordThongTinChung?.thongTinHoSo ?? '' }}
            // rules={[...rules.text]}
          >
            <TinyEditor height={650} />
          </Form.Item>
        </Row>
        <h3 style={{ fontWeight: 'bold' }}>Quy trình thực hiện</h3>
        <Row>
          <Form.Item
            name="thongTinQuyTrinh"
            label=""
            initialValue={{ text: recordThongTinChung?.thongTinQuyTrinh ?? '' }}
            // rules={[...rules.text]}
          >
            <TinyEditor height={650} />
          </Form.Item>
        </Row>
        <h3 style={{ fontWeight: 'bold' }}>Yêu cầu</h3>
        <Row>
          <Form.Item
            name="thongTinYeuCau"
            label=""
            initialValue={{ text: recordThongTinChung?.thongTinYeuCau ?? '' }}
            // rules={[...rules.text]}
          >
            <TinyEditor height={650} />
          </Form.Item>
        </Row>

        <Form.Item
          style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
        >
          <Button
            icon={<ArrowRightOutlined />}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Tiếp theo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormThongTinChung;
