import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const HuongDanSuDung = () => {
  const {
    getHuongDanSuDungPageableModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteHuongDanSuDungModel,
  } = useModel('huongdansudung');

  const columns: IColumn<HuongDanSuDung.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên hướng dẫn',
      dataIndex: 'tenHuongDan',
      width: 250,
      align: 'center',
    },
    {
      title: 'Tệp đính kèm',
      dataIndex: 'tepDinhKem',
      width: 200,
      align: 'center',
      render: (val) => {
        return (
          <a href={val} target="_blank" rel="noreferrer">
            {val}
          </a>
        );
      },
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (record: HuongDanSuDung.Record) => (
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
              onConfirm={() => deleteHuongDanSuDungModel(record._id)}
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
      getData={getHuongDanSuDungPageableModel}
      modelName="huongdansudung"
      title="Quản lý hướng dẫn sử dụng"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default HuongDanSuDung;
