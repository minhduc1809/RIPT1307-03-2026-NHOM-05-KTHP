import Upload from '@/components/Upload/UploadMultiFile';
import { Button, Card, Form } from 'antd';
import XLSX from 'xlsx';

const ImportExcel = (props: { onCancel: any; title?: string; handleData: any }) => {
  const [form] = Form.useForm();

  const handleFile = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const ab = e.target.result;
      const wb = XLSX.read(ab, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data.shift();
      props?.handleData(data);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card title={props?.title ?? 'Import dữ liệu'}>
      <Form
        onFinish={async (values) => {
          handleFile(values?.file?.fileList?.[0]?.originFileObj);
        }}
        form={form}
      >
        <Form.Item label="File excel" name="file">
          <Upload
            otherProps={{
              maxCount: 1,
              accept: '.xls, .xlsx, .ods',
              multiple: false,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Import
          </Button>
          <Button onClick={() => props?.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ImportExcel;
