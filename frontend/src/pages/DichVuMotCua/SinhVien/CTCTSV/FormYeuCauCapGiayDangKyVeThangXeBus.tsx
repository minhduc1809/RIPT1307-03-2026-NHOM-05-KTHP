import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import data from '@/utils/data';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import PhuongThucNhanDon from '../../components/PhuongThucNhanDon';
import ThongTinCaNhan from '../../components/ThongTinCaNhan';

const FormYeuCauCapGiayDangKyVeThangXeBus = () => {
  const { loaiPhongBan, loaiGiayTo, record, setVisibleForm, edit, loading, postDonSinhVienModel } =
    useModel('dichvumotcua');
  const { initialState } = useModel('@@initialState');
  const [check, setCheck] = useState<boolean>(false);
  const [form] = Form.useForm();

  return (
    <Card bodyStyle={{ padding: 60, maxWidth: 1000, margin: '0 auto' }} title={loaiGiayTo}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          postDonSinhVienModel(
            {
              ...values,
              loaiPhongBan,
              loaiDon: loaiGiayTo,
              diaChiNhanDon:
                values.phuongThucNhanDon === 'Nhận tại trường'
                  ? 'Nhận tại trường'
                  : values.diaChiNhanDon,
            },
            'vay-von-sinh-vien',
          );
        }}
        form={form}
      >
        <TieuDe />
        <ThongTinCaNhan />
        <Divider />
        <h3 style={{ fontWeight: 'bold' }}>Thông tin đơn</h3>
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={initialState?.currentUser?.so_dien_thoai}
              name="soDienThoai"
              label="Số điện thoại"
              rules={[...rules.required, ...rules.soDienThoai]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="maTruong"
              label="Mã trường theo học"
              initialValue={record?.maTruong ?? 'BVH'}
              rules={[...rules.required]}
            >
              <Input placeholder="Mã trường theo học" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.loaiHinhDaoTao}
              name="loaiHinhDaoTao"
              label="Loại hình đào tạo"
              rules={[...rules.required]}
            >
              <Select placeholder="Loại hình đào tạo">
                {data.loaiHinhDaoTao?.map((item: string) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="heDaoTao"
              label="Hình thức đào tạo"
              initialValue="Đại học chính quy"
              rules={[...rules.required]}
            >
              <Select placeholder="Hình thức đào tạo">
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
              <Input placeholder="YYYY-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="ngayNhapHoc" label="Ngày nhập học" rules={[...rules.required]}>
              <DatePicker
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Ngày nhập học"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="thoiGianRaTruong"
              label="Thời gian ra trường"
              rules={[...rules.required]}
            >
              <DatePicker
                disabledDate={(cur) => moment(cur).isBefore(moment())}
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Thời gian ra trường"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="thoiGianHocTaiTruong"
              label="Thời gian học (tháng)"
              initialValue={record?.thoiGianHocTaiTruong}
              rules={[...rules.required]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Đơn vị (tháng)"
                min={0}
                max={120}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="hocPhiHangThang"
              label="Học phí hàng tháng"
              initialValue={record?.hocPhiHangThang}
              rules={[...rules.required]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Đơn vị (VNĐ)"
                min={0}
                max={100000000}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xxl={8}>
            <Form.Item
              name="loaiMienGiam"
              label="Thuộc diện"
              initialValue={record?.loaiMienGiam ?? 'Không miễn giảm'}
              rules={[...rules.required]}
            >
              <Radio.Group>
                {['Không miễn giảm', 'Giảm học phí', 'Miễn học phí'].map((item) => (
                  <Radio value={item} key={item}>
                    {item}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xxl={8}>
            <Form.Item
              name="doiTuong"
              label="Thuộc đối tượng"
              initialValue={record?.doiTuong ?? 'Không mồ côi'}
              rules={[...rules.required]}
            >
              <Radio.Group>
                {['Không mồ côi', 'Mồ côi'].map((item) => (
                  <Radio value={item} key={item}>
                    {item}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <div>
          - Trong thời gian học tại trường, anh (chị): Phan Quang Thành không bị xử phạt hành chính
          trở lên về các hành vi: cờ bạc, nghiện hút, trộm cắp, buôn lậu.
        </div>
        <div>
          - Số tài khoản của nhà trường: 1500201092540, tại ngân hàng Nông nghiệp và Phát triển nông
          thôn, chi nhánh thành phố Hà Nội.
        </div>
        {<PhuongThucNhanDon />}
        <Checkbox
          onChange={(e) => {
            setCheck(e.target.checked);
          }}
        >
          Em xin xác nhận nội dung trong đơn là đúng sự thật
        </Checkbox>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            disabled={!check}
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            {edit ? 'Lưu' : 'Thêm'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormYeuCauCapGiayDangKyVeThangXeBus;
