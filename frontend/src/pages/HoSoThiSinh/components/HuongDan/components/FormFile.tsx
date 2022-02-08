/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import UploadOne from '@/components/Upload/UploadOne';
import { uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrlWithName } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormFile = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleFormFile, editFile, putThuMucModel, recordFile, setLoading } =
    useModel('vanbanhuongdan');
  return (
    <Card title={editFile ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: VanBanHuongDan.TepTin) => {
          setLoading(true);
          if (values?.taiLieu?.fileList?.[0]?.url) {
            values.url = values?.taiLieu?.fileList?.[0]?.url;
          } else {
            const response = await uploadFile({
              file: values?.taiLieu?.fileList?.[0]?.originFileObj,
              filename: 'fileName',
              public: 'true',
            });
            values.url = response?.data?.data?.url;
          }
          delete values.taiLieu;
          if (editFile) {
            const index = recordFile?.index - 1;
            record.danhSachTep[index] = values;
          } else {
            record.danhSachTep.push(values);
          }
          putThuMucModel({ id: record._id, data: record });
        }}
        form={form}
      >
        <Form.Item
          name="ten"
          label="Tên văn bản"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={recordFile?.ten}
        >
          <Input placeholder="Tên văn bản" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.text, ...rules.length(200)]}
          initialValue={recordFile?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Mô tả" />
        </Form.Item>
        <Form.Item
          name="taiLieu"
          rules={[...rules.fileRequired]}
          initialValue={renderFileListUrlWithName(recordFile.url, recordFile?.ten)}
          label="Tài liệu"
        >
          <UploadOne />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!editFile ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormFile;
