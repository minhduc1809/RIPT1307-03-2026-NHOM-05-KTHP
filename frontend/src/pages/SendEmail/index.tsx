// import TinyEditor from '@/components/TinyEditor/Tiny';
import { Row, Col, Form, Input, Card, Button, Modal } from 'antd';
import { useModel } from 'umi';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import ViewEmail from './components/ViewEmail';

const Index = () => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { record, loading, SendEmailPreviewModel, setVisibleForm, visible, setVisible } =
    useModel('sendemail');
  return (
    <>
      <Card title="Gửi Email">
        <Form
          scrollToFirstError
          labelCol={{ span: 24 }}
          onFinish={async (values) => {
            const content = values?.content;
            const subject = values?.subject;
            const file = values?.file?.fileList[0].originFileObj;
            SendEmailPreviewModel({ content, subject, file });
            form.resetFields();
          }}
          form={form}
        >
          <Row>
            <Col xs={24}>
              <Form.Item
                name="subject"
                label="Tiêu đề"
                initialValue={record?.subject}
                rules={[...rules.text]}
              >
                <Input placeholder="Tiêu đề" />
              </Form.Item>

              <Form.Item
                // initialValue={{ file: record?.file?.fileList[0].originFileObj || '' }}
                rules={[...rules.fileRequired]}
                name="file"
                label={<b>Chọn tệp tin mà bạn muốn gửi</b>}
              >
                <Upload
                  otherProps={{
                    accept: '.xlsx',
                    multiple: true,
                    showUploadList: { showDownloadIcon: false },
                  }}
                  limit={1}
                />
              </Form.Item>

              <Form.Item
                name="content"
                label="Nội dung"
                initialValue={record?.content || ''}
                rules={[...rules.text]}
              >
                {/* <TinyEditor height={350} /> */}
                <TextArea placeholder="Nhập nội dung" rows={6} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button loading={loading} onClick={() => setVisibleForm(true)} type="primary">
              Send Email
            </Button>

            <Button loading={loading} style={{ marginLeft: 8 }} htmlType="submit">
              Preview
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button type="primary" onClick={() => setVisible(false)}>
            OK
          </Button>
        }
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Chi tiết email"
      >
        <ViewEmail record={record} />
      </Modal>
    </>
  );
};

export default Index;
