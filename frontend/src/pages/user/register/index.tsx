import { Setting } from '@/utils/constants';
import rules from '@/utils/rules';
import { toISOString } from '@/utils/utils';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const Register = (props: { back: any }) => {
  const [form] = Form.useForm();
  // const [thongTinUser, setThongTinUser] = useState<any>({});
  const { registerModel } = useModel('user');
  useEffect(() => {
    form.setFieldsValue({
      email: undefined,
      password: undefined,
    });
  }, []);

  return (
    <div className={styles.main}>
      <Form
        onFinish={(values) => {
          registerModel({ ...values, ngaySinh: toISOString(values?.ngaySinh) });
          // setThongTinUser(values);
        }}
        labelCol={{ span: 24 }}
        form={form}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: 36,
            color: Setting.primaryColor,
          }}
        >
          Đăng ký tài khoản
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              color: Setting.primaryColor,
              fontSize: 18,
            }}
          >
            Thông tin đăng ký
          </span>
          <div style={{ height: 2, width: 150, backgroundColor: Setting.primaryColor }} />
        </div>
        <div style={{ height: 600, overflowY: 'auto', overflowX: 'hidden' }}>
          <Form.Item
            style={{ marginBottom: 8 }}
            name="email"
            label="Email"
            rules={[...rules.required, ...rules.email]}
            // initialValue={thongTinUser?.email}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
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
            // initialValue={thongTinUser?.confirmEmail}
          >
            <Input placeholder="Nhập lại email" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            name="password"
            label="Mật khẩu"
            rules={[...rules.required, ...rules.password]}
            // initialValue={thongTinUser?.password}
          >
            <Input type="password" placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            name="confirm"
            label="Nhập lại mật khẩu"
            rules={[
              ...rules.password,
              {
                required: true,
                message: 'Bắt buộc',
              },
              {
                validator: (rule, value, callback) => {
                  if (value && value !== form.getFieldValue('password')) {
                    callback('Mật khẩu không trùng khớp');
                  } else {
                    callback();
                  }
                },
              },
            ]}
            // initialValue={thongTinUser?.confirm}
          >
            <Input type="password" placeholder="Nhập lại mật khẩu" />
          </Form.Item>
          <Row gutter={[12, 0]}>
            <Col xs={24} md={14}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="hoDem"
                label="Họ đệm"
                rules={[...rules.required, ...rules.ten]}
                // initialValue={thongTinUser?.hoTen}
              >
                <Input placeholder="Họ đệm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="ten"
                label="Tên"
                rules={[...rules.required, ...rules.ten]}
                // initialValue={thongTinUser?.hoTen}
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="ngaySinh"
                label="Ngày sinh"
                rules={[...rules.required]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabledDate={(cur) => moment(cur).isAfter(moment())}
                  placeholder="Ngày sinh"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="gioiTinh"
                label="Giới tính"
                rules={[...rules.required]}
              >
                <Select
                  placeholder="Giới tính"
                  options={[
                    { value: 'NAM', label: 'Nam' },
                    { value: 'NU', label: 'Nữ' },
                    { value: 'KHAC', label: 'Khác' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="soDienThoai"
                label="Số điện thoại"
                rules={[...rules.soDienThoai, ...rules.required]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
          <Button
            type="link"
            onClick={() => {
              props.back();
            }}
          >
            Đã có tài khoản?
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
