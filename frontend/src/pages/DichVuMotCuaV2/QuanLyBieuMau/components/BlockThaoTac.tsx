import { LoaiDoiTuongXuLyQuyTrinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { useState } from 'react';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BieuMauThaoTac = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
  step: number;
}) => {
  const { danhSach } = useModel('donvi');
  const { record } = useModel('dichvumotcuav2');
  const [loaiDoiTuong, setLoaiDoiTuong] = useState<string>(
    record?.quyTrinh?.danhSachBuoc?.[props?.step]?.danhSachThaoTac?.[props.field.name]
      ?.loaiDoiTuongXuLy ?? '',
  );
  return (
    <Row gutter={[20, 0]}>
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'tenThaoTac']}
          label="Tên thao tác"
          rules={[...rules.required, ...rules.text]}
        >
          <Input placeholder="Tên thao tác" />
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'soNgayXuLy']}
          label="Số ngày xử lý"
          rules={[...rules.required]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Số ngày xử lý" min={0} max={300} />
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'loaiDoiTuongXuLy']}
          label="Loại đối tượng"
          rules={[...rules.required]}
        >
          <Select
            onChange={(val: string) => setLoaiDoiTuong(val)}
            placeholder="Chọn loại đối tượng"
          >
            {Object.keys(LoaiDoiTuongXuLyQuyTrinh)?.map((item) => (
              <Select.Option value={LoaiDoiTuongXuLyQuyTrinh[item]}>
                {LoaiDoiTuongXuLyQuyTrinh[item]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {loaiDoiTuong === 'Đơn vị cụ thể' && (
        <Col xs={24} lg={12}>
          <Form.Item
            style={{ marginBottom: 8 }}
            labelCol={{ span: 24 }}
            name={[props.field.name, 'idDonVi']}
            label="Đơn vị"
            rules={[...rules.required]}
          >
            <Select placeholder="Chọn đơn vị">
              {danhSach?.map((item) => (
                <Select.Option key={item.id} value={item.id.toString()}>
                  {item.ten_don_vi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default BieuMauThaoTac;
