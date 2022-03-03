import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DoiTuongTuyenSinh = () => {
  const {
    getDoiTuongTuyenSinhPageableModel,
    page,
    loading,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteDoiTuongTuyenSinhModel,
  } = useModel('doituongtuyensinh');

  const { getAllHinhThucDaoTaoModel } = useModel('hinhthucdaotao');

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);

  const columns: IColumn<DoiTuongTuyenSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã đối tượng',
      dataIndex: 'maDoiTuong',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'tenDoiTuong',
      width: 200,
      align: 'center',
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTao',
      width: 200,
      align: 'center',
      render: (val: HinhThucDaoTao.Record) => <div>{val?.ten}</div>,
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: DoiTuongTuyenSinh.Record) => (
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
              onConfirm={() => deleteDoiTuongTuyenSinhModel(record._id)}
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
      getData={getDoiTuongTuyenSinhPageableModel}
      modelName="doituongtuyensinh"
      title="Quản lý đối tượng tuyển sinh"
      loading={loading}
      columns={columns}
      dependencies={[page, limit, condition]}
      Form={Form}
    />
  );
};

export default DoiTuongTuyenSinh;
