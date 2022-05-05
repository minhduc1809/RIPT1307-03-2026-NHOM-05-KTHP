import DiaChi from '@/components/DiaChi';
import { FormItem } from '@/components/FormItem';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { ELoaiThanhVien } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormThongTinGiaDinh = (props: { onCancel?: any }) => {
  const [form] = Form.useForm();
  const { recordGiaDinh, edit, record, setRecord } = useModel('ketquaxettuyen');
  const { danhSachDanToc, danhSachTonGiao } = useModel('dantoctongiao');
  const [tenTinhHoKhauThuongTru, setTenTinhHoKhauThuongTru] = useState<string>('');
  const [tenQuanHuyenHoKhauThuongTru, setTenQuanHuyenHoKhauThuongTru] = useState<string>('');
  const [tenPhuongXaHoKhauThuongTru, setTenXaPhuongHoKhauThuongTru] = useState<string>('');
  const [tenTinhDiaChiLienHe, setTenTinhDiaChiLienHe] = useState<string>('');
  const [tenQuanHuyenDiaChiLienHe, setTenQuanHuyenDiaChiLienHe] = useState<string>('');
  const [tenPhuongXaDiaChiLienHe, setTenXaPhuongDiaChiLienHe] = useState<string>('');

  const checkBoMe = (loaiThanhVien: ELoaiThanhVien): boolean => {
    if (edit && loaiThanhVien === recordGiaDinh?.loaiThanhVien) return true;
    if (![ELoaiThanhVien.BO, ELoaiThanhVien.ME].includes(loaiThanhVien)) return true;
    return !record?.thongTinGiaDinh?.map((item) => item.loaiThanhVien)?.includes(loaiThanhVien);
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        form={form}
        onFinish={(values) => {
          values.hoKhauThuongTru = {
            ...values.hoKhauThuongTru,
            tenTP: tenTinhHoKhauThuongTru,
            tenQH: tenQuanHuyenHoKhauThuongTru,
            tenXaPhuong: tenPhuongXaHoKhauThuongTru,
          };
          values.diaChiHienNay = {
            ...values.diaChiHienNay,
            tenTP: tenTinhDiaChiLienHe,
            tenQH: tenQuanHuyenDiaChiLienHe,
            tenXaPhuong: tenPhuongXaDiaChiLienHe,
          };
          const listGiaDinh = [...(record?.thongTinGiaDinh ?? [])];
          if (edit) {
            listGiaDinh.splice(recordGiaDinh?.index ? recordGiaDinh.index - 1 : 0, 1, {
              ...values,
            });
          } else {
            listGiaDinh.splice(0, 0, values);
          }
          setRecord({ ...record, thongTinGiaDinh: listGiaDinh } as KetQuaXetTuyen.Record);
          message.success('Lưu thành công');
          props?.onCancel();
        }}
      >
        <Row gutter={[10, 0]}>
          <Col span={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.loaiThanhVien}
              rules={[...rules.required]}
              name="loaiThanhVien"
              label="Quan hệ"
            >
              <Select
                placeholder="Quan hệ"
                options={Object.values(ELoaiThanhVien)
                  ?.filter((item) => checkBoMe(item))
                  .map((item) => ({
                    label: item,
                    value: item,
                  }))}
              />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.namSinh}
              rules={[...rules.required]}
              name="namSinh"
              label="Năm sinh"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1900}
                max={new Date().getFullYear()}
                placeholder="Năm sinh"
              />
            </FormItem>
          </Col>
          <Col xs={24} lg={14}>
            <FormItem
              initialValue={recordGiaDinh?.hoDem}
              rules={[...rules.required]}
              name="hoDem"
              label="Họ đệm"
            >
              <Input placeholder="Họ đệm" />
            </FormItem>
          </Col>
          <Col xs={24} lg={10}>
            <FormItem
              initialValue={recordGiaDinh?.ten}
              rules={[...rules.required]}
              name="ten"
              label="Tên"
            >
              <Input placeholder="Tên" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              initialValue={recordGiaDinh?.ngheNghiep}
              rules={[...rules.required]}
              name="ngheNghiep"
              label="Nghề nghiệp"
            >
              <Input.TextArea placeholder="Nghề nghiệp" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.soDienThoai}
              rules={[...rules.soDienThoai]}
              name="soDienThoai"
              label="Số điện thoại"
            >
              <Input placeholder="Số điện thoại" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.email}
              rules={[...rules.email]}
              name="email"
              label="Email"
            >
              <Input placeholder="Email" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              initialValue={recordGiaDinh?.coQuanCongTac}
              rules={[...rules.required]}
              name="coQuanCongTac"
              label="Cơ quan công tác"
            >
              <Input.TextArea placeholder="Cơ quan công tác" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.quocTich}
              rules={[...rules.required]}
              name="quocTich"
              label="Quốc tịch"
            >
              <Input placeholder="Quốc tịch" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.soTheBHYT}
              rules={[...rules.text]}
              name="soTheBHYT"
              label="Số thẻ BHYT"
            >
              <Input placeholder="Số thẻ BHYT" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.danToc}
              rules={[...rules.required]}
              name="danToc"
              label="Dân tộc"
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
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={recordGiaDinh?.tonGiao}
              rules={[...rules.required]}
              label="Tôn giáo"
              name={['tonGiao']}
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
                initialValue={recordGiaDinh?.hoKhauThuongTru}
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
                initialValue={recordGiaDinh?.diaChiHienNay}
                form={form}
                fields={{
                  tinh: ['diaChiHienNay', 'maTP'],
                  quanHuyen: ['diaChiHienNay', 'maQH'],
                  xaPhuong: ['diaChiHienNay', 'maXaPhuong'],
                  diaChiCuThe: ['diaChiHienNay', 'diaChi'],
                }}
                setTen={{
                  setTenTinh: setTenTinhDiaChiLienHe,
                  setTenQuanHuyen: setTenQuanHuyenDiaChiLienHe,
                  setTenXaPhuong: setTenXaPhuongDiaChiLienHe,
                }}
              />
            </FormItem>
          </Col>
          <Col xs={24} lg={24}>
            <FormItem
              initialValue={recordGiaDinh?.hoatDongChinhTriXaHoi}
              rules={[...rules.text]}
              name="hoatDongChinhTriXaHoi"
              label="Hoạt động chính trị xã hội"
            >
              <Input.TextArea placeholder="Hoạt động chính trị xã hồi" />
            </FormItem>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => props?.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormThongTinGiaDinh;
