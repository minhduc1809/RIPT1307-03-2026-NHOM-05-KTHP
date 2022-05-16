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
  const { danhSach: danhSachCoSoDaoTao } = useModel('cosodaotao');
  const { danhSach: danhSachHinhThucDaoTao } = useModel('hinhthucdaotao');
  const [visibleFormCapLaiMatKhau, setVisibleFormCapLaiMatKhau] = useState<boolean>(false);
  const columns: IColumn<Login.Profile>[] = [
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
      width: 150,
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
      title: 'Hình thức đào tạo',
      dataIndex: 'idHinhThucDaoTao',
      width: 150,
      align: 'center',
      hide: props.type === ESystemRole.ThiSinh,
      render: (val) => <div>{danhSachHinhThucDaoTao.find((item) => item._id === val)?.ten}</div>,
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: 'idCoSoDaoTao',
      width: 200,
      align: 'center',
      hide: props.type === ESystemRole.ThiSinh,
      render: (val) => <div>{danhSachCoSoDaoTao.find((item) => item._id === val)?.ten}</div>,
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
      >
        {/* <Select
          onChange={(val) => setCondition({ ...condition, idCoSoDaoTao: val })}
          value={condition?.idCoSoDaoTao}
          placeholder="Lọc theo cơ sở đào tạo"
          style={{ width: 300, marginRight: 8 }}
          options={danhSachCoSoDaoTao.map((item) => ({
            label: item.ten,
            value: item._id,
          }))}
        /> */}
      </TableBase>
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
