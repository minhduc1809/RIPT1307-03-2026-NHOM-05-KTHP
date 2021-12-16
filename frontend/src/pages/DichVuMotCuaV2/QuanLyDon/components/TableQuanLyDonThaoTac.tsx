/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table/index';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { IColumn } from '@/utils/interfaces';
import { Button, Divider, Dropdown, Menu, Modal, Select, Tabs } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ThanhToan from '@/components/ThanhToan';

const TableQuanLyDon = () => {
  const {
    getDonThaoTacChuyenVienDieuPhoiModel,
    getDonThaoTacChuyenVienXuLyModel,
    page,
    limit,
    condition,
    loading,
    trangThaiQuanLyDonThaoTac,
    danhSach,
    record,
    setRecord,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setRecordDonThaoTac,
    recordDonThaoTac,
    exportDonModel,
  } = useModel('dichvumotcuav2');

  const { getChuyenVienXuLyDonModel } = useModel('phanquyen');
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
  const columns: IColumn<DichVuMotCuaV2.DonThaoTac>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Dịch vụ',
      align: 'center',
      dataIndex: ['idDon', 'thongTinDichVu', 'ten'],
    },

    {
      title: 'Ngày tạo',
      dataIndex: ['idDon', 'createdAt'],
      width: 120,
      align: 'center',
      render: (val) => (
        <span title={moment(val).format('DD/MM/YYYY HH:mm:ss')}>{moment(val).fromNow()}</span>
      ),
    },
    {
      title: 'Hạn xử lý',
      dataIndex: 'hanXuLy',
      width: 120,
      align: 'center',
      render: (val) => <span>{moment(val).format('HH:mm DD/MM/YYYY')}</span>,
    },
    {
      title: 'Người gửi',
      dataIndex: ['nguoiTao', 'hoTen'],
      width: 150,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: ['idDon', 'trangThaiThanhToan'],
      width: 150,
      align: 'center',
      render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'tenDonVi',
      width: 180,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Bước',
      dataIndex: 'idBuoc',
      width: 200,
      align: 'center',
      render: (val, recordDon) => (
        <div>
          {
            recordDon?.idDon?.thongTinDichVu?.quyTrinh?.danhSachBuoc?.find(
              (item) => item._id === val,
            )?.ten
          }
        </div>
      ),
    },
    {
      title: 'Tên thao tác',
      dataIndex: 'tenThaoTac',
      width: 200,
      align: 'center',
    },
    {
      title: 'Người được giao',
      dataIndex: ['nguoiDuocGiao', 'hoTen'],
      width: 150,
      align: 'center',
      search: 'search',
    },

    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      width: 160,
      render: (recordDon: DichVuMotCuaV2.DonThaoTac) => (
        <>
          <Dropdown
            overlay={
              <Menu onClick={(item: any) => onClickMenuExport(recordDon?.idDon?._id ?? '', item)}>
                <Menu.Item key="MAU_DON">Mẫu đơn</Menu.Item>
                <Menu.Item key="TRA_LOI">Mẫu trả kết quả</Menu.Item>
              </Menu>
            }
          >
            <Button style={{ padding: 0 }} shape="circle" loading={loading} type="link">
              Xuất mẫu
            </Button>
          </Dropdown>

          <Divider type="vertical" />
          {['PENDING'].includes(trangThaiQuanLyDonThaoTac) && (
            <Button
              style={{ padding: 0 }}
              onClick={() => {
                if (arrPathName?.includes('quanlydondieuphoi')) {
                  getChuyenVienXuLyDonModel(recordDon?.idDonVi);
                }
                setRecordDonThaoTac(recordDon);
                setVisibleFormBieuMau(true);
                setType('handle');
              }}
              type="link"
            >
              Xử lý
            </Button>
          )}
          {['OK', 'NOT_OK'].includes(trangThaiQuanLyDonThaoTac) && (
            <Button
              style={{ padding: 0 }}
              type="link"
              shape="circle"
              onClick={() => {
                setRecordDonThaoTac(recordDon);
                setVisibleFormBieuMau(true);
                setType('view');
              }}
            >
              Chi tiết
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit, condition, trangThaiQuanLyDonThaoTac, record?._id, danhSach]}
      modelName="dichvumotcuav2"
      dataState="danhSachDonThaoTac"
      scroll={{ x: 1650 }}
      loading={loading}
      getData={() => {
        if (arrPathName?.includes('quanlydondieuphoi'))
          getDonThaoTacChuyenVienDieuPhoiModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
        else getDonThaoTacChuyenVienXuLyModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
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
        visible={visibleFormBieuMau}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Biểu mẫu" key={0}>
            <Form
              hideCamKet
              infoNguoiTaoDon={recordDonThaoTac?.nguoiTao}
              type={type}
              record={recordDonThaoTac?.idDon}
            />
          </Tabs.TabPane>
          {recordDonThaoTac?.idDon?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan record={recordDonThaoTac?.idDon} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
    </TableBase>
  );
};

export default TableQuanLyDon;
