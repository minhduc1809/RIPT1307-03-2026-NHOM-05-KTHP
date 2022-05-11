import DiaChi from '@/components/DiaChi';
import { FormItem } from '@/components/FormItem';
import { EThanhPhanXuatThan } from '@/utils/constants';
import rules from '@/utils/rules';
import { includes, toISOString } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableThongTinGiaDinh from './components/TableThongTinGiaDinh';
mm.tz.setDefault('Asia/Ho_Chi_Minh');

const LyLichSinhVien = () => {
  const [form] = Form.useForm();
  const { putMyKetQuaXetTuyenLyLichModel, loading } = useModel('ketquaxettuyen');
  const { record: recordHoSo } = useModel('ketquaxettuyen');
  const { danhSachDanToc, danhSachTonGiao } = useModel('dantoctongiao');
  const { danhSachTinh } = useModel('donvihanhchinh');
  const [loaiNoiSinh, setLoaiNoiSinh] = useState<'TRONG_NUOC' | 'NUOC_NGOAI'>('TRONG_NUOC');
  const [tenTinhNoiSinh, setTenTinhNoiSinh] = useState<string>('');
  const [tenTinhHoKhauThuongTru, setTenTinhHoKhauThuongTru] = useState<string>('');
  const [tenQuanHuyenHoKhauThuongTru, setTenQuanHuyenHoKhauThuongTru] = useState<string>('');
  const [tenPhuongXaHoKhauThuongTru, setTenXaPhuongHoKhauThuongTru] = useState<string>('');

  const [tenTinhDiaChiLienHe, setTenTinhDiaChiLienHe] = useState<string>('');
  const [tenQuanHuyenDiaChiLienHe, setTenQuanHuyenDiaChiLienHe] = useState<string>('');
  const [tenPhuongXaDiaChiLienHe, setTenXaPhuongDiaChiLienHe] = useState<string>('');

  useEffect(() => {
    form.resetFields();
    setTenXaPhuongDiaChiLienHe(recordHoSo?.thongTinThiSinh?.diaChiLienHe?.tenXaPhuong ?? '');
    setTenQuanHuyenDiaChiLienHe(recordHoSo?.thongTinThiSinh?.diaChiLienHe?.tenQH ?? '');
    setTenTinhDiaChiLienHe(recordHoSo?.thongTinThiSinh?.diaChiLienHe?.tenTP ?? '');
    setTenXaPhuongHoKhauThuongTru(recordHoSo?.thongTinThiSinh?.hoKhauThuongTru?.tenXaPhuong ?? '');
    setTenQuanHuyenHoKhauThuongTru(recordHoSo?.thongTinThiSinh?.hoKhauThuongTru?.tenQH ?? '');
    setTenTinhHoKhauThuongTru(recordHoSo?.thongTinThiSinh?.hoKhauThuongTru?.tenTP ?? '');
    setTenTinhNoiSinh(recordHoSo?.thongTinThiSinh?.noiSinhTrongNuoc?.tenTP ?? '');
    setLoaiNoiSinh(recordHoSo?.thongTinThiSinh?.loaiNoiSinh ?? 'TRONG_NUOC');
    window.scroll({ top: 0 });
  }, [recordHoSo?._id]);

  return (
    <Card bodyStyle={{ paddingTop: 0 }} bordered>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        form={form}
        onFinish={async (values) => {
          if (values.thongTinThiSinh.loaiNoiSinh === 'TRONG_NUOC') {
            values.thongTinThiSinh.noiSinhTrongNuoc = {
              tenTP: tenTinhNoiSinh,
              maTP: values?.thongTinThiSinh?.noiSinhTrongNuoc,
            };
          }
          values.thongTinThiSinh.hoKhauThuongTru = {
            ...values.thongTinThiSinh.hoKhauThuongTru,
            tenTP: tenTinhHoKhauThuongTru,
            tenQH: tenQuanHuyenHoKhauThuongTru,
            tenXaPhuong: tenPhuongXaHoKhauThuongTru,
          };
          values.thongTinThiSinh.diaChiLienHe = {
            ...values.thongTinThiSinh.diaChiLienHe,
            tenTP: tenTinhDiaChiLienHe,
            tenQH: tenQuanHuyenDiaChiLienHe,
            tenXaPhuong: tenPhuongXaDiaChiLienHe,
          };
          values.thongTinThiSinh.ngaySinh = toISOString(values?.thongTinThiSinh?.ngaySinh);
          putMyKetQuaXetTuyenLyLichModel(recordHoSo?._id ?? '', { ...recordHoSo, ...values });
        }}
      >
        <Divider plain>
          <strong>Thông tin cơ bản</strong>
        </Divider>
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={8}>
            <Row gutter={[10, 0]}>
              <Col xs={24} md={12} lg={14}>
                <FormItem
                  rules={[...rules.required, ...rules.ten]}
                  initialValue={recordHoSo?.thongTinThiSinh?.hoDem}
                  label="Họ đệm"
                  name={['thongTinThiSinh', 'hoDem']}
                >
                  <Input placeholder="Nhập họ và tên" />
                </FormItem>
              </Col>
              <Col xs={24} md={12} lg={10}>
                <FormItem
                  rules={[...rules.required, ...rules.ten]}
                  initialValue={recordHoSo?.thongTinThiSinh?.ten}
                  label="Tên"
                  name={['thongTinThiSinh', 'ten']}
                >
                  <Input placeholder="Nhập họ và tên" />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.CMND]}
              initialValue={recordHoSo?.thongTinThiSinh?.cmtCccd}
              label="Số CMND/CCCD"
              name={['thongTinThiSinh', 'cmtCccd']}
            >
              <Input placeholder="Nhập số CMND/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FormItem
              rules={[...rules.required]}
              initialValue={
                recordHoSo?.thongTinThiSinh?.ngayCapCmtCccd
                  ? moment(recordHoSo?.thongTinThiSinh?.ngayCapCmtCccd)
                  : undefined
              }
              name={['thongTinThiSinh', 'ngayCapCmtCccd']}
              label="Ngày cấp"
            >
              <DatePicker
                placeholder="Ngày cấp DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.text]}
              initialValue={recordHoSo?.thongTinThiSinh?.noiCapCmtCccd}
              label="Nơi cấp"
              name={['thongTinThiSinh', 'noiCapCmtCccd']}
            >
              <Input placeholder="Nhập nơi cấp CMND/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.email]}
              initialValue={recordHoSo?.thongTinThiSinh?.email}
              label="Email"
              name={['thongTinThiSinh', 'email']}
            >
              <Input placeholder="Nhập email" />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.soDienThoai]}
              initialValue={recordHoSo?.thongTinThiSinh?.soDienThoai}
              label="Số điện thoại"
              name={['thongTinThiSinh', 'soDienThoai']}
            >
              <Input placeholder="Nhập số điện thoại" />
            </FormItem>
          </Col>
        </Row>

        <Divider plain>
          <strong>Thông tin bổ sung</strong>
        </Divider>
        <Row gutter={[10, 0]}>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={
                recordHoSo?.thongTinThiSinh?.ngaySinh
                  ? moment(recordHoSo?.thongTinThiSinh?.ngaySinh)
                  : undefined
              }
              name={['thongTinThiSinh', 'ngaySinh']}
              label="Ngày sinh"
            >
              <DatePicker
                placeholder="Ngày sinh DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.gioiTinh}
              label="Giới tính"
              name={['thongTinThiSinh', 'gioiTinh']}
            >
              <Select placeholder="Giới tính">
                {['Nam', 'Nữ', 'Khác'].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.danToc ?? 'Kinh'}
              label="Dân tộc"
              name={['thongTinThiSinh', 'danToc']}
            >
              <Select showSearch placeholder="Dân tộc">
                {danhSachDanToc.map((item) => (
                  <Select.Option key={item.tenDanToc} value={item.tenDanToc}>
                    {item.tenDanToc}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.text]}
              initialValue={recordHoSo?.thongTinThiSinh?.soTheBHYT}
              label="Số thẻ BHYT"
              name={['thongTinThiSinh', 'soTheBHYT']}
            >
              <Input placeholder="Số thẻ BHYT" />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.quocTich ?? 'Việt Nam'}
              label="Quốc tịch"
              name={['thongTinThiSinh', 'quocTich']}
            >
              <Input placeholder="Nhập quốc tịch" />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.tonGiao ?? 'Không'}
              label="Tôn giáo"
              name={['thongTinThiSinh', 'tonGiao']}
            >
              <Select placeholder="Tôn giáo">
                {danhSachTonGiao.map((item) => (
                  <Select.Option key={item.tenTonGiao} value={item.tenTonGiao}>
                    {item.tenTonGiao}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <Row gutter={[10, 0]}>
              <Col xs={12} md={8}>
                <FormItem
                  rules={[...rules.required]}
                  initialValue={recordHoSo?.thongTinThiSinh?.loaiNoiSinh ?? 'TRONG_NUOC'}
                  label={'Nơi sinh'}
                  name={['thongTinThiSinh', 'loaiNoiSinh']}
                >
                  <Select
                    onChange={(val) => setLoaiNoiSinh(val)}
                    placeholder="Loại nơi sinh"
                    options={[
                      { value: 'TRONG_NUOC', label: 'Trong nước' },
                      { value: 'NUOC_NGOAI', label: 'Nước ngoài' },
                    ]}
                  />
                </FormItem>
              </Col>
              <Col xs={12} md={16}>
                {loaiNoiSinh === 'TRONG_NUOC' ? (
                  <FormItem
                    rules={[
                      {
                        validator: (_, value, callback) => {
                          if (!value) callback('');
                          callback();
                        },
                        message: 'Bắt buộc',
                      },
                    ]}
                    label={<div />}
                    name={['thongTinThiSinh', 'noiSinhTrongNuoc']}
                    initialValue={recordHoSo?.thongTinThiSinh?.noiSinhTrongNuoc?.maTP}
                  >
                    <Select
                      showSearch
                      filterOption={(value, option) => includes(option?.props.children, value)}
                      onChange={(val) =>
                        setTenTinhNoiSinh(
                          danhSachTinh?.find((item) => item.ma === val)?.tenDonVi ?? '',
                        )
                      }
                      placeholder="Chọn tỉnh/thành phố"
                    >
                      {danhSachTinh?.map((item) => (
                        <Select.Option key={item.tenDonVi} value={item.ma}>
                          {item.tenDonVi}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                ) : (
                  <FormItem
                    initialValue={recordHoSo?.thongTinThiSinh?.noiSinhNuocNgoai}
                    rules={[
                      {
                        validator: (_, value, callback) => {
                          if (!value) callback('');
                          callback();
                        },
                        message: 'Bắt buộc',
                      },
                    ]}
                    label={<div />}
                    name={['thongTinThiSinh', 'noiSinhNuocNgoai']}
                  >
                    <Input placeholder="Nhập nơi sinh" />
                  </FormItem>
                )}
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <FormItem
              label={
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      marginRight: 4,
                      color: '#ff4d4f',
                      fontSize: 14,
                      fontFamily: 'SimSun, sans-serif',
                      lineHeight: 1,
                    }}
                  >
                    *
                  </span>
                  <span> Hộ khẩu thường trú</span>
                </>
              }
            >
              <DiaChi
                type="HKTT"
                initialValue={recordHoSo?.thongTinThiSinh?.hoKhauThuongTru}
                form={form}
                fields={{
                  tinh: ['thongTinThiSinh', 'hoKhauThuongTru', 'maTP'],
                  quanHuyen: ['thongTinThiSinh', 'hoKhauThuongTru', 'maQH'],
                  xaPhuong: ['thongTinThiSinh', 'hoKhauThuongTru', 'maXaPhuong'],
                  diaChiCuThe: ['thongTinThiSinh', 'hoKhauThuongTru', 'diaChi'],
                }}
                setTen={{
                  setTenTinh: setTenTinhHoKhauThuongTru,
                  setTenQuanHuyen: setTenQuanHuyenHoKhauThuongTru,
                  setTenXaPhuong: setTenXaPhuongHoKhauThuongTru,
                }}
              />
            </FormItem>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <FormItem
              initialValue={recordHoSo?.thongTinThiSinh?.thanhPhanXuatThan}
              label="Thành phần xuất thân"
              name={['thongTinThiSinh', 'thanhPhanXuatThan']}
            >
              <Select
                placeholder="Thành phần xuất thân"
                options={Object.values(EThanhPhanXuatThan).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              initialValue={
                recordHoSo?.thongTinThiSinh?.ngayVaoDoan
                  ? moment(recordHoSo?.thongTinThiSinh.ngayVaoDoan)
                  : undefined
              }
              label="Ngày vào đoàn"
              name={['thongTinThiSinh', 'ngayVaoDoan']}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              initialValue={
                recordHoSo?.thongTinThiSinh?.ngayVaoDang
                  ? moment(recordHoSo?.thongTinThiSinh.ngayVaoDang)
                  : undefined
              }
              label="Ngày vào Đảng"
              name={['thongTinThiSinh', 'ngayVaoDang']}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <FormItem
              rules={[...rules.text]}
              initialValue={recordHoSo?.thongTinThiSinh?.facebook}
              label="Facebook"
              name={['thongTinThiSinh', 'facebook']}
            >
              <Input placeholder="Facebook" />
            </FormItem>
          </Col>
          <Divider plain>
            <strong>Thông tin liên hệ</strong>
          </Divider>
          <Col xs={24} md={12} lg={12}>
            <FormItem
              rules={[...rules.required, ...rules.ten]}
              initialValue={recordHoSo?.thongTinThiSinh?.tenNguoiLienHe}
              label="Tên người liên hệ"
              name={['thongTinThiSinh', 'tenNguoiLienHe']}
            >
              <Input placeholder="Nhập tên người liên hệ" />
            </FormItem>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <FormItem
              rules={[...rules.required, ...rules.soDienThoai]}
              initialValue={recordHoSo?.thongTinThiSinh?.soDienThoaiNguoiLienHe}
              label="SĐT người liên hệ"
              name={['thongTinThiSinh', 'soDienThoaiNguoiLienHe']}
            >
              <Input placeholder="Nhập SĐT người liên hệ" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              label={
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      marginRight: 4,
                      color: '#ff4d4f',
                      fontSize: 14,
                      fontFamily: 'SimSun, sans-serif',
                      lineHeight: 1,
                    }}
                  >
                    *
                  </span>
                  <span>Địa chỉ liên hệ</span>
                </>
              }
            >
              <DiaChi
                type="DCLH"
                initialValue={recordHoSo?.thongTinThiSinh?.diaChiLienHe}
                form={form}
                fields={{
                  tinh: ['thongTinThiSinh', 'diaChiLienHe', 'maTP'],
                  quanHuyen: ['thongTinThiSinh', 'diaChiLienHe', 'maQH'],
                  xaPhuong: ['thongTinThiSinh', 'diaChiLienHe', 'maXaPhuong'],
                  diaChiCuThe: ['thongTinThiSinh', 'diaChiLienHe', 'diaChi'],
                }}
                setTen={{
                  setTenTinh: setTenTinhDiaChiLienHe,
                  setTenQuanHuyen: setTenQuanHuyenDiaChiLienHe,
                  setTenXaPhuong: setTenXaPhuongDiaChiLienHe,
                }}
              />
            </FormItem>
          </Col>
          <Divider plain>
            <strong>Thông tin gia đình</strong>
          </Divider>
          <Col span={24}>
            <TableThongTinGiaDinh mode="handle" />
            <br />
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            icon={<ArrowRightOutlined />}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            Bước 2/4
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LyLichSinhVien;
