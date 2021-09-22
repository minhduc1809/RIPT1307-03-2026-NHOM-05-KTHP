import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormYeuCauCapGiayXacNhanTinhTrangHocTap = () => {
  const {
    loaiPhongBan,
    loaiGiayTo,
    record,
    setVisibleForm,
    edit,
    getTinh,
    danhSachTinh,
    loading,
    postDonXacNhanTinhTrangHocTapModel,
  } = useModel('dichvumotcua');
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();

  useEffect(() => {
    getTinh();
    // form.setFieldsValue({
    //   hoTen: infoSv?.TenDayDu,
    //   maSv: infoSv?.ma_sv,
    //   gioiTinh: infoSv?.gioi_tinh === '0' ? 'Nam' : 'Nữ',
    //   cmtCccd: infoSv?.so_cmnd,
    //   ngayCapCmtCccd: infoSv?.ngay_cap,
    // });
  }, []);
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
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={initialState?.currentUser?.TenDayDu}
              name="hoTen"
              label="Họ tên"
              rules={[...rules.required]}
            >
              <Input readOnly placeholder="Họ và tên" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={initialState?.currentUser?.ma_sv}
              name="maSv"
              label="Mã sinh viên"
              rules={[...rules.required]}
            >
              <Input readOnly placeholder="Mã sinh viên" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={initialState?.currentUser?.gioi_tinh}
              name="gioiTinh"
              label="Giới tính"
              rules={[...rules.required]}
            >
              <Input readOnly placeholder="Giới tính" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="hoTen" label="Số CMND (CCCD)" rules={[...rules.required]}>
              <Input placeholder="Niên khóa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="ngayCap" label="Ngày cấp" rules={[...rules.required]}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Ngày cấp" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="hoTen" label="Nơi cấp" rules={[...rules.required]}>
              <Input placeholder="Nơi cấp" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="hoTen" label="Lớp" rules={[...rules.required]}>
              <Input placeholder="Niên khóa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="hoTen" label="Số điện thoại" rules={[...rules.required]}>
              <Input placeholder="Niên khóa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="hoTen" label="Quê quán" rules={[...rules.required]}>
              <Select>
                {danhSachTinh?.map((item) => (
                  <Select.Option key={item?._id} value={item?.ma}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}{' '}
              </Select>
            </Form.Item>
          </Col>
        </Row>
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
            <Form.Item name="hoTen" label="Khoa" rules={[...rules.required]}>
              <Input placeholder="Khoa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="hoTen" label="Ngành" rules={[...rules.required]}>
              <Input placeholder="Ngành" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="heDaoTao"
              label="Hệ đào tạo"
              initialValue="Đại học chính quy"
              rules={[...rules.required]}
            >
              <Select placeholder="Hệ đào tạo">
                {['Đại học chính quy'].map((item) => (
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
              label="Lý do xác nhận"
              initialValue={record?.lyDo}
              rules={[...rules.required]}
            >
              <Select placeholder="Chọn lý do">
                {[
                  'Xác nhận là sinh viên',
                  'Làm thủ tục hoãn nghĩa vụ quân sự',
                  'Làm thủ tục giảm trừ thuế thu thập cho người thân',
                  'Khác',
                ].map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
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
