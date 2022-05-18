import rules from '@/utils/rules';
import { Button, Card, Form, Select } from 'antd';
import { useModel } from 'umi';

const FormChuyenDotNhapHoc = (props: { onCancel: any; paramCondition?: any }) => {
  const [form] = Form.useForm();
  const { loading, adminChuyenDotNhapHocModel, record, getKetQuaXetTuyenPageableModel } =
    useModel('ketquaxettuyen');
  const { record: recordDot } = useModel('dottuyensinh');

  const { danhSach } = useModel('dotnhaphoc');

  return (
    <Card title={'Chuyển đợt nhập học'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          await adminChuyenDotNhapHocModel(record?._id ?? '', values, recordDot?._id ?? '', () =>
            getKetQuaXetTuyenPageableModel(recordDot?._id ?? '', undefined, props?.paramCondition),
          );
          props?.onCancel();
        }}
        form={form}
      >
        <Form.Item rules={[...rules.required]} name="idDotNhapHoc" label="Đợt nhập học">
          <Select
            placeholder="Chọn đợt"
            options={danhSach
              ?.filter((item) => item._id !== record?.idDotNhapHoc?._id)
              ?.map((item) => ({
                value: item._id,
                label: item.tenDot,
              }))}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => props?.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormChuyenDotNhapHoc;
