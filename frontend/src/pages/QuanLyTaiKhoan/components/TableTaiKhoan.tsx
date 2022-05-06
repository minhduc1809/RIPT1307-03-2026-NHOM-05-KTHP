import TableBase from '@/components/Table';
import type { Login } from '@/services/ant-design-pro/typings';
import { ESystemRole } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormCapLaiMatKhau from './FormCapLaiMatKhau';

const TableTaiKhoan = (props: {
  type: ESystemRole;
  Form: React.FC;
  getData: any;
  title: string;
  phanQuyen?: {
    updateAll?: boolean;
    deleteAll?: boolean;
    resetAll?: boolean;
  };
}) => {
  const { loading, page, limit, condition, setEdit, setVisibleForm, setRecord, deleteUserModel } =
    useModel('quanlytaikhoan');
  const [visibleFormCapLaiMatKhau, setVisibleFormCapLaiMatKhau] = useState<boolean>(false);
  const columns: IColumn<Login.Profile>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    // {
    //   title: 'Trạng thái kích hoạt',
    //   dataIndex: 'index',
    //   width: 80,
    //   align: 'center',
    // },
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
      title: 'Số CMND/CCCD',
      dataIndex: 'cmtCccd',
      width: 200,
      align: 'center',
      search: 'search',
      hide: props.type === ESystemRole.QuanTriVien,
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
      width: 170,
      fixed: 'right',
      render: (record: Login.Profile) => (
        <>
          <Tooltip title="Cấp lại mật khẩu">
            <Button
              disabled={!props?.phanQuyen?.resetAll}
              onClick={() => {
                setVisibleFormCapLaiMatKhau(true);
                setRecord(record);
              }}
              shape="circle"
              icon={<ReloadOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Chỉnh sửa">
            <Button
              disabled={!props?.phanQuyen?.updateAll}
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
              disabled={!props?.phanQuyen?.deleteAll}
              onConfirm={() => deleteUserModel(record._id, { systemRole: record?.systemRole })}
              title="Bạn có chắc chắn muốn xóa tài khoản này?"
            >
              <Button disabled={!props?.phanQuyen?.deleteAll} type="primary" shape="circle">
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
