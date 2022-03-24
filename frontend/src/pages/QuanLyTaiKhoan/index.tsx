import { useEffect } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import FormQuanLy from './components/Form';
import { useModel } from 'umi';

const QuanLyTaiKhoan = () => {
  const {
    getUserPageableModel,
    loading,
    page,
    limit,
    condition,
    setEdit,
    setVisibleForm,
    setRecord,
    deleteUserModal,
  } = useModel('quanlytaikhoan');
  // console.log(record)

  useEffect(() => {
    getUserPageableModel();
  }, []);

  const columns: IColumn<QuanLyTaiKhoan.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Họ đệm',
      dataIndex: 'hoDem',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 100,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      width: 150,
      align: 'center',
    },
    {
      title: 'Số thẻ CMT-CCCD',
      dataIndex: 'cmtCccd',
      width: 200,
      align: 'center',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      width: 100,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (record: QuanLyTaiKhoan.Record) => (
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
              onConfirm={() => deleteUserModal(record._id)}
              title="Bạn có chắc chắn muốn xóa tài khoản này?"
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
    <div>
      <TableBase
        widthDrawer="700px"
        hascreate
        formType="Drawer"
        getData={getUserPageableModel}
        modelName="quanlytaikhoan"
        title="Quản lý tài khoản"
        loading={loading}
        columns={columns}
        dependencies={[page, limit, condition]}
        // dataState="record"
        Form={FormQuanLy}
      />
    </div>
  );
};

export default QuanLyTaiKhoan;
