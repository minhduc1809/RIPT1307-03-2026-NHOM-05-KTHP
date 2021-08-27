import { Upload, Icon, message } from 'antd';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'http://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  height: '100%',
  overflow: 'auto',
};

const UploadDocs = props => {
  const { data } = props;
  if (data) return <Upload name="Tài liệu" fileList={data} action="https://www.mocky.io/v2/5cc8019d300000980a055e76" />;
  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">Click chuột hoặc kéo thả tài liệu để tải lên</p>
        <p className="ant-upload-hint">{props.message}</p>
      </Dragger>
    </div>
  );
};

export default UploadDocs;
