import TableBase from '@/components/Table';
import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';
import { useEffect } from 'react';

const QuanLyTaiKhoan = () => {
  const {
    getCanBoModel,
    page,
    limit,
    condition,
    loading,
    setVisibleForm,
    setRecord,
    setEdit,
    deleteCanBoModel,
  } = useModel('tochuccanbo');
  const { getAllDonViModel } = useModel('donvi');

  useEffect(() => {
    getAllDonViModel();
  }, []);

  const columns: IColumn<Login.Profile>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      search: 'search',
      notRegex: true,
    },
    {
      title: 'Mã định danh',
      dataIndex: 'ma_dinh_danh',
      width: 200,
      align: 'center',
      search: 'search',
      notRegex: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngay_sinh',
      width: 200,
      align: 'center',
      render: (val: string) => <div>{val ? val?.split('-')?.reverse()?.join('-') : ''}</div>,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioi_tinh',
      width: 100,
      align: 'center',
      render: (val) => <div>{val ? data?.gioiTinh?.[Number(val)] : ''}</div>,
    },
    {
      title: 'Chức danh',
      dataIndex: 'chuc_danh',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: Login.Profile) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setVisibleForm(true);
                setEdit(true);
                setRecord(record);
              }}
              icon={<EditOutlined />}
              shape="circle"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => {
                deleteCanBoModel(record.id);
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
    <>
      <TableBase
        title="Tổ chức cán bộ"
        columns={columns}
        getData={getCanBoModel}
        dependencies={[page, limit, condition]}
        modelName="tochuccanbo"
        loading={loading}
        hascreate
        Form={Form}
      />
    </>
  );
};

export default QuanLyTaiKhoan;
