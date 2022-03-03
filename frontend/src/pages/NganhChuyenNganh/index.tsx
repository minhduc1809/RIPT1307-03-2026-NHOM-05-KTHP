import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const NganhChuyenNganh = () => {
  const {
    getNganhChuyenNganhPageableModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteNganhChuyenNganhModel,
  } = useModel('nganhchuyennganh');

  const columns: IColumn<NganhChuyenNganh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên ngành',
      dataIndex: 'ten',
      width: 200,
      align: 'center',
    },
    {
      title: 'Mã ngành',
      dataIndex: 'ma',
      width: 200,
      align: 'center',
    },
    {
      title: 'Ký hiệu',
      dataIndex: 'kyHieu',
      width: 200,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: NganhChuyenNganh.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEdit(true);
                setRecord(record);
                setVisibleForm(true);
              }}
              type="default"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteNganhChuyenNganhModel(record._id)}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button type="primary" shape="circle">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      hascreate
      getData={getNganhChuyenNganhPageableModel}
      modelName="nganhchuyennganh"
      title="Quản lý ngành/chuyên ngành"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default NganhChuyenNganh;
