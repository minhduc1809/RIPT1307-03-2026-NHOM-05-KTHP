/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import Block from './Block';
import styles from './block.css';
import _ from 'lodash';
import mm from 'moment-timezone';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormBaiHoc = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, edit, putBieuMauModel, addBieuMauModel } =
    useModel('bieumau');

  const { danhSach, setCondition: setCondLopHanhChinh } = useModel('lophanhchinh');
  const { danhSach: danhSachNganh } = useModel('nganh');
  const { danhSach: danhSachUser, setCondition: setCondUser, condition } = useModel('user');
  const { danhSach: danhSachLopTinChi, setCondition } = useModel('loptinchi');
  const { danhSach: danhSachKhoaHoc } = useModel('khoahoc');
  const [vaiTro, setVaiTro] = useState<string[]>(record?.danhSachVaiTro ?? []);
  const [doiTuong, setDoiTuong] = useState<string[]>(record?.loaiDoiTuongSuDung ?? []);
  const [camKet, setCamKet] = useState<boolean>(record?.coCamKet ?? true);

  const debouncedSearchLopTinChi = _.debounce((value) => {
    setCondition({ ten_lop_tin_chi: value });
  }, 500);

  const debouncedSearchLopHanhChinh = _.debounce((value) => {
    setCondLopHanhChinh({ ten_lop_hanh_chinh: value });
  }, 500);

  const debouncedSearchUser = _.debounce((value) => {
    setCondUser({ ma_dinh_danh: value });
  }, 500);

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: BieuMau.Record) => {
          const thoiGianBatDau = values?.thoiGian?.[0] ?? values.thoiGianBatDau;
          const thoiGianKetThuc = values?.thoiGian?.[1] ?? values.thoiGianKetThuc;
          if (values?.loaiDoiTuongSuDung?.includes('Tất cả')) {
            values.loaiDoiTuongSuDung = [];
          }
          delete values.thoiGian;
          if (edit)
            putBieuMauModel({
              id: record._id,
              data: { ...values, thoiGianBatDau, thoiGianKetThuc, doiTuong: 'Tất cả' },
            });
          else
            addBieuMauModel({
              ...values,
              loai: 'Khảo sát',
              thoiGianBatDau,
              thoiGianKetThuc,
              doiTuong: 'Tất cả',
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
          initialValue={[
            record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined,
            record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined,
          ]}
        >
          <DatePicker.RangePicker
            format="HH:mm DD-MM-YYYY"
            disabledDate={(cur) => moment(cur).isBefore(moment())}
            style={{ width: '100%' }}
            placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
            showTime
          />
        </Form.Item>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              rules={[...rules.required]}
              name="loaiDoiTuongSuDung"
              label="Đối tượng"
              initialValue={doiTuong}
            >
              <Select
                mode="multiple"
                onChange={(val: string[]) => {
                  if (val.includes('Tất cả')) {
                    form.setFieldsValue({
                      loaiDoiTuongSuDung: ['Tất cả'],
                    });
                  }
                  setDoiTuong(val.includes('Tất cả') ? ['Tất cả'] : val);
                }}
                placeholder="Chọn đối tượng"
              >
                {['Tất cả', 'Vai trò', 'Lớp tín chỉ', 'Lớp hành chính', 'Ngành', 'Khóa'].map(
                  (item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="kichHoat" label="Kích hoạt" initialValue={record?.kichHoat ?? true}>
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
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
        {doiTuong.includes('Lớp hành chính') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachLopHanhChinh"
            label="Lớp hành chính"
            initialValue={record?.danhSachLopHanhChinh ?? []}
          >
            <Select
              onSearch={(value) => {
                debouncedSearchLopHanhChinh(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Lớp hành chính"
            >
              {danhSach.map((item) => (
                <Select.Option key={item.ten_lop_hanh_chinh} value={item.ten_lop_hanh_chinh}>
                  {item.ten_lop_hanh_chinh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Lớp tín chỉ') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachLopTinChi"
            label="Lớp tín chỉ"
            initialValue={record?.danhSachLopTinChi ?? []}
          >
            <Select
              onSearch={(value) => {
                debouncedSearchLopTinChi(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo tên lớp"
            >
              {danhSachLopTinChi.map((item) => (
                <Select.Option key={item.ten_lop_tin_chi} value={item.ten_lop_tin_chi}>
                  {item.ten_lop_tin_chi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Khóa') && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachKhoaHoc"
            label="Khóa"
            initialValue={record?.danhSachKhoaHoc ?? []}
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn khóa"
            >
              {danhSachKhoaHoc?.map((item) => (
                <Select.Option key={item.display_name} value={item.display_name}>
                  {item.display_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Ngành') && (
          <Form.Item
            rules={[...rules.required]}
            name="danhSachNganhHoc"
            label="Ngành học"
            initialValue={record?.danhSachNganhHoc ?? []}
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Ngành học"
            >
              {danhSachNganh.map((item) => (
                <Select.Option key={item.ma_nganh} value={item.ma_nganh}>
                  {item.ten_nganh} ({item.ten_nganh_viet_tat})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {doiTuong.includes('Vai trò') && (
          <Form.Item
            rules={[...rules.required]}
            name="danhSachVaiTro"
            label="Vai trò"
            initialValue={record?.danhSachVaiTro}
          >
            <Select
              onChange={(val: string[]) => {
                setVaiTro(val);
                setCondUser({
                  ...condition,
                  vai_tro: {
                    $in: val,
                  },
                });
              }}
              mode="multiple"
              placeholder="Chọn vai trò"
            >
              {[
                { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {vaiTro?.length > 0 && (
          <Form.Item
            // rules={[...rules.required]}
            name="danhSachNguoiDung"
            label="Người dùng cụ thể"
            initialValue={record?.danhSachNguoiDung ?? []}
          >
            <Select
              onSearch={(value) => {
                debouncedSearchUser(value);
              }}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Tìm kiếm theo mã định danh"
            >
              {danhSachUser.map((item) => (
                <Select.Option key={item?.ma_dinh_danh} value={item?.ma_nganh}>
                  {item?.name} ({item?.ma_dinh_danh})
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
              validator: async (validate, names) => {
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
                  <div key={field.key}>
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
                  </div>
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
