import metadata from '@/assets/metadata.jpg';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tooltip } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useModel } from 'umi';

const BasicInfo = () => {
  const { record, setVisibleForm, setEdit, delDonViModel } = useModel('donvi');

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
          <EditOutlined
            onClick={() => {
              if (record?.id) {
                setEdit(true);
                setVisibleForm(true);
              }
            }}
          />
        </Tooltip>,
        <Tooltip title="Xóa">
          <Popconfirm
            disabled={!record?.id}
            onConfirm={() => {
              delDonViModel(record?.id);
            }}
            title="Bạn có chắc chắn muốn xóa đơn vị này ?"
          >
            <DeleteOutlined disabled={!record?.id} />
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
