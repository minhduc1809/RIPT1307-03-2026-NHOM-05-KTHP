import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const ChucVuPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, condition, deleteModel } =
    useModel('danhmuc.chucvu');

  const handleEdit = (record: ChucVu.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<ChucVu.IRecord>[] = [
    {
      title: 'Mã',
      dataIndex: 'ma',
      align: 'center',
      width: 80,
      search: 'search',
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'ten',
      align: 'center',
      width: 250,
      search: 'search',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: ChucVu.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="primary" shape="circle">
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa chức vụ này?"
              placement="topLeft"
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      getData={getModel}
      hascreate
      dependencies={[page, limit, condition]}
      modelName="danhmuc.chucvu"
      title="Chức vụ"
      Form={Form}
    />
  );
};

export default ChucVuPage;
