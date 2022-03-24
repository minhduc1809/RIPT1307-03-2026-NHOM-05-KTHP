import TinyEditor from '@/components/TinyEditor/Tiny';
import { EDonViTinh } from '@/utils/constants';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableGiayTo from './TableGiayTo';
import TableNganh from './TableNganh';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormDotTuyenSinh = () => {
  const [form] = Form.useForm();
  const {
    loading,
    setVisibleForm,
    postDotTuyenSinhModel,
    edit,
    record,
    putDotTuyenSinhModel,
    setdanhSachGiayToNopHoSo,
    setdanhSachGiayToNopOnline,
    setDanhSachNganh,
    danhSachGiayToNopHoSo,
    danhSachGiayToNopOnline,
    danhSachNganh,
  } = useModel('dottuyensinh');
  const { danhSach } = useModel('namtuyensinh');
  const { record: recordProduct } = useModel('thanhtoan');
  const { danhSach: danhSachHinhThucDaoTao } = useModel('hinhthucdaotao');
  const { danhSach: danhSachDoiTuongTuyenSinh } = useModel('doituongtuyensinh');
  const [recordNamTuyenSinh, setRecordNamTuyenSinh] = useState<NamTuyenSinh.Record | undefined>(
    danhSach?.find((item) => item.nam === record?.namTuyenSinh),
  );
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<string>(record?.hinhThucDaoTao?._id ?? '');
  const [yeuCauTraPhi, setYeuCauTraPhi] = useState<boolean>(record?.yeuCauTraPhi ?? false);
  const [gioiHanDoiTuong, setGioiHanDoiTuong] = useState<boolean>(record?.gioiHanDoiTuong ?? false);
  const [suDungToHopMongMuon, setSuDungToHopMongMuon] = useState<boolean>(
    record?.suDungToHopMongMuon ?? false,
  );
  const [choPhepDangKyKhacCoSo, setChoPhepDangKyKhacCoSo] = useState<boolean>(
    record?.choPhepDangKyKhacCoSo ?? false,
  );
  useEffect(() => {
    form.resetFields();
  }, [recordProduct]);

  useEffect(() => {
    return () => {
      setdanhSachGiayToNopHoSo([]);
      setdanhSachGiayToNopOnline([]);
      setDanhSachNganh([]);
    };
  }, []);
  return (
    <Card loading={loading} title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt tuyển sinh`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.danhSachDoiTuongTuyenSinh = values?.danhSachDoiTuongTuyenSinh?.map(
            (item: string) => ({
              maDoiTuong: item,
              cauHinhDoiTuong:
                record?.danhSachDoiTuongTuyenSinh?.find((doiTuong) => doiTuong.maDoiTuong === item)
                  ?.cauHinhDoiTuong ?? {},
            }),
          );

          if (edit) {
            putDotTuyenSinhModel(record?._id ?? '', {
              ...record,
              ...values,
              moTa: values?.moTa?.text,
              cauHinhPhuongThuc: {},
              yeuCauTraPhi,
              choPhepDangKyKhacCoSo,
              gioiHanDoiTuong,
              suDungToHopMongMuon,
              thongTinGiayToNopOnline: danhSachGiayToNopOnline,
              thongTinGiayToNopHoSo: danhSachGiayToNopHoSo,
              danhSachNganhTuyenSinh: danhSachNganh?.map((item) => ({
                ...item,
                nganh: item?.nganh?._id,
                danhSachCoSoDaoTao: item?.danhSachCoSoDaoTao?.map((coSo) => coSo?._id),
              })),
            });
          } else {
            postDotTuyenSinhModel({
              ...values,
              moTa: values?.moTa?.text,
              cauHinhPhuongThuc: {},
              yeuCauTraPhi,
              choPhepDangKyKhacCoSo,
              thongTinGiayToNopOnline: danhSachGiayToNopOnline,
              thongTinGiayToNopHoSo: danhSachGiayToNopHoSo,
              danhSachNganhTuyenSinh: danhSachNganh?.map((item) => ({
                ...item,
                nganh: item.nganh._id,
                danhSachCoSoDaoTao: item.danhSachCoSoDaoTao.map((coSo) => coSo._id),
              })),
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
          <Col xs={8}>
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
          {/* <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.maThanhToanDot}
              name="maThanhToanDot"
              label="Mã thanh toán đợt"
              rules={[...rules.required]}
            >
              <Input placeholder="Mã thanh toán đợt" />
            </Form.Item>
          </Col> */}
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
              initialValue={record?.phuongThucTuyenSinh?._id}
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
            <Form.Item
              name="danhSachDoiTuongTuyenSinh"
              label="Đối tượng tuyển sinh"
              initialValue={record?.danhSachDoiTuongTuyenSinh?.map((item) => item.maDoiTuong)}
              rules={[...rules.required]}
            >
              <Select
                mode="multiple"
                notFoundContent="Bạn chưa chọn hình thức đào tạo hoặc không có đối tượng tuyển sinh nào cho hình thức đào tạo này"
                placeholder="Đối tượng tuyển sinh"
                options={danhSachDoiTuongTuyenSinh?.map((item) => ({
                  value: item.maDoiTuong,
                  label: item.tenDoiTuong,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Danh sách ngành tuyển sinh">
              <TableNganh />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Danh sách giấy tờ nộp hồ sơ">
              <TableGiayTo fieldName="danhSachGiayToNopHoSo" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name={'moTa'}
              label={`Mô tả`}
              initialValue={{ text: record?.moTa || '' }}
              rules={[...rules.textEditor]}
            >
              <TinyEditor height={350} />
            </Form.Item>
          </Col>
          {[
            { name: 'thoiGianMoDangKy', label: 'Thời gian mở đăng ký' },
            { name: 'thoiGianKetThucNopHoSo', label: 'Thời gian kết thúc nộp hồ sơ' },
            // {
            //   name: 'thoiGianBatDauKhaiBaoKetQuaThiTHPT',
            //   label: 'Thời gian bắt đầu khai báo KQ thi THPT',
            // },
            // {
            //   name: 'thoiGianKetThucKhaiBaoKetQuaThiTHPT',
            //   label: 'Thời gian kết thúc khai báo KQ thi THPT',
            // },
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
          <Col lg={12}>
            <Form.Item
              label="Số lượng nguyện vọng tối đa"
              name={'soLuongNguyenVongToiDa'}
              initialValue={record?.soLuongNguyenVongToiDa}
            >
              <InputNumber
                min={1}
                max={1000}
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 0]}>
          <Col lg={12}>
            <Form.Item name={'yeuCauTraPhi'} initialValue={record?.yeuCauTraPhi ?? false}>
              <Checkbox
                checked={yeuCauTraPhi}
                onChange={(e) => {
                  setYeuCauTraPhi(e.target.checked);
                }}
              />{' '}
              Cho phép thanh toán
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              name={'choPhepDangKyKhacCoSo'}
              initialValue={record?.choPhepDangKyKhacCoSo ?? false}
            >
              <Checkbox
                checked={choPhepDangKyKhacCoSo}
                onChange={(e) => {
                  setChoPhepDangKyKhacCoSo(e.target.checked);
                }}
              />{' '}
              Cho phép đăng ký khác cơ sở
            </Form.Item>
          </Col>
          {yeuCauTraPhi && (
            <>
              <Col md={12}>
                <Form.Item
                  name="mucLePhi"
                  label="Mức lệ phí"
                  rules={[...rules.required]}
                  initialValue={recordProduct?.currentPrice?.unitAmount}
                >
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                    placeholder="Mức lệ phí"
                    max={10000000}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="donViTinh"
                  label="Đơn vị tính"
                  initialValue={recordProduct?.unitLabel}
                  rules={[...rules.required]}
                >
                  <Select
                    options={Object.values(EDonViTinh).map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    placeholder="Đơn vị tính"
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Col lg={12}>
            <Form.Item name={'gioiHanDoiTuong'} initialValue={record?.gioiHanDoiTuong ?? false}>
              <Checkbox
                checked={gioiHanDoiTuong}
                onChange={(e) => {
                  setGioiHanDoiTuong(e.target.checked);
                }}
              />{' '}
              Giới hạn đối tượng
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              name={'suDungToHopMongMuon'}
              initialValue={record?.suDungToHopMongMuon ?? false}
            >
              <Checkbox
                checked={suDungToHopMongMuon}
                onChange={(e) => {
                  setSuDungToHopMongMuon(e.target.checked);
                }}
              />{' '}
              Sử dụng tổ hợp mong muốn
            </Form.Item>
          </Col>
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
