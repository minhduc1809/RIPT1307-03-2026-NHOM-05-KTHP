import rules from '@/utils/rules';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';
import styles from './form.css';
import BlockNganh from './BlockNganh';
import TinyEditor from '@/components/TinyEditor/Tiny';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormDotTuyenSinh = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postDotTuyenSinhModel, edit, record, putDotTuyenSinhModel } =
    useModel('dottuyensinh');
  const { danhSach } = useModel('namtuyensinh');
  const { danhSach: danhSachHinhThucDaoTao } = useModel('hinhthucdaotao');
  const { danhSach: danhSachDoiTuongTuyenSinh } = useModel('doituongtuyensinh');
  const [recordNamTuyenSinh, setRecordNamTuyenSinh] = useState<NamTuyenSinh.Record | undefined>(
    danhSach?.find((item) => item.nam === record?.namTuyenSinh),
  );
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<string>(record?.hinhThucDaoTao?._id ?? '');
  const [choPhepThanhToan, setChoPhepThanhToan] = useState<boolean>(true);
  return (
    <Card loading={loading} title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} đợt tuyển sinh`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          values.danhSachDoiTuongTuyenSinh = values?.danhSachDoiTuongTuyenSinh?.map(
            (item: string) => ({ maDoiTuong: item }),
          );
          if (edit) {
            putDotTuyenSinhModel(record?._id ?? '', {
              ...record,
              ...values,
              moTa: values?.moTa?.text,
              cauHinhPhuongThuc: {},
            });
          } else {
            postDotTuyenSinhModel({
              ...values,
              moTa: values?.moTa?.text,
              cauHinhPhuongThuc: {},
            });
          }
        }}
        form={form}
      >
        <Row gutter={[12, 0]}>
          <Col xs={24}>
            <Form.Item
              initialValue={record?.tenDotTuyenSinh}
              name="tenDotTuyenSinh"
              label="Tên đợt tuyển sinh"
              rules={[...rules.required]}
            >
              <Input placeholder="Tên đợt tuyển sinh" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              initialValue={record?.hinhThucDaoTao?._id}
              name="hinhThucDaoTao"
              label="Hình thức đào tạo"
              rules={[...rules.required]}
            >
              <Select
                allowClear
                onChange={(val) => {
                  setHinhThucDaoTao(val);
                  form.setFieldsValue({
                    namTuyenSinh: undefined,
                  });
                }}
                placeholder="Hình thức đào tạo"
                options={danhSachHinhThucDaoTao?.map((item) => ({
                  value: item._id,
                  label: item.ten,
                }))}
              />
            </Form.Item>{' '}
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.maDotTuyenSinh}
              name="maDotTuyenSinh"
              label="Mã đợt tuyển sinh"
              rules={[...rules.required]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={1000000}
                placeholder="Mã đợt tuyển sinh"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.maThanhToanDot}
              name="maThanhToanDot"
              label="Mã thanh toán đợt"
              rules={[...rules.required]}
            >
              <Input placeholder="Mã thanh toán đợt" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              initialValue={record?.namTuyenSinh}
              name="namTuyenSinh"
              label="Năm tuyển sinh"
              rules={[...rules.required]}
            >
              <Select
                notFoundContent="Bạn chưa chọn hình thức đào tạo hoặc không có năm tuyển sinh nào cho hình thức đào tạo này"
                onChange={(val) => {
                  form.setFieldsValue({
                    phuongThucTuyenSinh: undefined,
                  });
                  setRecordNamTuyenSinh(danhSach?.find((item) => item.nam === val));
                }}
                placeholder="Năm tuyển sinh"
                options={danhSach
                  ?.filter((item) => item.hinhThucDaoTao._id === hinhThucDaoTao)
                  ?.map((item) => ({ value: item.nam, label: item.nam }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="phuongThucTuyenSinh"
              label="Phương thức tuyển sinh"
              initialValue={record?.phuongThucTuyenSinh?._id}
              rules={[...rules.required]}
            >
              <Select
                notFoundContent="Bạn chưa chọn năm tuyển sinh"
                placeholder="Phương thức tuyển sinh"
                options={recordNamTuyenSinh?.danhSachPhuongThuc?.map((item) => ({
                  value: item.phuongThucTuyenSinh._id,
                  label: item.phuongThucTuyenSinh.tenPhuongThuc,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="danhSachDoiTuongTuyenSinh"
              label="Đối tượng tuyển sinh"
              initialValue={record?.danhSachDoiTuongTuyenSinh?.map((item) => item.maDoiTuong)}
              rules={[...rules.required]}
            >
              <Select
                mode="multiple"
                notFoundContent="Bạn chưa chọn hình thức đào tạo hoặc không có đối tượng tuyển sinh nào cho hình thức đào tạo này"
                placeholder="Đối tượng tuyển sinh"
                options={danhSachDoiTuongTuyenSinh?.map((item) => ({
                  value: item.maDoiTuong,
                  label: item.tenDoiTuong,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.List
              name="danhSachNganhTuyenSinh"
              initialValue={
                record?.danhSachNganhTuyenSinh?.map((item) => ({
                  ...item,
                  nganh: item?.nganh?._id,
                  danhSachCoSoDaoTao: item?.danhSachCoSoDaoTao?.map((coSo) => coSo._id),
                })) ?? []
              }
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(new Error('Ít nhất 1 ngành'));
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
                          size="small"
                          headStyle={{ padding: '0px 24px' }}
                          bodyStyle={{ padding: '8px 24px' }}
                          className={styles.block}
                          title={
                            <>
                              <div style={{ float: 'left' }}>Ngành {index + 1}</div>
                              <CloseCircleOutlined
                                style={{ float: 'right', marginLeft: 8 }}
                                onClick={() => remove(field.name)}
                              />
                            </>
                          }
                        >
                          <BlockNganh
                            fieldName={`danhSachNganhTuyenSinh.[${index}]`}
                            field={{ ...field }}
                          />
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
          </Col>
          <Col xs={24}>
            <Form.Item
              name={'moTa'}
              label={`Mô tả`}
              initialValue={{ text: record?.moTa || '' }}
              rules={[...rules.textEditor]}
            >
              <TinyEditor height={350} />
            </Form.Item>
          </Col>
          {[
            { name: 'thoiGianMoDangKy', label: 'Thời gian mở đăng ký' },
            { name: 'thoiGianKetThucNopHoSo', label: 'Thời gian kết thúc nộp hồ sơ' },
            {
              name: 'thoiGianBatDauKhaiBaoKetQuaThiTHPT',
              label: 'Thời gian bắt đầu khai báo KQ thi THPT',
            },
            {
              name: 'thoiGianKetThucKhaiBaoKetQuaThiTHPT',
              label: 'Thời gian kết thúc khai báo KQ thi THPT',
            },
            { name: 'thoiGianCongBoKetQua', label: 'Thời gian công bố kết quả' },
            { name: 'thoiGianBatDauXacNhanNhapHoc', label: 'Thời gian bắt đầu xác nhận nhập học' },
            {
              name: 'thoiGianKetThucXacNhanNhapHoc',
              label: 'Thời gian kết thúc xác nhận nhập học',
            },
          ].map((item) => (
            <Col key={item.name} xs={24} md={12}>
              <Form.Item
                name={item.name}
                label={item.label}
                rules={[...rules.required]}
                initialValue={record?.[item.name] ? moment(record?.[item.name]) : undefined}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="HH:mm DD/MM/YYYY"
                  placeholder={item.label}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Form.Item name={'choPhepThanhToan'} initialValue={true}>
              <Checkbox
                checked={choPhepThanhToan}
                onChange={(e) => {
                  setChoPhepThanhToan(e.target.checked);
                }}
              />{' '}
              Cho phép thanh toán
            </Form.Item>
          </Col>
          {choPhepThanhToan && (
            <>
              <Col style={{ marginTop: '-12px' }} md={12}>
                <Form.Item
                  name="mucLePhi"
                  label="Mức lệ phí"
                  rules={[...rules.required]}
                  // initialValue={record?.currentPrice?.unitAmount}
                >
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                    placeholder="Mức lệ phí"
                    max={10000000}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col style={{ marginTop: '-12px' }} md={12}>
                <Form.Item
                  name="donViTinh"
                  label="Đơn vị tính"
                  // initialValue={record?.unitLabel}
                  rules={[...rules.required]}
                >
                  <Select
                    options={['Hồ sơ', 'Nguyện vọng'].map((item) => ({ value: item, label: item }))}
                    placeholder="Đơn vị tính"
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormDotTuyenSinh;
