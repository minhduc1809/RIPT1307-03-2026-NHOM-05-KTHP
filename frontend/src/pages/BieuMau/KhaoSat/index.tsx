/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Divider, Popconfirm, Popover, Switch, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import FormViewDetail from './components/FormViewDetail';
import ThongKe from './components/ThongKe';

const KhaoSat = () => {
  const {
    getBieuMauAdminModel,
    delBieuMauModel,
    setLoaiBieuMau,
    loading,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
    kichHoatBieuMauModel,
    condition,
    edit,
    getBieuMauThongKeModel,
    phamVi,
    exportKetQuaKhaoSatModel,
    setDanhSach,
  } = useModel('bieumau');

  const [form, setForm] = useState<string>('edit');

  useEffect(() => {
    setLoaiBieuMau('Khảo sát');

    return () => {
      setDanhSach([]);
      setLoaiBieuMau(undefined);
    };
  }, []);

  const handleEdit = (record: BieuMau.Record) => {
    setForm('edit');
    setEdit(true);
    setRecord(record);
    setVisibleForm(true);
  };

  const handleChangeStatus = (record: BieuMau.Record) => {
    kichHoatBieuMauModel({ id: record._id, data: { kichHoat: !record.kichHoat } });
  };

  const onCell = (record: BieuMau.Record) => ({
    onClick: () => {
      setForm('statistic');
      setVisibleForm(true);
      setEdit(true);
      setRecord(record);
      getBieuMauThongKeModel(record._id);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<BieuMau.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      search: 'search',
      width: 200,
      onCell,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
      width: 120,
      onCell,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
      width: 120,
      onCell,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'loaiDoiTuongSuDung',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{val?.length === 0 ? 'Tất cả' : val}</div>,
    },

    {
      title: 'Trạng thái',
      dataIndex: 'kichHoat',
      align: 'center',
      width: '100px',
      fixed: 'right',
      render: (val: boolean, record: BieuMau.Record) => (
        <Switch
          checkedChildren="Mở"
          unCheckedChildren="Mở"
          checked={val}
          onChange={() => {
            handleChangeStatus(record);
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: BieuMau.Record) => (
        <Popover
          placement="left"
          content={
            <>
              <Tooltip title="Xuất kết quả">
                <Button
                  type="primary"
                  onClick={() => {
                    exportKetQuaKhaoSatModel({ idKhaoSat: record._id });
                  }}
                  shape="circle"
                >
                  <ExportOutlined />
                </Button>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="Thống kê">
                <Button
                  onClick={() => {
                    setForm('statistic');
                    setVisibleForm(true);
                    setEdit(true);
                    setRecord(record);
                    getBieuMauThongKeModel(record._id);
                  }}
                  shape="circle"
                >
                  <PieChartOutlined />
                </Button>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="Xem trước">
                <Button
                  onClick={() => {
                    setForm('view');
                    setVisibleForm(true);
                    setEdit(true);
                    setRecord(record);
                  }}
                  type="primary"
                  shape="circle"
                >
                  <EyeOutlined />
                </Button>
              </Tooltip>

              <Divider type="vertical" />
              <Tooltip title="Chỉnh sửa">
                <Button onClick={() => handleEdit(record)} type="default" shape="circle">
                  <EditOutlined />
                </Button>
              </Tooltip>

              <Divider type="vertical" />
              <Tooltip title="Xóa">
                <Popconfirm
                  onConfirm={() => delBieuMauModel({ id: record._id })}
                  title="Bạn có chắc chắn muốn xóa khảo sát này"
                >
                  <Button type="primary" shape="circle">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Tooltip>
            </>
          }
        >
          <Button type="primary" icon={<EditOutlined />} />
        </Popover>
      ),
    },
  ];
  let formTable = Form;
  if (form === 'view' && edit) formTable = FormViewDetail;
  else if (form === 'statistic' && edit) formTable = ThongKe;
  return (
    <TableBase
      columns={columns}
      getData={() => getBieuMauAdminModel('Khảo sát')}
      loading={loading}
      dependencies={[page, limit, condition, phamVi]}
      modelName="bieumau"
      title="Khảo sát"
      hascreate
      formType="Drawer"
      widthDrawer="60%"
      Form={formTable}
    />
  );
};

export default KhaoSat;
