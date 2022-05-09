import { FormItem } from '@/components/FormItem';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { checkFileSize, renderFileList, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';

const FormGiayTo = (props: { fieldName: 'danhSachGiayToCanNop' }) => {
  const [form] = Form.useForm();
  const modelDotTuyenSinh = useModel('dotnhaphoc');
  const { editGiayTo: edit, setVisibleFormGiayTo, recordGiayTo } = modelDotTuyenSinh;

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} giấy tờ`}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const checkSize = checkFileSize(values?.urlHuongDan?.fileList ?? []);
          if (!checkSize) return;
          const urlHuongDan = await uploadMultiFile(values?.urlHuongDan?.fileList);
          const listGiayToTemp = [...modelDotTuyenSinh?.[props.fieldName]];
          if (!edit) {
            listGiayToTemp.push({ ...values, urlHuongDan });
          } else
            listGiayToTemp.splice(recordGiayTo?.index ? recordGiayTo.index - 1 : 0, 1, {
              ...values,
              urlHuongDan,
            });
          modelDotTuyenSinh?.[`set${props.fieldName}`](listGiayToTemp);
          setVisibleFormGiayTo(false);
        }}
        form={form}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            {' '}
            <FormItem
              rules={[...rules.required]}
              name="maGiayTo"
              label="Mã giấy tờ"
              initialValue={recordGiayTo?.maGiayTo}
            >
              <Input placeholder="Mã giấy tờ" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              name={'ten'}
              label="Tên giấy tờ"
              initialValue={recordGiayTo?.ten}
              rules={[...rules.required]}
            >
              <Input placeholder="Tên giấy tờ" />
            </FormItem>
          </Col>

          <Col span={24}>
            <FormItem
              name="textHuongDan"
              label="Hướng dẫn"
              rules={[...rules.text]}
              initialValue={recordGiayTo?.textHuongDan}
            >
              <Input.TextArea rows={3} placeholder="Hướng dẫn" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              extra={<div>Tối đa 5 file, kích thước mỗi file không quá 8MB.</div>}
              initialValue={renderFileList(recordGiayTo?.urlHuongDan ?? [])}
              label={'File hướng dẫn'}
              name="urlHuongDan"
            >
              <Upload
                otherProps={{
                  accept: 'application/pdf, image/png, .jpg, .doc, .docx',
                  multiple: true,
                  showUploadList: { showDownloadIcon: false },
                }}
                limit={5}
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button
            onClick={() => {
              setVisibleFormGiayTo(false);
            }}
          >
            Đóng
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default FormGiayTo;
