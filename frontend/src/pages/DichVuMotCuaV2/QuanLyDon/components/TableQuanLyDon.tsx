/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table/index';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

const TableQuanLyDon = () => {
  const {
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
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setRecordDonThaoTac,
    setDanhSach,
    recordDonThaoTac,
  } = useModel('dichvumotcuav2');
  useEffect(() => {
    return () => setDanhSach([]);
  }, []);
  const { getChuyenVienXuLyDonModel } = useModel('phanquyen');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const [type, setType] = useState<string>('handle');
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
      width: 100,
      render: (recordDon: DichVuMotCuaV2.DonThaoTac) => (
        <>
          {['PENDING'].includes(trangThaiQuanLyDon) && (
            <Button
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
          {['OK', 'NOT_OK'].includes(trangThaiQuanLyDon) && (
            <Button
              type="primary"
              shape="circle"
              onClick={() => {
                setRecordDonThaoTac(recordDon);
                setVisibleFormBieuMau(true);
                setType('view');
              }}
              icon={<EyeOutlined />}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit, condition, trangThaiQuanLyDon, record?._id]}
      modelName="dichvumotcuav2"
      dataState="danhSachDonThaoTac"
      scroll={{ x: 1500 }}
      loading={loading}
      getData={
        arrPathName?.includes('quanlydondieuphoi')
          ? getDonThaoTacChuyenVienDieuPhoiModel
          : getDonThaoTacChuyenVienXuLyModel
      }
    >
      <Select
        allowClear
        placeholder="Lọc theo loại dịch vụ"
        onChange={(val: string) => {
          setRecord(danhSach?.find((item) => item._id === val));
        }}
        showSearch
        value={record?._id}
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
        width="60%"
        footer={false}
        visible={visibleFormBieuMau}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <Form
          hideCamKet
          infoNguoiTaoDon={recordDonThaoTac?.nguoiTao}
          type={type}
          record={recordDonThaoTac?.idDon}
        />
      </Modal>
    </TableBase>
  );
};

export default TableQuanLyDon;
