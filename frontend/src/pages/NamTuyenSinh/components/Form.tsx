/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg, renderFileListUrl } from '@/utils/utils';

const FormNamTuyenSinh = () => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, postNamTuyenSinhModel, edit, record, putNamTuyenSinhModel } =
    useModel('namtuyensinh');
  const { danhSach } = useModel('hinhthucdaotao');
  const { danhSach: danhSachPhuongThuc } = useModel('phuongthuctuyensinh');
  return (
    <Card loading={loading} title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} năm tuyển sinh`}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (values.urlAnhMoTa.fileList?.[0]?.originFileObj) {
            const response = await getURLImg({
              filename: 'url1',
              public: true,
              file: values?.urlAnhMoTa.fileList?.[0].originFileObj,
            });
            values.urlAnhMoTa = response?.data?.data?.url;
          } else values.urlAnhMoTa = values.urlAnhMoTa.fileList?.[0]?.url;
          if (edit) {
            putNamTuyenSinhModel(record?._id ?? '', {
              ...values,
              noiDung: values?.noiDung?.text ?? '',
            });
          } else {
            postNamTuyenSinhModel({ ...values, noiDung: values?.noiDung?.text ?? '' });
          }
        }}
        form={form}
      >
        <Form.Item
          initialValue={record?.hinhThucDaoTao}
          name="hinhThucDaoTao"
          label="Hình thức đào tạo"
          rules={[...rules.required]}
        >
          <Select
            placeholder="Hình thức đào tạo"
            options={danhSach?.map((item) => ({ value: item._id, label: item.ten }))}
          />
        </Form.Item>
        <Form.Item initialValue={record?.nam} rules={[...rules.required]} name="nam" label="Năm">
          <InputNumber
            placeholder="Năm tuyển sinh"
            style={{ width: '100%' }}
            max={2030}
            min={2010}
          />
        </Form.Item>
        <Form.Item
          name="danhSachPhuongThuc"
          label="Phương thức tuyển sinh"
          initialValue={record?.danhSachPhuongThuc?.map((item) => item._id)}
          rules={[...rules.required]}
        >
          <Select
            placeholder="Phương thức tuyển sinh"
            mode="multiple"
            options={danhSachPhuongThuc?.map((item) => ({
              value: item._id,
              label: item.tenPhuongThuc,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="urlAnhMoTa"
          label="Ảnh mô tả"
          initialValue={renderFileListUrl(record?.urlAnhMoTa ?? '')}
          // rules={[...rules.fileRequired]}
        >
          <UploadAvatar
            style={{
              width: 102,
              maxWidth: 102,
              height: 102,
              maxHeight: 102,
            }}
          />
        </Form.Item>
        <Form.Item initialValue={record?.moTa} name="moTa" label="Mô tả">
          <Input.TextArea placeholder="Mô tả" rows={2} />
        </Form.Item>
        <Form.Item
          name="noiDung"
          label="Nội dung"
          initialValue={{ text: record?.noiDung || '' }}
          rules={[...rules.textEditor]}
        >
          <TinyEditor height={350} />
        </Form.Item>
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

export default FormNamTuyenSinh;
