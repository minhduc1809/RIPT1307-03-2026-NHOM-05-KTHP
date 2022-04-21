import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const UserPhanNhom = () => {
  const {
    vaiTro,
    setVaiTro,
    getAllNhomVaiTroModel,
    setRecordUser,
    setCondition,
    setQuery,
    getAllVaiTroModel,
    danhSachVaiTro,
    loading,
    setVisibleForm,
    getUserPhanNhomModel,
    page,
    limit,
    condition,
  } = useModel('phanquyen');

  useEffect(() => {
    getAllNhomVaiTroModel();
    getAllVaiTroModel();
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
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      width: 100,
      align: 'center',
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
    <>
      <TableBase
        otherProps={{
          scroll: { x: 1000 },
        }}
        getData={getUserPhanNhomModel}
        modelName="phanquyen"
        title={'Phân nhóm'}
        loading={loading}
        columns={columns}
        dependencies={[vaiTro, page, limit, condition]}
        Form={Form}
        dataState="danhSachUser"
      >
        <Select
          value={vaiTro}
          style={{ width: 200, marginRight: 8 }}
          onChange={(val) => setVaiTro(val)}
        >
          {danhSachVaiTro?.map((item) => (
            <Select.Option key={item.vaiTro} value={item.vaiTro}>
              {item.ten}
            </Select.Option>
          ))}
        </Select>
      </TableBase>
    </>
  );
};

export default UserPhanNhom;
