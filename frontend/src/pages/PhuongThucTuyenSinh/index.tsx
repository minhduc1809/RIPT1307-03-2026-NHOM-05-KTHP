import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Button, Divider, Popconfirm } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const PhuongThucTuyenSinh = () => {
  const {
    getPhuongThucTuyenSinhPageableModel,
    page,
    loading,
    limit,
    condition,
    deletePhuongThucTuyenSinhModel,
    setEdit,
    setVisibleForm,
    setRecord,
  } = useModel('phuongthuctuyensinh');

  const { getAllHinhThucDaoTaoModel } = useModel('hinhthucdaotao');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  const columns: IColumn<PhuongThucTuyenSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã phương thức',
      dataIndex: 'maPhuongThuc',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên phương thức',
      dataIndex: 'tenPhuongThuc',
      width: 200,
      align: 'center',
    },
    {
      title: 'Loại phương thức',
      dataIndex: 'loaiPhuongThuc',
      width: 200,
      align: 'center',
    },

    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTao',
      width: 100,
      align: 'center',
      render: (val: HinhThucDaoTao.Record) => <div>{val?.ten}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: PhuongThucTuyenSinh.Record) => (
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
              onConfirm={() => deletePhuongThucTuyenSinhModel(record._id)}
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
      getData={getPhuongThucTuyenSinhPageableModel}
      modelName="phuongthuctuyensinh"
      title="Quản lý phương thức tuyển sinh"
      loading={loading}
      Form={Form}
      columns={columns}
      dependencies={[page, limit, condition]}
    />
  );
};

export default PhuongThucTuyenSinh;
