import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';
/**
 * @param
 */
class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.value.fileList || [],
    };
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };

  handleChange = ({ fileList }) => {
    let list;
    if (fileList.length > 0) list = [fileList[fileList.length - 1]];
    else list = [];
    this.setState({ fileList: list });
    this.triggerChange({ fileList: list });
  };

  render() {
    const { fileList } = this.state;
    return (
      <div className="clearfix">
        <Upload
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              onSuccess('ok');
            }, 0);
          }}
          fileList={fileList}
          onChange={this.handleChange}
          // accept="application/pdf"
          {...(this.props.otherProps || {})}
        >
          <Button>
            <UploadOutlined />
            Tải lên
          </Button>
        </Upload>
      </div>
    );
  }
}

export default PicturesWall;
