import TableBase from '@/components/Table';
import { Role } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableNhomChucNang from './components/TableNhomVaiTro';

const UserPhanNhom = () => {
  const {
    getUserPhanNhomModel,
    page,
    limit,
    loading,
    vaiTro,
    setVaiTro,
    query,
    getAllNhomVaiTroModel,
    setRecordUser,
    setVisibleForm,
    setCondition,
    setQuery,
    condition,
  } = useModel('phanquyen');

  useEffect(() => {
    getAllNhomVaiTroModel(true);
    return () => {
      setCondition({});
      setQuery({});
    };
  }, []);

  const columns: IColumn<PhanQuyen.UserPhanNhom>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: ['name'],
      key: 'name',
      width: 200,
      align: 'center',
      search: 'search',
      typeFilter: 'query',
      notRegex: true,
      render: (val, record) => <div>{record?.user?.name}</div>,
    },
    {
      title: 'Mã định danh',
      dataIndex: 'ma_dinh_danh',
      width: 200,
      typeFilter: 'query',
      align: 'center',
      search: 'search',
      render: (val, record) => <div>{record?.user?.ma_dinh_danh ?? ''}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record) => (
        <Tooltip title="Chỉnh sửa nhóm vai trò">
          <Button
            onClick={() => {
              setRecordUser(record);
              setVisibleForm(true);
            }}
            icon={<EditOutlined />}
            type="primary"
            shape="circle"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <TableBase
      title="Quản lý đào tạo"
      dataState="danhSachUser"
      loading={loading}
      columns={columns}
      modelName="phanquyen"
      getData={getUserPhanNhomModel}
      widthDrawer="80%"
      dependencies={[page, limit, vaiTro, query, condition]}
      Form={TableNhomChucNang}
    >
      <Select
        onChange={(val) => {
          setVaiTro(val);
        }}
        value={vaiTro}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {['nhan_vien']?.map((item) => (
          <Select.Option key={item} value={item}>
            {Role?.[item]}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default UserPhanNhom;
