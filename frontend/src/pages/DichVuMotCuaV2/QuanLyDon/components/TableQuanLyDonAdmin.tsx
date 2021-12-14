/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal, Select, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyTrinh from '../../components/FormQuyTrinh';
import ThanhToan from '@/components/ThanhToan';

const TableQuanLyDonAdmin = () => {
  const {
    page,
    limit,
    condition,
    adminGetDonModel,
    loading,
    visibleFormBieuMau,
    adminGetAllBieuMauModel,
    setVisibleFormBieuMau,
    trangThaiQuanLyDonAdmin,
    danhSach,
    record,
    setRecord,
    setLoaiDichVu,
    exportDonModel,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [type, setType] = useState<string>('view');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  useEffect(() => {
    setLoaiDichVu(arrPathName?.includes('dvmc') ? 'DVMC' : 'VAN_PHONG_SO');
    adminGetAllBieuMauModel(arrPathName?.includes('dvmc') ? 'DVMC' : 'VAN_PHONG_SO');
  }, []);
  const onClickMenuExport = (idDon: string, item: { key: 'MAU_DON' | 'TRA_LOI' }) => {
    exportDonModel({
      idDon,
      mauExport: item.key,
    });
  };
  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 100,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'center',
    },
    {
      title: 'Người tạo',
      dataIndex: ['thongTinNguoiTao', 'hoTen'],
      width: 200,
      align: 'center',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: ['thongTinNguoiTao', 'maSinhVien'],
      width: 200,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      // search: 'filterString',
      notRegex: true,
      render: (val) => <div>{TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}</div>,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToan',
      width: 150,
      align: 'center',
      render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (recordDon: DichVuMotCuaV2.Don) => {
        return (
          <>
            <Tooltip title="Xuất mẫu">
              <Dropdown
                overlay={
                  <Menu onClick={(item: any) => onClickMenuExport(recordDon?._id ?? '', item)}>
                    <Menu.Item key="MAU_DON">Mẫu đơn</Menu.Item>
                    <Menu.Item key="TRA_LOI">Mẫu trả kết quả</Menu.Item>
                  </Menu>
                }
              >
                <Button shape="circle" loading={loading} icon={<ExportOutlined />} type="primary" />
              </Dropdown>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Chi tiết">
              <Button
                onClick={() => {
                  setRecordView(recordDon);
                  setVisibleFormBieuMau(true);
                  setType('view');
                }}
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <TableBase
        dataState="danhSachDon"
        widthDrawer="60%"
        modelName="dichvumotcuav2"
        scroll={{ x: 1300 }}
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition, trangThaiQuanLyDonAdmin, record?._id]}
        getData={adminGetDonModel}
      >
        <Select
          allowClear
          placeholder="Lọc theo loại dịch vụ"
          onChange={(val: string | undefined) => {
            setRecord(
              val
                ? danhSach?.find((item) => item._id === val)
                : ({
                    _id: {
                      $in: danhSach?.map((item) => item._id),
                    },
                  } as any),
            );
          }}
          showSearch
          value={typeof record?._id === 'string' ? record?._id : undefined}
          style={{ width: '400px' }}
        >
          {danhSach?.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.ten}
            </Select.Option>
          ))}
        </Select>
      </TableBase>

      <Modal
        destroyOnClose
        width="820px"
        footer={false}
        visible={visibleFormBieuMau}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh
              type="view"
              idDon={recordView?._id}
              record={recordView?.thongTinDichVu?.quyTrinh}
              thoiGianTaoDon={recordView?.createdAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <Form
              hideCamKet
              infoNguoiTaoDon={recordView?.thongTinNguoiTao}
              type={type}
              record={recordView}
            />
          </Tabs.TabPane>
          {recordView?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan record={recordView} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
    </>
  );
};

export default TableQuanLyDonAdmin;
