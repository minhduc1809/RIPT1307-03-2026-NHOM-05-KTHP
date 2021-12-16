/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table/index';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { IColumn } from '@/utils/interfaces';
import { Button, Divider, Dropdown, Menu, Modal, Select, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ThanhToan from '@/components/ThanhToan';
import { TrangThaiDonDVMC } from '@/utils/constants';
import { ExportOutlined, EyeOutlined } from '@ant-design/icons';
import FormQuyTrinh from '../../components/FormQuyTrinh';

const TableQuanLyDon = () => {
  const {
    chuyenVienDieuPhoiGetDonModel,
    chuyenVienXuLyGetDonModel,
    getDonThaoTacChuyenVienDieuPhoiModel,
    getDonThaoTacChuyenVienXuLyModel,
    page,
    limit,
    condition,
    loading,
    trangThaiQuanLyDon,
    danhSach,
    record,
    setRecord,
    visibleFormDon,
    setVisibleFormDon,
    recordDon,
    setRecordDon,
    exportDonModel,
  } = useModel('dichvumotcuav2');

  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const [type, setType] = useState<string>('handle');
  const isDVMC = arrPathName?.includes('dvmc');
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
      render: (recordDonColumn: DichVuMotCuaV2.Don) => {
        return (
          <>
            <Tooltip title="Xuất mẫu">
              <Dropdown
                overlay={
                  <Menu
                    onClick={(item: any) => onClickMenuExport(recordDonColumn?._id ?? '', item)}
                  >
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
                  if (arrPathName?.includes('quanlydondieuphoi'))
                    getDonThaoTacChuyenVienDieuPhoiModel(
                      undefined,
                      { idDon: recordDonColumn?._id },
                      1,
                      100,
                    );
                  else
                    getDonThaoTacChuyenVienXuLyModel(
                      undefined,
                      { idDon: recordDonColumn?._id },
                      1,
                      100,
                    );
                  setRecordDon(recordDonColumn);
                  setVisibleFormDon(true);
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
    <TableBase
      columns={columns}
      dependencies={[page, limit, condition, trangThaiQuanLyDon, record?._id, danhSach]}
      modelName="dichvumotcuav2"
      dataState="danhSachDon"
      scroll={{ x: 1350 }}
      loading={loading}
      getData={() => {
        if (arrPathName?.includes('quanlydondieuphoi'))
          chuyenVienDieuPhoiGetDonModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
        else chuyenVienXuLyGetDonModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
      }}
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

      <Modal
        destroyOnClose
        width="850px"
        footer={false}
        visible={visibleFormDon}
        onCancel={() => {
          setVisibleFormDon(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh
              type="view"
              idDon={recordDon?._id}
              record={recordDon?.thongTinDichVu?.quyTrinh}
              thoiGianTaoDon={recordDon?.createdAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <Form
              hideCamKet
              infoNguoiTaoDon={recordDon?.thongTinNguoiTao}
              type={type}
              onCancel={() => {
                setVisibleFormDon(false);
              }}
              record={recordDon}
            />
          </Tabs.TabPane>
          {recordDon?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan record={recordDon} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
    </TableBase>
  );
};

export default TableQuanLyDon;
