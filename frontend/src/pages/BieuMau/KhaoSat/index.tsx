import TableBase from '@/components/Table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const KhaoSat = () => {
  const {
    getBieuMauAdminModel,
    setLoaiBieuMau,
    loaiBieuMau,
    loading,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
  } = useModel('bieumau');

  useEffect(() => {
    setLoaiBieuMau('Khảo sát');
  }, []);

  const handleEdit = (record: BieuMau.Record) => {
    setEdit(true);
    setRecord(record);
    setVisibleForm(true);
  };

  const columns: ColumnProps<BieuMau.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      width: 200,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      width: 200,
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'kichHoat',
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
      width: 200,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'doiTuong',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="default" shape="circle">
            <EditOutlined />
          </Button>
          <Divider type="vertical" />

          <Popconfirm
            // onConfirm={() => delChuDeModel({ id: record._id })}
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

  return (
    <TableBase
      columns={columns}
      getData={getBieuMauAdminModel}
      loading={loading}
      dependencies={[loaiBieuMau, page, limit]}
      modelName="bieumau"
      title="Khảo sát"
      hascreate
      formType="Drawer"
      widthDrawer="60%"
      // scroll={{ x: 1200 }}
      Form={Form}
    ></TableBase>
  );
};

export default KhaoSat;
