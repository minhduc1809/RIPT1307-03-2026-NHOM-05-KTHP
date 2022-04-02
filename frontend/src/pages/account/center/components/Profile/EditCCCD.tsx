import { FormItem } from '@/components/FormItem';
import rules from '@/utils/rules';
import { toISOString } from '@/utils/utils';
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const EditCCCD = () => {
  const [form] = Form.useForm();
  const { updateCCCDModel } = useModel('user');
  const { initialState } = useModel('@@initialState');
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <Form
        onFinish={(values) => {
          values.ngayCapCmtCccd = toISOString(values?.ngayCapCmtCccd);
          values.ngaySinh = toISOString(values?.ngaySinh);
          updateCCCDModel(values);
        }}
        labelCol={{ span: 24 }}
        style={{
          width: 350,
          textAlign: 'center',
        }}
        form={form}
      >
        <FormItem
          initialValue={initialState?.currentUser?.cmtCccd}
          rules={[...rules.required, ...rules.CMND]}
          name="cmtCccd"
          label="Số CMT/CCCD"
        >
          <Input placeholder="Nhập số CMT/CCCD" />
        </FormItem>

        <FormItem
          initialValue={
            initialState?.currentUser?.ngayCapCmtCccd
              ? moment(initialState?.currentUser?.ngayCapCmtCccd)
              : undefined
          }
          name="ngayCapCmtCccd"
          rules={[...rules.required]}
          label="Ngày cấp"
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={(cur) => moment(cur).isAfter(moment())}
            placeholder="Ngày cấp"
          />
        </FormItem>
        <FormItem
          initialValue={initialState?.currentUser?.noiCapCmtCccd}
          name="noiCapCmtCccd"
          rules={[...rules.required, ...rules.text]}
          label="Nơi cấp"
        >
          <Input.TextArea rows={2} placeholder="Nhập nơi cấp" />
        </FormItem>
        <Row gutter={[10, 0]}>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={initialState?.currentUser?.hoDem}
              name="hoDem"
              label="Họ đệm"
              rules={[...rules.required, ...rules.ten]}
            >
              <Input placeholder="Họ đệm" />
            </FormItem>
          </Col>
          <Col xs={24} lg={12}>
            <FormItem
              initialValue={initialState?.currentUser?.ten}
              name="ten"
              label="Tên"
              rules={[...rules.required, ...rules.ten]}
            >
              <Input placeholder="Tên" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              initialValue={
                initialState?.currentUser?.ngaySinh
                  ? moment(initialState?.currentUser?.ngaySinh)
                  : undefined
              }
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
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              initialValue={initialState?.currentUser?.email}
              label="Email"
              rules={[...rules.email, ...rules.required]}
              name="email"
            >
              <Input placeholder="email" />
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default EditCCCD;
