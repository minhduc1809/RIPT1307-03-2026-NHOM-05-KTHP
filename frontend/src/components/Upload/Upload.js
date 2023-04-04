import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import _ from 'lodash';
import React from 'react';
/**
 * @param
 */

export function getBase64(img, callback) {
  if (img === undefined || img === '') return;
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: '',
      previewImage: '',
      fileList: props.value ? props.value.fileList : [],
      imageUrl: _.get(props, 'value.fileList[0].url', undefined),
    };
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  /**
   * Tính năng xem trước ảnh
   */
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true, imageUrl: undefined });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
      this.triggerChange({ fileList: [info.file] });
    }
  };

  beforeUpload = (file) => {
    const isImg = file.type.split('/')[0] === 'image';
    if (!isImg) {
      message.error('Bạn chỉ có thể  chọn ảnh!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Dung lượng ảnh phải nhỏ hơn 2MB!');
    }
    return isImg && isLt2M;
  };

  render() {
    const { previewVisible, previewImage, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Tải ảnh</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          disabled={this.props?.disabled ?? false}
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              onSuccess('ok');
            }, 0);
          }}
          listType="picture-card"
          className="avatar-uploader"
          // fileList={fileList}
          accept="image/*"
          showUploadList={false}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ maxHeight: 200 }} /> : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
