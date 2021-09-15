import Icon, { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Tooltip, Popconfirm } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useModel } from 'umi';
import metadata from '@/assets/metadata.jpg';

const BasicInfo = () => {
  const { record } = useModel('donvi');

  return (
    <Card
      cover={
        <img
          alt="example"
          style={{ maxHeight: 300, minHeight: 300, backgroundSize: 'cover' }}
          src={metadata}
        />
      }
      actions={[
        <Tooltip title="Chỉnh sửa">
          <EditOutlined />
        </Tooltip>,
        <Tooltip title="Xóa">
          <Popconfirm
            disabled={!record?.id}
            // onConfirm={() => {
            //   this.props.dispatch({
            //     type: 'khoa/del',
            //     payload: {
            //       _id: record?._id,
            //     },
            //   });
            // }}
            title="Bạn có chắc chắn muốn xóa đơn vị này ?"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Tooltip>,
      ]}
    >
      <Meta
        // avatar={<Avatar src={logo} />}
        title={
          <div style={{ fontSize: 18 }}>
            {record?.id
              ? `Đơn vị đang chọn: ${record?.ten_don_vi ?? ''}`
              : 'Bạn chưa chọn đơn vị nào'}
          </div>
        }
        description={
          <div>
            <div>Mã đơn vị: {record?.ma_don_vi ?? ''}</div>
            <div>Loại đơn vị: {record?.loai_don_vi ?? ''}</div>
          </div>
        }
      />
    </Card>
  );
};

export default BasicInfo;
