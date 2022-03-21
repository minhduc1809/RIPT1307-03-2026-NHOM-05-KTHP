import DiaChi from '@/components/DiaChi';
import { FormItem } from '@/components/FormItem';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
mm.tz.setDefault('Asia/Ho_Chi_Minh');

const KhaiBaoThongTinCaNhan = () => {
  const [form] = Form.useForm();
  const { recordHoSo, putMyThongTinThiSinhModel } = useModel('hosoxettuyen');
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
          if (values.loaiNoiSinh === 'TRONG_NUOC') {
            values.noiSinhTrongNuoc = {
              tenTP: tenTinhNoiSinh,
              maTP: values?.noiSinhTrongNuoc,
            };
          }
          values.hoKhauThuongTru = {
            ...values.hoKhauThuongTru,
            tenTP: tenTinhHoKhauThuongTru,
            tenQH: tenQuanHuyenHoKhauThuongTru,
            tenXaPhuong: tenPhuongXaHoKhauThuongTru,
          };
          values.diaChiLienHe = {
            ...values.diaChiLienHe,
            tenTP: tenTinhDiaChiLienHe,
            tenQH: tenQuanHuyenDiaChiLienHe,
            tenXaPhuong: tenPhuongXaDiaChiLienHe,
          };
          putMyThongTinThiSinhModel(recordHoSo?._id ?? '', { thongTinThiSinh: values });
        }}
      >
        <Divider plain>
          <strong>Thông tin cơ bản</strong>
        </Divider>
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={8}>
            <Row gutter={[10, 0]}>
              <Col span={14}>
                <FormItem
                  rules={[...rules.required, ...rules.ten]}
                  initialValue={recordHoSo?.thongTinThiSinh?.hoDem}
                  label="Họ đệm"
                  name="hoDem"
                >
                  <Input placeholder="Nhập họ và tên" />
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  rules={[...rules.required, ...rules.ten]}
                  initialValue={recordHoSo?.thongTinThiSinh?.ten}
                  label="Tên"
                  name="ten"
                >
                  <Input placeholder="Nhập họ và tên" />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.CMND]}
              initialValue={recordHoSo?.thongTinThiSinh?.cmtCccd}
              label="Số CMT/CCCD"
              name="cmtCccd"
            >
              <Input placeholder="Nhập số CMT/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required]}
              initialValue={
                recordHoSo?.thongTinThiSinh?.ngayCapCmtCccd
                  ? moment(recordHoSo?.thongTinThiSinh?.ngayCapCmtCccd)
                  : undefined
              }
              name="ngayCapCmtCccd"
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
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.noiCapCmtCccd}
              label="Nơi cấp"
              name="noiCapCmtCccd"
            >
              <Input placeholder="Nhập nơi cấp CMT/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.email]}
              initialValue={recordHoSo?.thongTinThiSinh?.email}
              label="Email"
              name="email"
            >
              <Input placeholder="Nhập email" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required, ...rules.soDienThoai]}
              initialValue={recordHoSo?.thongTinThiSinh?.soDienThoai}
              label="Số điện thoại"
              name="soDienThoai"
            >
              <Input placeholder="Nhập số điện thoại" />
            </FormItem>
          </Col>
        </Row>

        <Divider plain>
          <strong>Thông tin bổ sung</strong>
        </Divider>
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required]}
              initialValue={
                recordHoSo?.thongTinThiSinh?.ngaySinh
                  ? moment(recordHoSo?.thongTinThiSinh?.ngaySinh)
                  : undefined
              }
              name="ngaySinh"
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
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.gioiTinh}
              label="Giới tính"
              name="gioiTinh"
            >
              <Select placeholder="Giới tính">
                {['Nam', 'Nữ', 'Khác'].map((item, index) => (
                  <Select.Option key={item} value={index}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.danToc ?? 'Kinh'}
              label="Dân tộc"
              name="danToc"
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
          <Col xs={24} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.quocTich ?? 'Việt Nam'}
              label="Quốc tịch"
              name="quocTich"
            >
              <Input placeholder="Nhập quốc tịch" />
            </FormItem>
          </Col>
          <Col xs={24} lg={6}>
            <FormItem
              rules={[...rules.required]}
              initialValue={recordHoSo?.thongTinThiSinh?.tonGiao ?? 'Không'}
              label="Tôn giáo"
              name="tonGiao"
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
          <Col xs={24} lg={12}>
            <Row gutter={[10, 0]}>
              <Col span={8}>
                <FormItem
                  rules={[...rules.required]}
                  initialValue={recordHoSo?.thongTinThiSinh?.loaiNoiSinh ?? 'TRONG_NUOC'}
                  label="Nơi sinh"
                  name="loaiNoiSinh"
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
              <Col span={16}>
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
                    name="noiSinhTrongNuoc"
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
                    name="noiSinhNuocNgoai"
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
                  tinh: ['hoKhauThuongTru', 'maTP'],
                  quanHuyen: ['hoKhauThuongTru', 'maQH'],
                  xaPhuong: ['hoKhauThuongTru', 'maXaPhuong'],
                  diaChiCuThe: ['hoKhauThuongTru', 'diaChi'],
                }}
                setTen={{
                  setTenTinh: setTenTinhHoKhauThuongTru,
                  setTenQuanHuyen: setTenQuanHuyenHoKhauThuongTru,
                  setTenXaPhuong: setTenXaPhuongHoKhauThuongTru,
                }}
              />
            </FormItem>
          </Col>
          <Divider plain>
            <strong>Thông tin liên hệ</strong>
          </Divider>
          <Col xs={24} lg={12}>
            <FormItem
              rules={[...rules.required, ...rules.ten]}
              initialValue={recordHoSo?.thongTinThiSinh?.tenNguoiLienHe}
              label="Tên người liên hệ"
              name="tenNguoiLienHe"
            >
              <Input placeholder="Nhập tên người liên hệ" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              rules={[...rules.required, ...rules.soDienThoai]}
              initialValue={recordHoSo?.thongTinThiSinh?.soDienThoaiNguoiLienHe}
              label="SĐT người liên hệ"
              name="soDienThoaiNguoiLienHe"
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
                  tinh: ['diaChiLienHe', 'maTP'],
                  quanHuyen: ['diaChiLienHe', 'maQH'],
                  xaPhuong: ['diaChiLienHe', 'maXaPhuong'],
                  diaChiCuThe: ['diaChiLienHe', 'diaChi'],
                }}
                setTen={{
                  setTenTinh: setTenTinhDiaChiLienHe,
                  setTenQuanHuyen: setTenQuanHuyenDiaChiLienHe,
                  setTenXaPhuong: setTenXaPhuongDiaChiLienHe,
                }}
              />
            </FormItem>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            icon={<ArrowRightOutlined />}
            loading={false}
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

export default KhaiBaoThongTinCaNhan;
