import { Button, Card, Form, Input, message } from 'antd';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { checkFileSize, uploadMultiFile } from '@/utils/utils';
import { postIssue } from '@/services/TechnicalSupport/technicalsupport';
import { useState } from 'react';
import { Setting } from '@/utils/constants';

const FormPostIssue = (props: { onCancel: any }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Card title="Phản hồi kĩ thuật">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          setLoading(true);
          const checkSize = checkFileSize(values?.urlFile?.fileList ?? []);
          if (!checkSize) return;
          const urlFileDinhKem = await uploadMultiFile(values?.urlFile?.fileList);
          try {
            await postIssue({
              ...values,
              imageUrlList: urlFileDinhKem,
              os: navigator.platform,
              osVersion: navigator.platform,
              appVersion: Setting.version,
            });
            message.success('Gửi thành công');
            setLoading(false);
            props.onCancel();
          } catch (err) {
            setLoading(false);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
          }
        }}
        form={form}
      >
        <Form.Item rules={[...rules.required]} name="detail" label="Mô tả chi tiết">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết" />
        </Form.Item>
        <Form.Item
          extra={<div>Tối đa 3 ảnh, dung lượng mỗi ảnh không quá 25Mb.</div>}
          name="imageUrlList"
          label="Ảnh đính kèm"
        >
          <Upload
            otherProps={{
              maxCount: 3,
              multiple: true,
              accept: 'image/*',
              showUploadList: { showDownloadIcon: false },
            }}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>
          <Button onClick={() => props.onCancel()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormPostIssue;
