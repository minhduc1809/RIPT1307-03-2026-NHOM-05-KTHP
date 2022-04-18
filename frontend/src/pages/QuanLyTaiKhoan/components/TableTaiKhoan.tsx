import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormCapLaiMatKhau from './FormCapLaiMatKhau';

const TableTaiKhoan = (props: { Form: React.FC; getData: Function; title: string }) => {
  const { loading, page, limit, condition, setEdit, setVisibleForm, setRecord, deleteUserModel } =
    useModel('quanlytaikhoan');
  const [visibleFormCapLaiMatKhau, setVisibleFormCapLaiMatKhau] = useState<boolean>(false);
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
      width: 150,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 150,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      width: 130,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Số thẻ CMND-CCCD',
      dataIndex: 'cmtCccd',
      width: 200,
      align: 'center',
      search: 'search',
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
      width: 140,
      fixed: 'right',
      render: (record: QuanLyTaiKhoan.Record) => (
        <>
          {/* <Tooltip title="Cấp lại mật khẩu">
            <Button
              onClick={() => {
                setVisibleFormCapLaiMatKhau(true);
                setRecord(record);
              }}
              shape="circle"
              icon={<ReloadOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" /> */}
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
              onConfirm={() => deleteUserModel(record._id)}
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
    <>
      <TableBase
        otherProps={{
          scroll: { x: 1000 },
        }}
        widthDrawer="700px"
        hascreate
        formType="Drawer"
        getData={() => props?.getData()}
        modelName="quanlytaikhoan"
        title={props?.title || 'Quản lý tài khoản'}
        loading={loading}
        columns={columns}
        dependencies={[page, limit, condition]}
        Form={props?.Form}
      />
      <Modal
        destroyOnClose
        footer={false}
        bodyStyle={{ padding: 0 }}
        visible={visibleFormCapLaiMatKhau}
        onCancel={() => {
          setVisibleFormCapLaiMatKhau(false);
        }}
      >
        <FormCapLaiMatKhau
          onCancel={() => {
            setVisibleFormCapLaiMatKhau(false);
          }}
        />
      </Modal>
    </>
  );
};

export default TableTaiKhoan;
