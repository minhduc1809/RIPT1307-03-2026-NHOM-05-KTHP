import TieuDe from '@/pages/DichVuMotCua/components/TieuDe';
import data from '@/utils/data';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormYeuCauCapGiayXacNhanTinhTrangHocTap = () => {
  const { loaiPhongBan, loaiGiayTo, record, setVisibleForm, edit, loading } =
    useModel('dichvumotcua');
  const [form] = Form.useForm();
  return (
    <Card title={loaiGiayTo}>
      <Form labelCol={{ span: 24 }} onFinish={async (values) => {}} form={form}>
        <TieuDe />
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Lưu' : 'Thêm'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormYeuCauCapGiayXacNhanTinhTrangHocTap;
