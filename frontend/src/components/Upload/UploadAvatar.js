import { PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import _ from 'lodash';
import React from 'react';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isImg = file.type.split('/')[0] === 'image';
  if (!isImg) {
    message.error('Bạn chỉ có thể  chọn ảnh!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Dung lượng ảnh phải nhỏ hơn 2MB!');
  }
  return isLt2M;
  // return isJPG && isLt2M;
}

class UploadAvatar extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      loading: false,
      imageUrl: _.get(value, 'fileList[0].url', undefined),
    };
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState(
          {
            imageUrl,
            loading: false,
          },
          () => {
            this.triggerChange({ fileList: [info.file] });
          },
        );
      });
    }
  };

  render() {
    const { style } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Tải lên</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        disabled={this.props?.disabled ?? false}
        action={new Promise((resolve) => resolve({}))}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        onPreview={this.handlePreview}
        customRequest={({ onSuccess }) => {
          setTimeout(() => {
            onSuccess('ok');
          }, 0);
        }}
        accept="image/*"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        // fileList={this.state.fileList}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ ...style, objectFit: 'cover' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}
export default UploadAvatar;
