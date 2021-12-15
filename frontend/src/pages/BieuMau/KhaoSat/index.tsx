/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Popover, Select, Switch, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';
import FormViewDetail from './components/FormViewDetail';
import ThongKe from './components/ThongKe';

const KhaoSat = () => {
  const access = useAccess();
  const {
    getBieuMauAdminModel,
    delBieuMauModel,
    setLoaiBieuMau,
    loaiBieuMau,
    loading,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
    kichHoatBieuMauModel,
    condition,
    edit,
    setCondition,
    getBieuMauThongKeModel,
  } = useModel('bieumau');
  const { getLopHanhChinhAdminModel, condition: condLopHanhChinh } = useModel('lophanhchinh');
  const { getAllNganhModel } = useModel('nganh');
  const { danhSachHinhThucDaoTao, getAllHinhThucDaoTaoModel } = useModel('lophanhchinh');
  const { adminGetLopTinChi, condition: condLopTinChi } = useModel('loptinchi');
  const { getKhoaHocModel } = useModel('khoahoc');
  const { getUserModel, condition: condUser, setCondition: setConditionUser } = useModel('user');
  const [form, setForm] = useState<string>('edit');

  useEffect(() => {
    getUserModel({ pageParam: 1, limitParam: 100 });
  }, [condUser]);

  useEffect(() => {
    adminGetLopTinChi(100);
  }, [condLopTinChi]);

  useEffect(() => {
    getLopHanhChinhAdminModel({ page: 1, limit: 100 });
  }, [condLopHanhChinh]);

  useEffect(() => {
    getAllNganhModel();
    getKhoaHocModel({ pageParam: 1, limitParam: 1000 });
    setLoaiBieuMau('Khảo sát');
    getAllHinhThucDaoTaoModel();
    return () => {
      setConditionUser({ vai_tro: 'sinh_vien' });
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
      width: 200,
      onCell,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
      width: 200,
      onCell,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'doiTuong',
      search: 'filterString',
      notRegex: true,
      align: 'center',
      width: 200,
      onCell,
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
          content={
            <>
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
      getData={getBieuMauAdminModel}
      loading={loading}
      dependencies={[loaiBieuMau, page, limit, condition]}
      modelName="bieumau"
      title="Khảo sát"
      hascreate
      formType="Drawer"
      widthDrawer="60%"
      // scroll={{ x: 1200 }}
      Form={formTable}
    >
      {access.admin && (
        <Select
          value={condition?.hinhThucDaoTaoId ?? -1}
          onChange={(val: number) => {
            setCondition({ ...condition, hinhThucDaoTaoId: val });
          }}
          style={{ marginBottom: 8, width: 250, marginRight: 8 }}
        >
          <Select.Option value={-1} key={-1}>
            Tất cả hình thức đào tạo
          </Select.Option>
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_hinh_thuc_dao_tao}
            </Select.Option>
          ))}
        </Select>
      )}
    </TableBase>
  );
};

export default KhaoSat;
