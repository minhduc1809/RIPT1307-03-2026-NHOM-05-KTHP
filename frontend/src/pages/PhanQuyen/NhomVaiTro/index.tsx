/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNhomVaiTro from './components/Form';

const NhomVaiTro = () => {
  const {
    getNhomVaiTroModel,
    setRecord,
    deleteNhomVaiTroModel,
    vaiTro,
    page,
    limit,
    condition,
    loading,
    setEdit,
    setVisibleForm,
    setDanhSachNhomVaiTro,
  } = useModel('phanquyen');

  useEffect(() => {
    return () => {
      setDanhSachNhomVaiTro([]);
    };
  }, []);

  const columns: IColumn<PhanQuyen.NhomVaiTro>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên vai trò',
      dataIndex: '_id',
      width: 300,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (record: PhanQuyen.NhomVaiTro) => (
        <>
          <Tooltip placement="bottomLeft" title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord(record);
                setEdit(true);
                setVisibleForm(true);
              }}
              icon={<EditOutlined />}
              shape="circle"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="bottomLeft" title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => {
                deleteNhomVaiTroModel({ idNhomVaiTro: record._id });
              }}
            >
              <Button type="primary" icon={<DeleteOutlined />} shape="circle" />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      hascreate
      title="Vai trò"
      modelName="phanquyen"
      dataState="danhSachNhomVaiTro"
      loading={false}
      Form={FormNhomVaiTro}
      dependencies={[page, limit, condition, vaiTro]}
      getData={getNhomVaiTroModel}
      columns={columns}
    />
  );
};

export default NhomVaiTro;
