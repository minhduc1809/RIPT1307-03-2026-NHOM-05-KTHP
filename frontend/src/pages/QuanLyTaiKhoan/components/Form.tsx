import type { ESystemRole } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel, useAccess } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormTaiKhoan = (props: { systemRole: ESystemRole }) => {
  const access = useAccess();
  const [form] = Form.useForm();
  const { loading, setVisibleForm, edit, record, postUserModel, putUserModel } =
    useModel('quanlytaikhoan');
  const { danhSach: danhSachHinhThuc } = useModel('hinhthucdaotao');
  const { danhSach: danhSachCoSo } = useModel('cosodaotao');

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} tài khoản`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putUserModel(record?._id ?? '', {
              ...record,
              ...values,
              idHinhThucDaoTao: values?.idHinhThucDaoTao ?? null,
              idCoSoDaoTao: values?.idCoSoDaoTao ?? null,
            });
          } else {
            postUserModel({
              ...values,
              systemRole: props.systemRole,
              username: values?.email?.trim()?.toLowerCase(),
            });
          }
        }}
        form={form}
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          name="email"
          label="Email"
          rules={[...rules.required, ...rules.email]}
          initialValue={record?.email}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        {!edit && (
          <Form.Item
            style={{ marginBottom: 8 }}
            name="confirmEmail"
            label="Nhập lại email"
            rules={[
              ...rules.required,
              ...rules.email,
              {
                validator: (rule, value, callback) => {
                  if (value && value !== form.getFieldValue('email')) {
                    callback('Email không trùng khớp');
                  } else {
                    callback();
                  }
                },
              },
            ]}
          >
            <Input placeholder="Nhập lại email" />
          </Form.Item>
        )}
        {!edit && (
          <Form.Item
            extra={
              <div>
                Nếu không nhập mật khẩu, hệ thống sẽ tự động cấp mật khẩu mặc định cho tài khoản
              </div>
            }
            style={{ marginBottom: 8 }}
            name="password"
            label="Mật khẩu"
            rules={[...rules.password]}
          >
            <Input placeholder="Nhập mật khẩu" />
          </Form.Item>
        )}

        <Row gutter={[12, 0]}>
          <Col xs={24} md={8}>
            <Form.Item
              style={{ marginBottom: 8 }}
              name="hoDem"
              label="Họ đệm"
              rules={[...rules.required, ...rules.ten]}
              initialValue={record?.hoDem}
            >
              <Input placeholder="Họ đệm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              style={{ marginBottom: 8 }}
              name="ten"
              label="Tên"
              rules={[...rules.required, ...rules.ten]}
              initialValue={record?.ten}
            >
              <Input placeholder="Tên" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              style={{ marginBottom: 8 }}
              name="ngaySinh"
              label="Ngày sinh"
              rules={[...rules.required]}
              initialValue={record?.ngaySinh ? moment(record?.ngaySinh) : undefined}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                placeholder="Ngày sinh"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              style={{ marginBottom: 8 }}
              name="gioiTinh"
              label="Giới tính"
              rules={[...rules.required]}
              initialValue={record?.gioiTinh}
            >
              <Select
                placeholder="Giới tính"
                options={[
                  { value: 'Nam', label: 'Nam' },
                  { value: 'Nữ', label: 'Nữ' },
                  { value: 'Khác', label: 'Khác' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              style={{ marginBottom: 8 }}
              name="soDienThoai"
              label="Số điện thoại"
              rules={[...rules.soDienThoai, ...rules.required]}
              initialValue={record?.soDienThoai}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>

          {access.admin && (
            <>
              <Col md={8}>
                <Form.Item
                  style={{ marginBottom: 8 }}
                  name="idHinhThucDaoTao"
                  label="Hình thức đào tạo"
                  initialValue={record?.idHinhThucDaoTao}
                >
                  <Select
                    allowClear
                    placeholder="Chọn hình thức"
                    options={danhSachHinhThuc?.map((item) => ({
                      value: item._id,
                      label: item?.ten,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  style={{ marginBottom: 8 }}
                  name="idCoSoDaoTao"
                  label="Cơ sở đào tạo"
                  initialValue={record?.idCoSoDaoTao}
                >
                  <Select
                    allowClear
                    placeholder="Chọn cơ sở"
                    options={danhSachCoSo?.map((item) => ({ value: item._id, label: item?.ten }))}
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

export default FormTaiKhoan;
