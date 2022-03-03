import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const CoSoDaoTao = () => {
  const {
    getCoSoDaoTaoPageableModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteCoSoDaoTaoModel,
  } = useModel('cosodaotao');

  const columns: IColumn<CoSoDaoTao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên cơ sở',
      dataIndex: 'ten',
      width: 200,
      align: 'center',
    },
    {
      title: 'Tên viết tắt',
      dataIndex: 'tenVietTat',
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
      render: (record: CoSoDaoTao.Record) => (
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
              onConfirm={() => deleteCoSoDaoTaoModel(record._id)}
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
      getData={getCoSoDaoTaoPageableModel}
      modelName="cosodaotao"
      title="Quản lý cơ sở đào tạo"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default CoSoDaoTao;
