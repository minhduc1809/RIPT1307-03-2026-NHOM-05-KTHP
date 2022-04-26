import TinyEditor from '@/components/TinyEditor/Tiny';
import Upload from '@/components/Upload/UploadMultiFile';
import type { NamTuyenSinh } from '@/services/NamTuyenSinh/typings';
import {
  EDonViTinh,
  EHinhThucThanhToan,
  ELoaiDot,
  MapKeyHinhThucThanhToan,
} from '@/utils/constants';
import rules from '@/utils/rules';
import { checkFileSize, renderFileListUrlWithName, uploadMultiFile } from '@/utils/utils';
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
import TableDoiTuong from './TableDoiTuong';
import TableGiayTo from './TableGiayTo';
import TableHDSD from './TableHDSD';
import TableNganh from './TableNganh';
import TableKhaiThongTinNhapHoc from './TableThongTinKhaiNhapHoc';

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
    danhSachGiayToXacNhanNhapHoc,
    danhSachNganh,
    danhSachThongTinKhaiXacNhan,
    danhSachDoiTuong,
    danhSachHDSD,
    setDanhSachDoiTuong,
  } = useModel('dottuyensinh');
  const { danhSach } = useModel('namtuyensinh');
  const { record: recordProduct } = useModel('thanhtoan');
  const { danhSach: danhSachHinhThucDaoTao } = useModel('hinhthucdaotao');
  const [recordNamTuyenSinh, setRecordNamTuyenSinh] = useState<NamTuyenSinh.Record | undefined>(
    danhSach?.find((item) => item.nam === record?.namTuyenSinh),
  );
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<string>(record?.hinhThucDaoTao?._id ?? '');
  const [yeuCauTraPhi, setYeuCauTraPhi] = useState<boolean>(record?.yeuCauTraPhi ?? false);
  const [gioiHanDoiTuong, setGioiHanDoiTuong] = useState<boolean>(record?.gioiHanDoiTuong ?? false);
  const [loaiDot, setLoaiDot] = useState<ELoaiDot | undefined>(record?.loaiDot);
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState<EHinhThucThanhToan>(
    record?.hinhThucThanhToan ?? EHinhThucThanhToan.BIDV_SMART_BANKING,
  );
  const [suDungToHopMongMuon, setSuDungToHopMongMuon] = useState<boolean>(
    record?.suDungToHopMongMuon ?? false,
  );
  const [choPhepDangKyKhacCoSo, setChoPhepDangKyKhacCoSo] = useState<boolean>(
    record?.choPhepDangKyKhacCoSo ?? false,
  );

  const [choPhepGiaLapTheoCoSo, setChoPhepGiaLapTheoCoSo] = useState<boolean>(
    record?.choPhepGiaLapTheoCoSo ?? false,
  );

  const [choPhepHK1HoacCaNamLop12, setChoPhepHK1HoacCaNamLop12] = useState<boolean>(
    record?.choPhepHK1HoacCaNamLop12 ?? false,
  );

  const [choPhepThiSinhMoKhoa, setChoPhepThiSinhMoKhoa] = useState<boolean>(
    record?.choPhepThiSinhMoKhoa ?? false,
  );

  const [danhSachIdPhuongThuc, setDanhSachIdPhuongThuc] = useState<string[]>(
    record?.danhSachPhuongThucTuyenSinh?.map((item) => item._id) ?? [],
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
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt tuyển sinh`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const checkSize = checkFileSize(values?.mauPhieuDangKy?.fileList ?? []);
          if (!checkSize) return;
          const mauPhieuDangKy = await uploadMultiFile(
            values?.mauPhieuDangKy?.fileList ?? [],
            true,
            false,
          );
          if (edit) {
            putDotTuyenSinhModel(record?._id ?? '', {
              ...record,
              ...values,
              mauPhieuDangKy: mauPhieuDangKy?.[0]?.file?.id || record?.mauPhieuDangKy?.id,
              moTa: values?.moTa?.text,
              huongDanThanhToan: values?.huongDanThanhToan?.text,
              cauHinhPhuongThuc: {},
              yeuCauTraPhi,
              choPhepDangKyKhacCoSo,
              choPhepGiaLapTheoCoSo,
              gioiHanDoiTuong,
              suDungToHopMongMuon,
              choPhepHK1HoacCaNamLop12,
              choPhepThiSinhMoKhoa,
              thongTinGiayToNopOnline: danhSachGiayToNopOnline,
              thongTinGiayToNopHoSo: danhSachGiayToNopHoSo,
              danhSachDoiTuongTuyenSinh: danhSachDoiTuong,
              danhSachGiayToXacNhanNhapHoc,
              danhSachThongTinKhaiXacNhan,
              danhSachHuongDanSuDung: danhSachHDSD,
              danhSachNganhTuyenSinh: danhSachNganh?.map((item) => ({
                ...item,
                nganh: item?.nganh?._id,
                danhSachCoSoDaoTao: item?.danhSachCoSoDaoTao?.map((coSo) => coSo?._id),
              })),
            });
          } else {
            postDotTuyenSinhModel({
              ...values,
              mauPhieuDangKy: mauPhieuDangKy?.[0]?.file?.id,
              moTa: values?.moTa?.text,
              huongDanThanhToan: values?.huongDanThanhToan?.text,
              cauHinhPhuongThuc: {},
              yeuCauTraPhi,
              choPhepDangKyKhacCoSo,
              choPhepGiaLapTheoCoSo,
              thongTinGiayToNopOnline: danhSachGiayToNopOnline,
              thongTinGiayToNopHoSo: danhSachGiayToNopHoSo,
              danhSachGiayToXacNhanNhapHoc,
              danhSachThongTinKhaiXacNhan,
              danhSachHuongDanSuDung: danhSachHDSD,
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
          <Col xs={24} md={12} lg={6}>
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
                  setDanhSachDoiTuong(
                    record?.danhSachDoiTuongTuyenSinh?.filter(
                      (item) => item.thongTinDoiTuong?.hinhThucDaoTao === val,
                    ) ?? [],
                  );
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
          <Col xs={24} md={12} lg={6}>
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

          <Col xs={24} md={12} lg={6}>
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
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              initialValue={record?.loaiDot}
              name="loaiDot"
              label="Loại đợt"
              rules={[...rules.required]}
            >
              <Select
                onChange={(val) => setLoaiDot(val)}
                placeholder="Chọn loại đợt"
                options={Object.values(ELoaiDot)?.map((item) => ({ value: item, label: item }))}
              />
            </Form.Item>
          </Col>
          {loaiDot === ELoaiDot.KHAC && (
            <>
              <Col xs={24}>
                <Form.Item
                  name={'urlRedirectLoaiDot'}
                  label="Url loại đợt"
                  initialValue={record?.urlRedirectLoaiDot}
                >
                  <Input placeholder="Nhập url nếu có" />
                </Form.Item>
              </Col>
            </>
          )}
          <Col xs={24}>
            <Form.Item
              name="danhSachPhuongThucTuyenSinh"
              label="Phương thức tuyển sinh"
              initialValue={record?.danhSachPhuongThucTuyenSinh?.map((item) => item?._id)}
              rules={[...rules.required]}
            >
              <Select
                onChange={(val) => setDanhSachIdPhuongThuc(val)}
                mode="multiple"
                notFoundContent="Bạn chưa chọn năm tuyển sinh"
                placeholder="Phương thức tuyển sinh"
                options={recordNamTuyenSinh?.danhSachPhuongThuc?.map((item) => ({
                  value: item.phuongThucTuyenSinh._id,
                  label: item.phuongThucTuyenSinh.tenPhuongThuc,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Danh sách đối tượng tuyển sinh">
              <TableDoiTuong
                danhSachPhuongThuc={
                  recordNamTuyenSinh?.danhSachPhuongThuc
                    ?.filter((item) =>
                      danhSachIdPhuongThuc?.includes(item?.phuongThucTuyenSinh?._id),
                    )
                    ?.map((item) => item?.phuongThucTuyenSinh) ?? []
                }
                hinhThucDaoTao={hinhThucDaoTao}
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
          <Col span={24}>
            <Form.Item label="Danh sách giấy tờ nộp onlline">
              <TableGiayTo fieldName="danhSachGiayToNopOnline" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Danh sách giấy tờ xác nhận nhập học">
              <TableGiayTo fieldName="danhSachGiayToXacNhanNhapHoc" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Danh sách thông tin khai nhập học">
              <TableKhaiThongTinNhapHoc />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Danh sách hướng dẫn sử dụng">
              <TableHDSD />
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
                placeholder="Nhập số lượng nguyện vọng tối đa nếu có"
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
                  if (e.target.checked) {
                    setChoPhepGiaLapTheoCoSo(false);
                  }
                }}
              />{' '}
              Cho phép đăng ký khác cơ sở
            </Form.Item>
          </Col>
          {yeuCauTraPhi && (
            <>
              <Col md={8}>
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
              <Col md={8}>
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
              <Col md={8}>
                <Form.Item
                  name="hinhThucThanhToan"
                  label="Hình thức thanh toán"
                  initialValue={record?.hinhThucThanhToan}
                  rules={[...rules.required]}
                >
                  <Select
                    onChange={(val) => setHinhThucThanhToan(val)}
                    options={Object.keys(EHinhThucThanhToan).map((item) => ({
                      value: item,
                      label: MapKeyHinhThucThanhToan[item],
                    }))}
                    placeholder="Hình thức thanh toán"
                  />
                </Form.Item>
              </Col>
              {hinhThucThanhToan === EHinhThucThanhToan.TRUYEN_THONG && (
                <Col xs={24}>
                  <Form.Item
                    name={'huongDanThanhToan'}
                    label={`Hướng dẫn thanh toán`}
                    initialValue={{ text: record?.huongDanThanhToan || '' }}
                    // rules={[...rules.textEditor]}
                  >
                    <TinyEditor height={350} />
                  </Form.Item>
                </Col>
              )}
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
          <Col lg={12}>
            <Form.Item
              name={'choPhepHK1HoacCaNamLop12'}
              initialValue={record?.choPhepHK1HoacCaNamLop12 ?? false}
            >
              <Checkbox
                checked={choPhepHK1HoacCaNamLop12}
                onChange={(e) => {
                  setChoPhepHK1HoacCaNamLop12(e.target.checked);
                }}
              />{' '}
              Cho phép HK1 hoặc cả năm Lớp 12
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              name={'choPhepThiSinhMoKhoa'}
              initialValue={record?.choPhepThiSinhMoKhoa ?? false}
            >
              <Checkbox
                checked={choPhepThiSinhMoKhoa}
                onChange={(e) => {
                  setChoPhepThiSinhMoKhoa(e.target.checked);
                }}
              />{' '}
              Cho phép thí sinh mở khóa hồ sơ
            </Form.Item>
          </Col>
          {!choPhepDangKyKhacCoSo && (
            <Col lg={24}>
              <Form.Item
                name={'choPhepGiaLapTheoCoSo'}
                initialValue={record?.choPhepGiaLapTheoCoSo ?? false}
              >
                <Checkbox
                  checked={choPhepGiaLapTheoCoSo}
                  onChange={(e) => {
                    setChoPhepGiaLapTheoCoSo(e.target.checked);
                  }}
                />{' '}
                Cho phép giả lập theo cơ sở
              </Form.Item>
            </Col>
          )}
          <Col lg={24}>
            <Form.Item
              // rules={[...rules.fileRequired]}
              initialValue={renderFileListUrlWithName(
                record?.mauPhieuDangKy?.url ?? '',
                record?.mauPhieuDangKy?.filename ?? '',
              )}
              label="Mẫu phiếu đăng ký"
              name="mauPhieuDangKy"
            >
              <Upload
                otherProps={{
                  accept: 'application/pdf, .doc, .docx',
                  multiple: false,
                  showUploadList: { showDownloadIcon: false },
                }}
                limit={1}
              />
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
