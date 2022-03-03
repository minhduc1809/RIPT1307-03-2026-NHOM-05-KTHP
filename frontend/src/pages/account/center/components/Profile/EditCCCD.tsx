import rules from '@/utils/rules';
import { Button, DatePicker, Form, Input } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const EditCCCD = () => {
  const [form] = Form.useForm();
  const { updateCCCDModel } = useModel('user');
  const { initialState } = useModel('@@initialState');
  return (
    <div style={{ textAlign: 'center' }}>
      <Form
        onFinish={(values) => {
          updateCCCDModel(values);
        }}
        labelCol={{ span: 24 }}
        style={{ width: '50%', textAlign: 'center' }}
        form={form}
      >
        <Form.Item
          initialValue={initialState?.currentUser?.cmtCccd}
          rules={[...rules.required, ...rules.CMND]}
          name="cmtCccd"
          label="Số CMT/CCCD"
        >
          <Input placeholder="Nhập số CMT/CCCD" />
        </Form.Item>

        <Form.Item
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
        </Form.Item>
        <Form.Item
          initialValue={initialState?.currentUser?.noiCapCmtCccd}
          name="noiCapCmtCccd"
          rules={[...rules.required]}
          label="Nơi cấp"
        >
          <Input.TextArea rows={2} placeholder="Nhập nơi cấp" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCCCD;
