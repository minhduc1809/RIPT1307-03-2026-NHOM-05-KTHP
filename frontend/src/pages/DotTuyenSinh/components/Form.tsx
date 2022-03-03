import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormDotTuyenSinh = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postDotTuyenSinhModel, edit, record, putDotTuyenSinhModel } =
    useModel('dottuyensinh');
  const { danhSach } = useModel('namtuyensinh');
  const { danhSach: danhSachHinhThucDaoTao } = useModel('hinhthucdaotao');
  const [recordNamTuyenSinh, setRecordNamTuyenSinh] = useState<NamTuyenSinh.Record | undefined>(
    danhSach?.find((item) => item.nam === record?.namTuyenSinh),
  );
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<string>(record?.hinhThucDaoTao?._id ?? '');
  return (
    <Card loading={loading} title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt tuyển sinh`}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putDotTuyenSinhModel(record?._id ?? '', {
              ...values,
            });
          } else {
            postDotTuyenSinhModel({
              ...values,
              cauHinhPhuongThuc: {},
            });
          }
        }}
        form={form}
      >
        <Row gutter={[12, 0]}>
          <Col xs={24}>
            <Form.Item
              initialValue={record?.tenDotTuyenSinh}
              name="tenDotTuyenSinh"
              label="Tên đợt tuyển sinh"
              rules={[...rules.required]}
            >
              <Input placeholder="Tên đợt tuyển sinh" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              initialValue={record?.hinhThucDaoTao?._id}
              name="hinhThucDaoTao"
              label="Hình thức đào tạo"
              rules={[...rules.required]}
            >
              <Select
                allowClear
                onChange={(val) => {
                  setHinhThucDaoTao(val);
                  form.setFieldsValue({
                    namTuyenSinh: undefined,
                  });
                }}
                placeholder="Hình thức đào tạo"
                options={danhSachHinhThucDaoTao?.map((item) => ({
                  value: item._id,
                  label: item.ten,
                }))}
              />
            </Form.Item>{' '}
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.maDotTuyenSinh}
              name="maDotTuyenSinh"
              label="Mã đợt tuyển sinh"
              rules={[...rules.required]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={1000000}
                placeholder="Mã đợt tuyển sinh"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.maThanhToanDot}
              name="maThanhToanDot"
              label="Mã thanh toán đợt"
              rules={[...rules.required]}
            >
              <Input placeholder="Mã thanh toán đợt" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.namTuyenSinh}
              name="namTuyenSinh"
              label="Năm tuyển sinh"
              rules={[...rules.required]}
            >
              <Select
                notFoundContent="Bạn chưa chọn hình thức đào tạo hoặc không có năm tuyển sinh nào cho hình thức đào tạo này"
                onChange={(val) => {
                  form.setFieldsValue({
                    phuongThucTuyenSinh: undefined,
                  });
                  setRecordNamTuyenSinh(danhSach?.find((item) => item.nam === val));
                }}
                placeholder="Năm tuyển sinh"
                options={danhSach
                  ?.filter((item) => item.hinhThucDaoTao._id === hinhThucDaoTao)
                  ?.map((item) => ({ value: item.nam, label: item.nam }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="phuongThucTuyenSinh"
              label="Phương thức tuyển sinh"
              initialValue={record?.phuongThucTuyenSinh}
              rules={[...rules.required]}
            >
              <Select
                notFoundContent="Bạn chưa chọn năm tuyển sinh"
                placeholder="Phương thức tuyển sinh"
                options={recordNamTuyenSinh?.danhSachPhuongThuc?.map((item) => ({
                  value: item.phuongThucTuyenSinh._id,
                  label: item.phuongThucTuyenSinh.tenPhuongThuc,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item initialValue={record?.moTa} name="moTa" label="Mô tả">
              <Input.TextArea placeholder="Mô tả" rows={2} />
            </Form.Item>
          </Col>
          {[
            { name: 'thoiGianMoDangKy', label: 'Thời gian mở đăng ký' },
            { name: 'thoiGianKetThucNopHoSo', label: 'Thời gian kết thúc nộp hồ sơ' },
            {
              name: 'thoiGianBatDauKhaiBaoKetQuaThiTHPT',
              label: 'Thời gian bắt đầu khai báo KQ thi THPT',
            },
            {
              name: 'thoiGianKetThucKhaiBaoKetQuaThiTHPT',
              label: 'Thời gian kết thúc khai báo KQ thi THPT',
            },
            { name: 'thoiGianCongBoKetQua', label: 'Thời gian công bố kết quả' },
            { name: 'thoiGianBatDauXacNhanNhapHoc', label: 'Thời gian bắt đầu xác nhận nhập học' },
            {
              name: 'thoiGianKetThucXacNhanNhapHoc',
              label: 'Thời gian kết thúc xác nhận nhập học',
            },
          ].map((item) => (
            <Col key={item.name} xs={24} md={12}>
              <Form.Item
                name={item.name}
                label={item.label}
                rules={[...rules.required]}
                initialValue={record?.[item.name] ? moment(record?.[item.name]) : undefined}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="HH:mm DD/MM/YYYY"
                  placeholder={item.label}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

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

export default FormDotTuyenSinh;
