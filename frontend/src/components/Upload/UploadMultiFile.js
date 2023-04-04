import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import React from 'react';
/**
 * @param
 */
class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.fileList || (props.value && props.value.fileList) || [],
    };
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };

  handleChange = ({ fileList }) => {
    const arr = fileList;
    let { limit } = this.props;
    limit = limit || 10;
    const findLargeFile = fileList?.find((file) => file.size / 1024 / 1024 > 25);
    const findWrongTypeFile = fileList?.find((file) => {
      const arrFileName = file.name.split('.');
      return (
        file?.remote !== true &&
        !this.props?.otherProps?.accept?.includes(arrFileName?.[arrFileName.length - 1])
      );
    });

    if (findLargeFile) {
      message.error('Tập tin phải nhỏ hơn 25MB!', 5);
      return;
    }
    if (findWrongTypeFile && this.props?.otherProps?.accept) {
      message.error(`Chỉ được chọn các định dạng file sau ${this.props.otherProps.accept}`, 5);
      return;
    }

    if (fileList.length > limit) arr.splice(0, fileList.length - limit);
    this.setState({ fileList: arr });
    this.triggerChange({ fileList: arr });
    if (this.props.handleChoseFile) {
      fileList[0]?.originFileObj
        ? this.props.handleChoseFile(fileList[0].originFileObj)
        : this.props.handleChoseFile(undefined);
    }
  };

  // componentWillUnmount() {
  // }

  render() {
    const { fileList } = this.state;
    const { otherProps, value } = this.props;
    let initialList = fileList;
    if (fileList.length === 0 && Array.isArray(value?.fileList)) initialList = value?.fileList;
    const uploadButton = (
      <Button size="small" icon={<UploadOutlined />}>
        Chọn tệp
      </Button>
    );
    // if (this.props.){
    // }
    return (
      <div className="clearfix">
        <Upload
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              onSuccess('ok');
            }, 0);
          }}
          fileList={initialList}
          onChange={this.handleChange}
          style={{ width: 300 }}
          {...otherProps}
        >
          {otherProps && !otherProps.disabled && uploadButton}
        </Upload>
      </div>
    );
  }
}

export default PicturesWall;
