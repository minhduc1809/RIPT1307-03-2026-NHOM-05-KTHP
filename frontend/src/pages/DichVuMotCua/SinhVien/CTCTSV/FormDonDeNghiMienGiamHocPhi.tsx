/* eslint-disable no-param-reassign */
import DiaChi from '@/components/DiaChi';
import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PhuongThucNhanDon from '../../components/PhuongThucNhanDon';
import ThongTinCaNhan from '../../components/ThongTinCaNhan';

const FormDonDeNghiMienGiamHocPhi = () => {
  const { loaiPhongBan, loaiGiayTo, record, setVisibleForm, edit, loading, postDonSinhVienModel } =
    useModel('dichvumotcua');
  const {
    danhSachDanToc,
    danhSachTonGiao,
    loading: loadingDanToc,
    getAllDanToc,
    getAllTonGiao,
  } = useModel('dantoctongiao');

  useEffect(() => {
    getAllDanToc();
    getAllTonGiao();
  }, []);

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
            'mien-giam-hoc-phi',
          );
        }}
        form={form}
      >
        <TieuDe />
        <ThongTinCaNhan
          child={
            <Col xs={24} md={12} xl={8}>
              <Form.Item
                initialValue={record?.maNganh || initialState?.currentUser?.khoa_nganh_id?.[1]}
                name="nganh"
                label="Ngành"
                rules={[...rules.required, ...rules.text]}
              >
                <Input placeholder="Ngành" />
              </Form.Item>
            </Col>
          }
        />
        <Divider />
        <h3 style={{ fontWeight: 'bold' }}>Thông tin đơn</h3>
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12} xl={8}>
            <Form.Item label="Nơi sinh" required>
              <DiaChi
                hideDiaChiCuThe
                hideQuanHuyen
                hideXaPhuong
                fields={{
                  tinh: ['noiSinh', 'maTinh'],
                  quanHuyen: ['noiSinh', 'maQuanHuyen'],
                  xaPhuong: ['noiSinh', 'maPhuongXa'],
                  diaChiCuThe: ['noiSinh', 'soNhaTenDuong'],
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.danToc}
              name="danToc"
              label="Dân tộc"
              rules={[...rules.required]}
            >
              <Select
                loading={loadingDanToc}
                placeholder="Dân tộc"
                showSearch
                filterOption={(value, option) => includes(option?.props.children, value)}
              >
                {danhSachDanToc?.map((item) => (
                  <Select.Option key={item.ma} value={item.ma}>
                    {item.tenDanToc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.tonGiao}
              name="tonGiao"
              label="Tôn giáo"
              rules={[...rules.required]}
            >
              <Select
                loading={loadingDanToc}
                placeholder="Tôn giáo"
                showSearch
                filterOption={(value, option) => includes(option?.props.children, value)}
              >
                {danhSachTonGiao?.map((item) => (
                  <Select.Option key={item.ma} value={item.ma}>
                    {item.tenTonGiao}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.soDienThoaiGD}
              name="soDienThoaiGD"
              label="Số điện thoại GĐ"
              rules={[...rules.required, ...rules.soDienThoai]}
            >
              <Input placeholder="Số điện thoại GĐ" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.doiTuong}
              name="doiTuong"
              label="Thuộc đối tượng"
              rules={[...rules.required, ...rules.text]}
            >
              <Input placeholder="Thuộc đối tượng" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.tenTaiKhoan}
              name="tenTaiKhoan"
              label="Tên tài khoản"
              rules={[...rules.required, ...rules.text]}
            >
              <Input placeholder="Tên tài khoản" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.soTaiKhoan}
              name="soTaiKhoan"
              label="Số tài khoản"
              rules={[...rules.required, ...rules.text]}
            >
              <Input placeholder="Số tài khoản" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.nganHang}
              name="nganHang"
              label="Ngân hàng"
              rules={[...rules.required, ...rules.text]}
            >
              <Input placeholder="Ngân hàng" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Hộ khẩu thường trú" required>
          <DiaChi
            fields={{
              tinh: ['diaChiHoKhau', 'maTinh'],
              quanHuyen: ['diaChiHoKhau', 'maQuanHuyen'],
              xaPhuong: ['diaChiHoKhau', 'maPhuongXa'],
              diaChiCuThe: ['diaChiHoKhau', 'soNhaTenDuong'],
            }}
          />
        </Form.Item>
        <h3 style={{ fontWeight: 'bold' }}>Thông tin bố</h3>
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12} xl={12}>
            <Form.Item
              initialValue={record?.thongTinBo.hoTen}
              name={['thongTinBo', 'hoTen']}
              label="Họ tên"
              rules={[...rules.required, ...rules.ten]}
            >
              <Input placeholder="Họ tên" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={12}>
            <Form.Item
              initialValue={record?.thongTinBo.ngheNghiep}
              name={['thongTinBo', 'ngheNghiep']}
              label="Nghề nghiệp"
              rules={[...rules.required, ...rules.text]}
            >
              <Input placeholder="Nghề nghiệp" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Hộ khẩu thường trú" required>
          <DiaChi
            fields={{
              tinh: ['thongTinBo', 'diaChi', 'maTinh'],
              quanHuyen: ['thongTinBo', 'diaChi', 'maQuanHuyen'],
              xaPhuong: ['thongTinBo', 'diaChi', 'maPhuongXa'],
              diaChiCuThe: ['thongTinBo', 'diaChi', 'soNhaTenDuong'],
            }}
          />
        </Form.Item>
        <h3 style={{ fontWeight: 'bold' }}>Thông tin mẹ</h3>
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12} xl={12}>
            <Form.Item
              initialValue={record?.thongTinMe.hoTen}
              name={['thongTinMe', 'hoTen']}
              label="Họ tên"
              rules={[...rules.required, ...rules.ten]}
            >
              <Input placeholder="Họ tên" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={12}>
            <Form.Item
              initialValue={record?.thongTinMe.ngheNghiep}
              name={['thongTinMe', 'ngheNghiep']}
              label="Nghề nghiệp"
              rules={[...rules.required, ...rules.text]}
            >
              <Input placeholder="Nghề nghiệp" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Hộ khẩu thường trú" required>
          <DiaChi
            fields={{
              tinh: ['thongTinMe', 'diaChi', 'maTinh'],
              quanHuyen: ['thongTinMe', 'diaChi', 'maQuanHuyen'],
              xaPhuong: ['thongTinMe', 'diaChi', 'maPhuongXa'],
              diaChiCuThe: ['thongTinMe', 'diaChi', 'soNhaTenDuong'],
            }}
          />
        </Form.Item>
        <div>
          - Căn cứ vào Nghị định số 86/2015/NĐ-CP của Chính phủ, em làm đơn này kính đề nghị Nhà
          trường xem xét, giải quyết chế độ miễn, giảm học phí.
        </div>
        <div>
          - Em xin cam kết hồ sơ xin miễn, giảm học phí của em là đúng đối tượng, nếu khai man em
          xin trả lại số tiền đã nhận và xin chịu hoàn toàn trách nhiệm với Nhà trường
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

export default FormDonDeNghiMienGiamHocPhi;
