/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import Block from './Block';
import styles from './block.css';

const FormBaiHoc = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, edit, putBieuMauModel, addBieuMauModel } =
    useModel('bieumau');
  const [doiTuong, setDoiTuong] = useState<string>(record?.doiTuong ?? 'Tất cả');
  const [camKet, setCamKet] = useState<boolean>(record?.coCamKet ?? true);
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: BieuMau.Record) => {
          const thoiGianBatDau = values?.thoiGian?.[0] ?? values.thoiGianBatDau;
          const thoiGianKetThuc = values?.thoiGian?.[1] ?? values.thoiGianKetThuc;
          delete values.thoiGian;
          // eslint-disable-next-line no-underscore-dangle
          if (edit) putBieuMauModel({ id: record._id, data: values });
          else
            addBieuMauModel({
              ...values,
              loai: 'Khảo sát',
              thoiGianBatDau,
              thoiGianKetThuc,
            });
        }}
        form={form}
      >
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
          initialValue={record?.tieuDe}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.length(255)]}
          initialValue={record?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Tiêu đề" />
        </Form.Item>
        <Form.Item
          name="thoiGian"
          label="Thời gian bắt đầu - Thời gian kết thúc"
          // rules={[...rules.required]}
          initialValue={edit ? [moment(record.thoiGianBatDau), moment(record.thoiGianKetThuc)] : []}
        >
          <DatePicker.RangePicker
            disabledDate={(cur) => moment(cur).isBefore(moment())}
            style={{ width: '100%' }}
            placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
            showTime
          />
        </Form.Item>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              rules={[...rules.required]}
              name="doiTuong"
              label="Đối tượng"
              initialValue={doiTuong}
            >
              <Select
                onChange={(val: string) => {
                  setDoiTuong(val);
                }}
                placeholder="Chọn đối tượng"
              >
                {['Tất cả', 'Vai trò'].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="kichHoat" label="Kích hoạt" initialValue={record?.kichHoat ?? true}>
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="coCamKet" label="Có cam kết" initialValue={record?.coCamKet ?? true}>
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
        </Row>
        {doiTuong === 'Vai trò' && (
          <Form.Item
            rules={[...rules.required]}
            name="danhSachVaiTro"
            label="Vai trò"
            initialValue={record?.danhSachVaiTro}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'giang_vien', name: 'Giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {camKet && (
          <Form.Item
            rules={[...rules.required]}
            name="noiDungCamKet"
            label="Nội dung cam kết"
            initialValue={record?.noiDungCamKet}
          >
            <Input placeholder="Nội dung cam kết" />
          </Form.Item>
        )}
        <Form.List
          name="danhSachKhoi"
          initialValue={record?.danhSachKhoi ?? []}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 khối'));
                }
                return '';
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <>
                    <Card
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Khối {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right' }}
                            onClick={() => remove(field.name)}
                          />
                        </>
                      }
                    >
                      <Block field={{ ...field }} />
                    </Card>
                    <br />
                  </>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm khối
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
