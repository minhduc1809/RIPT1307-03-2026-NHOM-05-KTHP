import {
  ETrangThaiHoSo,
  ETrangThaiNhapHoc,
  ETrangThaiTrungTuyen,
  ETrangThaiXacNhanNhapHoc,
} from '@/utils/constants';
import rules from '@/utils/rules';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormThongTinChungKhaoSat = () => {
  const access = useAccess();
  const [form] = Form.useForm();
  const { record, edit, setCurrent, setRecord } = useModel('bieumau');
  const { danhSach } = useModel('dottuyensinh');
  const [camKet, setCamKet] = useState<boolean>(record?.coCamKet ?? true);

  return (
    <>
      <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          labelCol={{ span: 24 }}
          onFinish={async (values) => {
            const thoiGianBatDau = values?.thoiGian?.[0] ?? values.thoiGianBatDau;
            const thoiGianKetThuc = values?.thoiGian?.[1] ?? values.thoiGianKetThuc;
            delete values.thoiGian;

            setRecord({
              ...record,
              ...values,
              loai: 'Khảo sát',
              thoiGianBatDau,
              thoiGianKetThuc,
            });
            setCurrent(1);
          }}
          form={form}
        >
          <Form.Item
            name="tieuDe"
            label="Tiêu đề"
            rules={[...rules.required, ...rules.text, ...rules.length(100)]}
            initialValue={record?.tieuDe}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Tiêu đề" />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[...rules.length(255)]}
            initialValue={record?.moTa}
            style={{ marginBottom: 8 }}
          >
            <Input.TextArea rows={3} placeholder="Tiêu đề" />
          </Form.Item>

          <Row gutter={[12, 0]}>
            <Col xs={24} sm={access.admin ? 12 : 12} md={access.admin ? 12 : 12}>
              <Form.Item
                name="thoiGian"
                label="Thời gian bắt đầu - Thời gian kết thúc"
                initialValue={[
                  record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
                  record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
                ]}
                style={{ marginBottom: 8 }}
              >
                <DatePicker.RangePicker
                  format="HH:mm DD-MM-YYYY"
                  // disabledDate={(cur) => moment(cur).isBefore(moment())}
                  style={{ width: '100%' }}
                  placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                  showTime
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="kichHoat"
                label="Kích hoạt"
                initialValue={record?.kichHoat ?? true}
              >
                <Radio.Group>
                  <Radio value={true}>Có</Radio>
                  <Radio value={false}>Không</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="coCamKet"
                label="Có cam kết"
                initialValue={record?.coCamKet ?? true}
              >
                <Radio.Group
                  onChange={(val) => {
                    setCamKet(val.target.value);
                  }}
                >
                  <Radio value={true}>Có</Radio>
                  <Radio value={false}>Không</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="danhSachDotTuyenSinh"
                label="Danh sách đợt tuyển sinh"
                initialValue={record?.danhSachDotTuyenSinh}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn đợt tuyển sinh"
                  options={danhSach?.map((item) => ({
                    label: `${item.tenDotTuyenSinh} (năm ${item.namTuyenSinh})`,
                    value: item._id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="danhSachTrangThai"
                label="Danh sách trạng thái"
                initialValue={record?.danhSachTrangThai}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn trạng thái"
                  options={[
                    ...Object.values(ETrangThaiHoSo),
                    ...Object.values(ETrangThaiTrungTuyen),
                    ...Object.values(ETrangThaiNhapHoc),
                    ...Object.values(ETrangThaiXacNhanNhapHoc),
                  ]?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {camKet && (
            <Form.Item
              style={{ marginBottom: 8 }}
              rules={[...rules.required]}
              name="noiDungCamKet"
              label="Nội dung cam kết"
              initialValue={record?.noiDungCamKet}
            >
              <Input placeholder="Nội dung cam kết" />
            </Form.Item>
          )}

          <Form.Item
            style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
          >
            <Button
              icon={<ArrowRightOutlined />}
              //loading={loading}
              loading={false}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Tiếp theo
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* <Modal
        footer={false}
        visible={visible}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisible(false);
        }}
        destroyOnClose
      >
        <ImportExcel
          handleData={handleData}
          // title={`Import ${TitleFormImport?.[ImportExcelType] ?? ''}`}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </Modal> */}
    </>
  );
};

export default FormThongTinChungKhaoSat;
