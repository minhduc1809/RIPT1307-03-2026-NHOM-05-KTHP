import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, condition, deleteModel } =
    useModel('vanbanquydinh');

  const handleEdit = (record: VanBanQuyDinh.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<VanBanQuyDinh.IRecord>[] = [
    {
      title: 'Tên trình độ',
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
      render: (record: VanBanQuyDinh.IRecord) => (
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
              title="Bạn có chắc chắn muốn xóa trình độ đào tạo này?"
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
      modelName="vanbanquydinh"
      title="Căn cứ pháp lý"
      Form={Form}
    />
  );
};

export default TrinhDoDTBo;
