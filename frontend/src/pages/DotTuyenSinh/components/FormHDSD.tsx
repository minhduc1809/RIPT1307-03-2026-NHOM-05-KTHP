import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { checkFileSize, renderFileListUrl, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormHuongDanSuDung = () => {
  const [form] = Form.useForm();
  const {
    editHDSD: edit,
    setVisibleFormHDSD,
    recordHDSD,
    danhSachHDSD,
    setDanhSachHDSD,
  } = useModel('dottuyensinh');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        labelAlign="left"
        onFinish={async (values) => {
          const checkSize = checkFileSize(values?.tepDinhKem?.fileList ?? []);
          if (!checkSize) return;
          const tepDinhKem = await uploadMultiFile(values?.tepDinhKem?.fileList ?? []);
          const listHDSDTemp = [...danhSachHDSD];
          if (!edit) {
            listHDSDTemp.splice(0, 0, {
              ...values,
              tepDinhKem: tepDinhKem?.[0],
            });
          } else
            listHDSDTemp.splice(recordHDSD?.index ? recordHDSD.index - 1 : 0, 1, {
              ...recordHDSD,
              ...values,
              tepDinhKem: tepDinhKem?.[0],
            });
          setDanhSachHDSD(listHDSDTemp);
          setVisibleFormHDSD(false);
        }}
        form={form}
      >
        <Form.Item
          name="tenHuongDan"
          label="Tên hướng dẫn"
          rules={[...rules.required, ...rules.text]}
          initialValue={recordHDSD?.tenHuongDan}
        >
          <Input placeholder="Tên hướng dẫn" />
        </Form.Item>

        <Form.Item
          name="tepDinhKem"
          label="Tệp đính kèm"
          rules={[...rules.required]}
          initialValue={renderFileListUrl(recordHDSD?.tepDinhKem ?? '')}
        >
          <Upload
            otherProps={{
              accept: 'application/pdf, .doc, .docx',
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
            limit={1}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleFormHDSD(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormHuongDanSuDung;
