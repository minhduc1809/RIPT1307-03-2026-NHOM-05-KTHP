import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileListUrl, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Form, Input, Spin } from 'antd';
import { useModel } from 'umi';

const FormHuongDanSuDung = () => {
  const [form] = Form.useForm();
  const {
    edit,
    record,
    setVisibleForm,
    loading,
    postHuongDanSuDungModel,
    putHuongDanSuDungModel,
    setLoading,
  } = useModel('huongdansudung');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form
          labelCol={{ span: 24 }}
          labelAlign="left"
          onFinish={async (values) => {
            setLoading(true);
            const tepDinhKem = await uploadMultiFile(values?.tepDinhKem?.fileList ?? []);
            if (edit)
              putHuongDanSuDungModel(record?._id ?? '', { ...values, tepDinhKem: tepDinhKem?.[0] });
            else postHuongDanSuDungModel({ ...values, tepDinhKem: tepDinhKem?.[0] });
          }}
          form={form}
        >
          <Form.Item
            name="tenHuongDan"
            label="Tên hướng dẫn"
            rules={[...rules.required, ...rules.text, ...rules.length(100)]}
            initialValue={record?.tenHuongDan}
          >
            <Input placeholder="Tên hướng dẫn" />
          </Form.Item>

          <Form.Item
            name="tepDinhKem"
            label="Tệp đính kèm"
            rules={[...rules.required]}
            initialValue={renderFileListUrl(record?.tepDinhKem ?? '')}
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
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              {!edit ? 'Thêm mới' : 'Lưu'}
            </Button>
            <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
export default FormHuongDanSuDung;
