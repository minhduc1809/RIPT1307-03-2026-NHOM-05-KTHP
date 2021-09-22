import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const dataSinhVienNam = [
  { label: 'Năm nhất', value: 1 },
  { label: 'Năm hai', value: 2 },
  { label: 'Năm ba', value: 3 },
  { label: 'Năm tư', value: 4 },
];

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
  console.log(`initialState`, initialState);
  return (
    <Card bodyStyle={{ padding: 60 }} title={loaiGiayTo}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: DichVuMotCua.Record) => {
          const queQuan = {
            maTinh: values?.queQuan,
            tenTinh: danhSachTinh?.filter((item) => item?.ma === values?.queQuan)?.[0]?.tenDonVi,
          };
          postDonXacNhanTinhTrangHocTapModel({
            ...values,
            queQuan,
            loaiPhongBan,
            namHocBatDau: values?.namHocBatDau.toString(),
            namHocKetThuc: values?.namHocKetThuc?.toString(),
            loaiDon: loaiGiayTo,
          });
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
              initialValue={initialState?.currentUser?.gioi_tinh === '0' ? 'Nam' : 'Nữ'}
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
            <Form.Item name="ngayCapCmtCccd" label="Ngày cấp" rules={[...rules.required]}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Ngày cấp" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="noiCap" label="Nơi cấp" rules={[...rules.required]}>
              <Input placeholder="Nơi cấp" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="Lop" label="Lớp" rules={[]}>
              <Input placeholder="Lớp" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="soDienThoai" label="Số điện thoại" rules={[...rules.required]}>
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="queQuan" label="Quê quán" rules={[...rules.required]}>
              <Select placeholder="Chọn tỉnh">
                {danhSachTinh?.map((item) => (
                  <Select.Option key={item?._id} value={item?.ma}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
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
                {dataSinhVienNam.map((item) => (
                  <Select.Option value={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="khoa" initialValue="Chưa cập nhật" label="Khoa" rules={[]}>
              <Input placeholder="Khoa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="nganh" label="Ngành" rules={[]}>
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
              name="khoaHoc"
              label="Khóa học"
              initialValue={''}
              rules={[...rules.required]}
            >
              <Input placeholder="Khóa học" />
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
