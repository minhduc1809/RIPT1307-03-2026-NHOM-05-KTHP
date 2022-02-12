import DiaChi from '@/components/DiaChi';
import { FormItem } from '@/components/FormItem';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';

const KhaiBaoThongTinCaNhan = () => {
  const [form] = Form.useForm();

  const { initialState } = useModel('@@initialState');
  const { danhSachDanToc, danhSachTonGiao } = useModel('dantoctongiao');
  const [tenTinh, setTenTinh] = useState<string>();
  const [tenQuanHuyen, setTenQuanHuyen] = useState<string>();
  const [tenPhuongXa, setTenXaPhuong] = useState<string>();
  const isMobile = useMediaQuery({
    query: '(max-width: 576px)',
  });
  return (
    <Card bodyStyle={{ paddingTop: 0 }} bordered>
      <Form labelCol={{ span: 24 }} form={form} onFinish={(value) => {}}>
        <Divider plain>
          <strong>Thông tin cơ bản</strong>
        </Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={8}>
            <FormItem
              initialValue={initialState?.currentUser?.name ?? ''}
              label="Họ và tên"
              name="hoTen"
            >
              <Input placeholder="Nhập họ và tên" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              initialValue={initialState?.currentUser?.so_cmnd}
              label="Số CMT/CCCD"
              name="cmtCccd"
            >
              <Input placeholder="Nhập số CMT/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              initialValue={
                initialState?.currentUser?.ngayCapCmtCccd
                  ? moment(initialState?.currentUser?.ngayCapCmtCccd).format('DD/MM/YYYY')
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
              initialValue={initialState?.currentUser?.noiCapCmtCccd ?? ''}
              label="Nơi cấp"
              name="noiCapCmtCccd"
            >
              <Input placeholder="Nhập nơi cấp CMT/CCCD" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              initialValue={initialState?.currentUser?.email ?? ''}
              label="Email"
              name="email"
            >
              <Input placeholder="Nhập email" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem
              initialValue={initialState?.currentUser?.so_dien_thoai ?? ''}
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
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={8}>
            <FormItem name="ngaySinh" label="Ngày sinh">
              {/* startof date */}
              <DatePicker
                placeholder="Ngày sinh DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem label="Giới tính" name="gioiTinh">
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
            <FormItem label="Dân tộc" name="danToc">
              <Select showSearch placeholder="Dân tộc">
                {danhSachDanToc.map((item) => (
                  <Select.Option key={item.tenDanToc} value={item.tenDanToc}>
                    {item.tenDanToc}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem label="Quốc tịch" name="quocTich">
              <Input placeholder="Nhập quốc tịch" />
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem label="Tôn giáo" name="tonGiao">
              <Select placeholder="Tôn giáo">
                {danhSachTonGiao.map((item) => (
                  <Select.Option key={item.tenTonGiao} value={item.tenTonGiao}>
                    {item.tenTonGiao}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24} lg={8}>
            <FormItem label="Số điện thoại" name="soDienThoai">
              <Input placeholder="Nhập số điện thoại" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem label="Địa chỉ">
              <DiaChi
                form={form}
                fields={{
                  tinh: ['diaChi', 'maTinh'],
                  quanHuyen: ['diaChi', 'maQuanHuyen'],
                  xaPhuong: ['diaChi', 'maPhuongXa'],
                  diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
                }}
                setTen={{ setTenTinh, setTenQuanHuyen, setTenXaPhuong }}
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
