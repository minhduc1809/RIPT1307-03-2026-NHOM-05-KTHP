import DiaChi from '@/components/DiaChi';
import { FormItem } from '@/components/FormItem';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
mm.tz.setDefault('Asia/Ho_Chi_Minh');

const KhaiBaoThongTinCaNhan = () => {
  const [form] = Form.useForm();
  const { recordHoSo } = useModel('hosoxettuyen');
  const { danhSachDanToc, danhSachTonGiao } = useModel('dantoctongiao');
  const { danhSachTinh } = useModel('donvihanhchinh');
  const [loaiNoiSinh, setLoaiNoiSinh] = useState<'TRONG_NUOC' | 'NUOC_NGOAI'>(
    recordHoSo?.thongTinThiSinh?.loaiNoiSinh ?? 'TRONG_NUOC',
  );
  const [tenTinhNoiSinh, setTenTinhNoiSinh] = useState<string>(
    recordHoSo?.thongTinThiSinh?.noiSinhTrongNuoc?.tenTP ?? '',
  );
  const [tenTinhHoKhauThuongTru, setTenTinhHoKhauThuongTru] = useState<string>(
    recordHoSo?.thongTinThiSinh?.hoKhauThuongTru?.tenTP ?? '',
  );
  const [tenQuanHuyenHoKhauThuongTru, setTenQuanHuyenHoKhauThuongTru] = useState<string>();
  const [tenPhuongXaHoKhauThuongTru, setTenXaPhuongHoKhauThuongTru] = useState<string>();

  useEffect(() => form.resetFields(), [recordHoSo?._id]);
  return (
    <Card bodyStyle={{ paddingTop: 0 }} bordered>
      <Form scrollToFirstError labelCol={{ span: 24 }} form={form} onFinish={(value) => {}}>
        <Divider plain>
          <strong>Thông tin cơ bản</strong>
        </Divider>
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={8}>
            <Row gutter={[10, 0]}>
              <Col span={14}>
                <FormItem
                  initialValue={recordHoSo?.thongTinThiSinh?.hoDem}
                  label="Họ đệm"
                  name="hoDem"
                >
                  <Input placeholder="Nhập họ và tên" />
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem initialValue={recordHoSo?.thongTinThiSinh?.ten} label="Tên" name="ten">
                  <Input placeholder="Nhập họ và tên" />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              initialValue={recordHoSo?.thongTinThiSinh?.cmtCccd}
              label="Số CMT/CCCD"
              name="cmtCccd"
            >
              <Input placeholder="Nhập số CMT/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
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
              initialValue={recordHoSo?.thongTinThiSinh?.noiCapCmtCccd}
              label="Nơi cấp"
              name="noiCapCmtCccd"
            >
              <Input placeholder="Nhập nơi cấp CMT/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem initialValue={recordHoSo?.thongTinThiSinh?.email} label="Email" name="email">
              <Input placeholder="Nhập email" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
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
              initialValue={recordHoSo?.thongTinThiSinh?.danToc}
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
              initialValue={recordHoSo?.thongTinThiSinh?.quocTich}
              label="Quốc tịch"
              name="quocTich"
            >
              <Input placeholder="Nhập quốc tịch" />
            </FormItem>
          </Col>
          <Col xs={24} lg={6}>
            <FormItem
              initialValue={recordHoSo?.thongTinThiSinh?.tonGiao}
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
                  <FormItem label={<div />} name="noiSinh">
                    <Select placeholder="Chọn tỉnh/thành phố">
                      {danhSachTinh?.map((item) => (
                        <Select.Option key={item.tenDonVi} value={item.tenDonVi}>
                          {item.tenDonVi}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                ) : (
                  <FormItem label={<div />} name="noiSinhNuocNgoai">
                    <Input placeholder="Nhập nơi sinh" />
                  </FormItem>
                )}
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <FormItem label="Địa chỉ thường trú">
              <DiaChi
                form={form}
                fields={{
                  tinh: ['diaChi', 'maTinh'],
                  quanHuyen: ['diaChi', 'maQuanHuyen'],
                  xaPhuong: ['diaChi', 'maPhuongXa'],
                  diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
                }}
                setTen={{
                  setTenTinh: setTenTinhHoKhauThuongTru,
                  setTenQuanHuyen: setTenQuanHuyenHoKhauThuongTru,
                  setTenXaPhuong: setTenXaPhuongHoKhauThuongTru,
                }}
              />
            </FormItem>
          </Col>
          <Col xs={24} lg={8} />
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
