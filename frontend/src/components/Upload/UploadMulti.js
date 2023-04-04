import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import React from 'react';
/**
 * @param
 */
class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: props.fileList || [],
      angle: 0,
    };
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };

  rotate = (ang) => {
    let { angle } = this.state;
    angle += ang;
    this.setState({ angle });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    this.triggerChange({ fileList });
  };

  handlePreview = (item) => {
    this.setState({
      previewImage: item.thumbUrl || item.url,
      previewVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };

  render() {
    const { uploadProps } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <Button>
        <UploadOutlined /> Upload
      </Button>
    );
    const disabled = !!uploadProps?.disabled;
    return (
      <div style={{ marginBottom: 0 }}>
        <Upload
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              onSuccess('ok');
            }, 0);
          }}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          {...(uploadProps || {})}
        >
          {!disabled && uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={[
            <Button onClick={() => this.rotate(-90)}>Xoay trái</Button>,
            <Button onClick={() => this.rotate(90)}>Xoay phải</Button>,
          ]}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{
              width: '100%',
              transform: `rotate(${this.state.angle}deg)`,
              transition: 'transform 0.3s',
            }}
            src={previewImage}
          />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
