/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import ImportExcel from '@/components/ImportExcel';
import { TitleFormImport } from '@/utils/constants';
import rules from '@/utils/rules';
import { includes, toRegex } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Modal, Radio, Row, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormThongTinChungKhaoSat = () => {
  const access = useAccess();
  const [form] = Form.useForm();
  const { loading, record, edit, setCurrent, setRecord, loaiBieuMau } = useModel('bieumau');
  const { danhSachNguoiDungCuThe, setConditionNguoiDungCuThe, conditionNguoiDungCuThe } =
    useModel('user');
  const { danhSach, setCondition: setCondLopHanhChinh } = useModel('lophanhchinh');
  const { danhSach: danhSachNganh } = useModel('nganh');
  const { danhSach: danhSachLopTinChi, setCondition } = useModel('loptinchi');
  const { danhSach: danhSachKhoaHoc } = useModel('khoahoc');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const [doiTuong, setDoiTuong] = useState<string>(record?.loaiDoiTuongSuDung?.[0] ?? 'Tất cả');
  const [camKet, setCamKet] = useState<boolean>(record?.coCamKet ?? true);
  const [phamVi, setPhamVi] = useState<string>(record?.phamVi ?? '');
  const isNguoiDungCuThe = doiTuong?.includes('Người dùng cụ thể');
  const debouncedSearchLopTinChi = _.debounce((value) => {
    setCondition({ ten_lop_tin_chi: value });
  }, 800);

  const [visible, setVisible] = useState<boolean>(false);
  const [ImportExcelType, setImportExcelType] = useState<string>('');

  const debouncedSearchLopHanhChinh = _.debounce((value) => {
    setCondLopHanhChinh({ ten_lop_hanh_chinh: value });
  }, 800);

  const debouncedSearchUser = _.debounce((value) => {
    setConditionNguoiDungCuThe({
      ...conditionNguoiDungCuThe,
      code: toRegex(value),
    });
  }, 800);

  const handleData = (newData: any[]) => {
    const oldData = form.getFieldValue(ImportExcelType);
    const data = {};
    data[ImportExcelType] = _.union(
      oldData,
      newData?.map((item: any[]) => item?.join('||')),
    );

    record[ImportExcelType] = form.setFieldsValue(data);
    setVisible(false);
  };

  const renderButtonImportExcel = (type: string) => (
    <Button
      onClick={() => {
        setVisible(true);
        setImportExcelType(type);
      }}
      type="primary"
      style={{ position: 'absolute', top: 0, right: 0 }}
    >
      Import Excel
    </Button>
  );

  const buildListDoiTuongSuDung = (value: string[], arrName: string) => {
    return value?.map((item) => {
      const info = item?.split('||');
      if (info.length === 1) {
        return record?.[arrName]?.find((ele: BieuMau.GeneralInfo) => ele?.name === info?.[0]);
      } else
        return {
          id: info?.[0],
          name: info?.[1],
        };
    });
  };

  return (
    <>
      <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          labelCol={{ span: 24 }}
          onFinish={async (values) => {
            if (isNguoiDungCuThe) {
              values.danhSachLopHanhChinh = [];
              values.danhSachLopTinChi = [];
              values.danhSachNganhHoc = [];
              values.danhSachKhoaHoc = [];
              values.danhSachVaiTro = [];
            } else {
              values.danhSachLopHanhChinh = buildListDoiTuongSuDung(
                values?.danhSachLopHanhChinh ?? [],
                'danhSachLopHanhChinh',
              );
              values.danhSachLopTinChi = buildListDoiTuongSuDung(
                values?.danhSachLopTinChi ?? [],
                'danhSachLopTinChi',
              );
              values.danhSachNganhHoc = buildListDoiTuongSuDung(
                values?.danhSachNganhHoc ?? [],
                'danhSachNganhHoc',
              );
              values.danhSachKhoaHoc = buildListDoiTuongSuDung(
                values?.danhSachKhoaHoc ?? [],
                'danhSachKhoaHoc',
              );
            }
            values.danhSachNguoiDung = values?.danhSachNguoiDung?.map((item: string) => {
              const infoUser = item?.split('||');
              if (infoUser.length === 1) {
                return record?.danhSachNguoiDung?.find(
                  (ele: BieuMau.GeneralInfo) => ele?.code === infoUser?.[0]?.split('-')?.[0],
                );
              } else
                return {
                  code: infoUser?.[0],
                  name: infoUser?.[1],
                };
            });
            const thoiGianBatDau = values?.thoiGian?.[0] ?? values.thoiGianBatDau;
            const thoiGianKetThuc = values?.thoiGian?.[1] ?? values.thoiGianKetThuc;

            values.loaiDoiTuongSuDung = doiTuong === 'Tất cả' ? [] : [doiTuong];

            if (values?.hinhThucDaoTaoId === -1) {
              values.hinhThucDaoTaoId = undefined;
              values.isTatCaHe = true;
            } else {
              values.isTatCaHe = false;
            }
            delete values.thoiGian;

            setRecord({
              ...record,
              ...values,
              loai: loaiBieuMau,
              thoiGianBatDau,
              thoiGianKetThuc,
              doiTuong: 'Tất cả',
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

          <Row gutter={[8, 0]}>
            <Col xs={24} sm={access.admin ? 8 : 12} md={access.admin ? 8 : 12}>
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
                  disabledDate={(cur) => moment(cur).isBefore(moment())}
                  style={{ width: '100%' }}
                  placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                  showTime
                />
              </Form.Item>
            </Col>

            {access.admin && (
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  initialValue={record?.phamVi}
                  rules={[...rules.required]}
                  name="phamVi"
                  label="Phạm vi"
                  style={{ marginBottom: 8 }}
                >
                  <Select onChange={(val: string) => setPhamVi(val)} placeholder="Phạm vi">
                    {['Tất cả', 'Hình thức đào tạo'].map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}

            {phamVi === 'Hình thức đào tạo' && access.admin && (
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  style={{ marginBottom: 8 }}
                  initialValue={record?.hinhThucDaoTaoId}
                  rules={[...rules.required]}
                  name="hinhThucDaoTaoId"
                  label="Hình thức đào tạo"
                >
                  <Select placeholder="Hình thức đào tạo">
                    {danhSachHinhThucDaoTao?.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.ten_hinh_thuc_dao_tao}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12} md={phamVi === 'Hình thức đào tạo' || !access.admin ? 12 : 8}>
              <Form.Item
                style={{ marginBottom: 8 }}
                rules={[...rules.required]}
                name="loaiDoiTuongSuDung"
                label="Đối tượng khảo sát"
                initialValue={record?.loaiDoiTuongSuDung?.[0] ?? 'Tất cả'}
              >
                <Select
                  onChange={(val: string) => {
                    if (val === 'Người dùng cụ thể') {
                      form.setFieldsValue({
                        danhSachLopHanhChinh: [],
                        danhSachLopTinChi: [],
                        danhSachNganhHoc: [],
                        danhSachKhoaHoc: [],
                        danhSachVaiTro: [],
                      });
                    }
                    setDoiTuong(val);
                  }}
                  placeholder="Chọn đối tượng"
                >
                  {[
                    'Tất cả',
                    // 'Vai trò',
                    'Lớp tín chỉ',
                    'Lớp hành chính',
                    'Ngành',
                    'Khóa',
                    'Người dùng cụ thể',
                  ].map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                style={{ marginBottom: 8 }}
                // rules={[...rules.required]}
                name="danhSachVaiTro"
                label={isNguoiDungCuThe ? 'Lọc theo vai trò' : 'Vai trò'}
                initialValue={record?.danhSachVaiTro}
              >
                <Select
                  onChange={(val: string[]) => {
                    setConditionNguoiDungCuThe({
                      ...conditionNguoiDungCuThe,
                      vaiTroList: val?.length > 0 ? val : undefined,
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
          </Row>
          {(doiTuong === 'Lớp hành chính' || isNguoiDungCuThe) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                extra={
                  !isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả lớp hành chính</div>
                }
                style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
                // rules={[...rules.required]}
                name="danhSachLopHanhChinh"
                label={isNguoiDungCuThe ? 'Lọc theo lớp hành chính' : 'Lớp hành chính'}
                initialValue={
                  isNguoiDungCuThe ? [] : record?.danhSachLopHanhChinh?.map((item) => item.name)
                }
              >
                <Select
                  maxTagCount={8}
                  onChange={(val: string[]) => {
                    if (!isNguoiDungCuThe) return;
                    setConditionNguoiDungCuThe({
                      ...conditionNguoiDungCuThe,
                      lopHanhChinhIds:
                        val.length > 0 ? val?.map((item) => item?.split('||')?.[0]) : undefined,
                    });
                  }}
                  onSearch={(value) => {
                    debouncedSearchLopHanhChinh(value);
                  }}
                  showSearch
                  allowClear
                  mode="tags"
                  placeholder="Lớp hành chính"
                >
                  {danhSach.map((item) => (
                    <Select.Option key={item.id} value={`${item.id}||${item.ten_lop_hanh_chinh}`}>
                      {item.ten_lop_hanh_chinh}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* {!isNguoiDungCuThe && renderButtonImportExcel('danhSachLopHanhChinh')} */}
            </div>
          )}
          {(doiTuong === 'Lớp tín chỉ' || isNguoiDungCuThe) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả lớp tín chỉ</div>}
                style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
                // rules={[...rules.required]}
                name="danhSachLopTinChi"
                label={isNguoiDungCuThe ? 'Lọc theo lớp tín chỉ' : 'Lớp tín chỉ'}
                initialValue={
                  isNguoiDungCuThe ? [] : record?.danhSachLopTinChi?.map((item) => item.name)
                }
              >
                <Select
                  maxTagCount={8}
                  onChange={(val: string[]) => {
                    if (!isNguoiDungCuThe) return;
                    setConditionNguoiDungCuThe({
                      ...conditionNguoiDungCuThe,
                      lopTinChiIds:
                        val.length > 0 ? val?.map((item) => item?.split('||')?.[0]) : undefined,
                    });
                  }}
                  onSearch={(value) => {
                    debouncedSearchLopTinChi(value);
                  }}
                  showSearch
                  allowClear
                  mode="tags"
                  placeholder="Tìm kiếm theo tên lớp"
                >
                  {danhSachLopTinChi.map((item) => (
                    <Select.Option
                      key={item.ten_lop_tin_chi}
                      value={`${item.id}||${item.ten_lop_tin_chi}`}
                    >
                      {item.ten_lop_tin_chi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* {!isNguoiDungCuThe && renderButtonImportExcel('danhSachLopTinChi')} */}
            </div>
          )}
          {(doiTuong === 'Khóa' || isNguoiDungCuThe) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả các khóa</div>}
                style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
                // rules={[...rules.required]}
                name="danhSachKhoaHoc"
                label={isNguoiDungCuThe ? 'Lọc theo khóa' : 'Khóa'}
                initialValue={
                  isNguoiDungCuThe
                    ? []
                    : record?.danhSachKhoaHoc?.map((item) => `${item.id}||${item.name}`)
                }
              >
                <Select
                  maxTagCount={8}
                  onChange={(val: string[]) => {
                    if (!isNguoiDungCuThe) return;
                    setConditionNguoiDungCuThe({
                      ...conditionNguoiDungCuThe,
                      khoaSinhVienIds:
                        val.length > 0 ? val?.map((item) => item?.split('||')?.[0]) : undefined,
                    });
                  }}
                  filterOption={(value, option) => includes(option?.props.children, value)}
                  showSearch
                  allowClear
                  mode="tags"
                  placeholder="Chọn khóa"
                >
                  {danhSachKhoaHoc?.map((item) => (
                    <Select.Option
                      key={item.display_name}
                      value={`${item.id}||${item.display_name}`}
                    >
                      {item.display_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* {!isNguoiDungCuThe && renderButtonImportExcel('danhSachKhoaHoc')} */}
            </div>
          )}
          {(doiTuong === 'Ngành' || isNguoiDungCuThe) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả các ngành</div>}
                style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
                // rules={[...rules.required]}
                name="danhSachNganhHoc"
                label={isNguoiDungCuThe ? 'Lọc theo ngành học' : 'Ngành học'}
                initialValue={
                  isNguoiDungCuThe
                    ? []
                    : record?.danhSachNganhHoc?.map((item) => `${item.id}||${item.name}`)
                }
              >
                <Select
                  maxTagCount={8}
                  onChange={(val: string[]) => {
                    if (!isNguoiDungCuThe) return;
                    setConditionNguoiDungCuThe({
                      ...conditionNguoiDungCuThe,
                      nganhIds:
                        val.length > 0 ? val?.map((item) => item?.split('||')?.[0]) : undefined,
                    });
                  }}
                  filterOption={(value, option) => includes(option?.props.children, value)}
                  showSearch
                  allowClear
                  mode="tags"
                  placeholder="Ngành học"
                >
                  {danhSachNganh.map((item) => (
                    <Select.Option
                      key={item.ten_nganh_viet_tat}
                      value={`${item.id}||${item.ten_nganh} (${item.ten_nganh_viet_tat})`}
                    >
                      {item.ten_nganh} ({item.ten_nganh_viet_tat})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* {!isNguoiDungCuThe && renderButtonImportExcel('danhSachNganhHoc')} */}
            </div>
          )}

          {doiTuong === 'Người dùng cụ thể' && (
            <div style={{ position: 'relative' }}>
              <Form.Item
                style={{ marginBottom: 8, marginRight: 8, width: '100%' }}
                rules={[...rules.required]}
                name="danhSachNguoiDung"
                label="Người dùng cụ thể"
                initialValue={record?.danhSachNguoiDung?.map(
                  (item) => `${item?.code}||${item?.name}`,
                )}
              >
                <Select
                  maxTagCount={8}
                  onSearch={(value) => {
                    debouncedSearchUser(value);
                  }}
                  showSearch
                  allowClear
                  mode="tags"
                  placeholder="Tìm kiếm theo mã định danh"
                  filterOption={(value, option) => includes(option?.props.children, value)}
                >
                  {danhSachNguoiDungCuThe.map((item) => (
                    <Select.Option key={item?.code} value={`${item?.code}||${item?.name}`}>
                      {item?.code}-{item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {renderButtonImportExcel('danhSachNguoiDung')}
            </div>
          )}
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
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Tiếp theo
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
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
          title={`Import ${TitleFormImport?.[ImportExcelType] ?? ''}`}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </>
  );
};

export default FormThongTinChungKhaoSat;
