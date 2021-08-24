/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Select } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const LopTinChi = () => {
  const {
    loading,
    loaiChuDe,
    getAllLoaiChuDeModel,
    getChuDeModel,
    danhSachLoaiChuDe,
    setEdit,
    setVisibleForm,
    delChuDeModel,
    setRecord,
    page,
    limit,
    setLoaiChuDe,
  } = useModel('chude');

  const handleEdit = (record: ChuDe.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: ColumnProps<ChuDe.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Mã chủ đề',
      dataIndex: '_id',
      align: 'center',
      width: 200,
    },
    {
      title: 'Tên chủ để',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: 'Loại chủ đề',
      dataIndex: 'type',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'order',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      render: (record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="default" shape="circle">
            <EditOutlined />
          </Button>
          <Divider type="vertical" />

          <Popconfirm
            onConfirm={() => delChuDeModel({ id: record._id })}
            title="Bạn có chắc chắn muốn xóa chủ đề này"
          >
            <Button type="primary" shape="circle">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    getAllLoaiChuDeModel();
  }, []);

  const onChangeLoaiChuDe = (value: string) => {
    setLoaiChuDe(value);
  };

  return (
    <TableBase
      columns={columns}
      getData={getChuDeModel}
      loading={loading}
      dependencies={[loaiChuDe, page, limit]}
      modelName="chude"
      title="Chủ đề chung"
      Form={Form}
    >
      <Select
        onChange={onChangeLoaiChuDe}
        value={loaiChuDe}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {[...danhSachLoaiChuDe, 'Tất cả']?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default LopTinChi;
