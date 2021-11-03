/* eslint-disable no-param-reassign */
import DiaChi from '@/components/DiaChi';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import PhuongThucNhanDon from '../../components/PhuongThucNhanDon';
import ThongTinCaNhan from '../../components/ThongTinCaNhan';

const FormYeuCauCapGiayDangKyVeThangXeBus = () => {
  const {
    loaiPhongBan,
    loaiGiayTo,
    record,
    setVisibleForm,
    edit,
    loading,
    postDonSinhVienModel,
    typeForm,
  } = useModel('dichvumotcua');
  const { tenTinh, tenPhuongXa, tenQuanHuyen } = useModel('donvihanhchinh');
  const { initialState } = useModel('@@initialState');
  const [check, setCheck] = useState<boolean>(false);
  const [form] = Form.useForm();
  const readOnly = typeForm === 'view';
  return (
    <Card bodyStyle={{ padding: 60, maxWidth: 1000, margin: '0 auto' }} title={loaiGiayTo}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (values.anhChanDung.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.anhChanDung.fileList?.[0].originFileObj,
            });
            values.anhChanDung = response?.data?.data?.url;
          } else values.anhChanDung = values.anhChanDung.fileList?.[0]?.url;

          postDonSinhVienModel(
            {
              ...values,
              loaiPhongBan,
              diaChi: { ...values.diaChi, tenTinh, tenPhuongXa, tenQuanHuyen },
              loaiDon: loaiGiayTo,
              diaChiNhanDon:
                values.phuongThucNhanDon === 'Nhận tại trường'
                  ? 'Nhận tại trường'
                  : values.diaChiNhanDon,
            },
            'the-xe-bus',
          );
        }}
        form={form}
      >
        <TieuDe />
        <ThongTinCaNhan />
        <Divider />
        <h3 style={{ fontWeight: 'bold' }}>Thông tin đơn</h3>
        <Row gutter={[20, 0]}>
          <Col span={24}>
            <Form.Item
              name="anhChanDung"
              label="Ảnh chân dung"
              initialValue={renderFileListUrl(record?.anhChanDung ?? '')}
              rules={[...rules.fileRequired]}
            >
              <UploadAvatar
                style={{
                  width: 102,
                  maxWidth: 102,
                  height: 102,
                  maxHeight: 102,
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={initialState?.currentUser?.so_dien_thoai}
              name="soDienThoai"
              label="Số điện thoại"
              rules={[...rules.required, ...rules.soDienThoai]}
            >
              <Input readOnly={readOnly} placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.tuyenBuytDangKy}
              name="tuyenBuytDangKy"
              label="Tuyến buýt đăng ký"
              rules={[...rules.required]}
            >
              <Select disabled={readOnly} placeholder="Tuyến buýt đăng ký">
                {['Một tuyến', 'Liên tuyến', 'Liên tuyến và Tuyến'].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              initialValue={record?.tenTuyen}
              name="tenTuyen"
              label="Số hiệu tuyến"
              rules={[...rules.required, ...rules.text]}
            >
              <Input readOnly={readOnly} placeholder="Số hiệu tuyến" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Địa chỉ" required>
          <DiaChi
            disabled={readOnly}
            initialValue={record?.diaChi}
            form={form}
            fields={{
              tinh: ['diaChi', 'maTinh'],
              quanHuyen: ['diaChi', 'maQuanHuyen'],
              xaPhuong: ['diaChi', 'maPhuongXa'],
              diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
            }}
          />
        </Form.Item>

        {<PhuongThucNhanDon />}
        {!readOnly && (
          <Checkbox
            onChange={(e) => {
              setCheck(e.target.checked);
            }}
          >
            Em xin xác nhận nội dung trong đơn là đúng sự thật
          </Checkbox>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!readOnly && (
            <Button
              disabled={!check}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              {edit ? 'Lưu' : 'Thêm'}
            </Button>
          )}
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormYeuCauCapGiayDangKyVeThangXeBus;
