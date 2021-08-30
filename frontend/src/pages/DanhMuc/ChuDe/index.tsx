/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Select, Tooltip } from 'antd';
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
    condition,
    filterInfo,
    setLoaiChuDe,
  } = useModel('chude');

  const handleEdit = (record: ChuDe.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<ChuDe.Record>[] = [
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
      search: 'search',
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      search: 'search',
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
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="default" shape="circle">
              <EditOutlined />
            </Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => delChuDeModel({ id: record._id })}
              title="Bạn có chắc chắn muốn xóa chủ đề này"
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
      hascreate
      dependencies={[loaiChuDe, page, limit, condition, filterInfo]}
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
