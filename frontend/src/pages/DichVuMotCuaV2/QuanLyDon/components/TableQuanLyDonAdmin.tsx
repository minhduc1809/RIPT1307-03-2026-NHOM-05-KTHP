/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyTrinh from '../../components/FormQuyTrinh';

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
    setDanhSach,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [type, setType] = useState<string>('view');
  useEffect(() => {
    adminGetAllBieuMauModel();
    return () => setDanhSach([]);
  }, []);
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (recordDon: DichVuMotCuaV2.Don) => {
        return (
          <>
            <Tooltip title="Chi tiết">
              <Button
                type="primary"
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
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition, trangThaiQuanLyDonAdmin, record?._id]}
        getData={adminGetDonModel}
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
      </TableBase>

      <Modal
        destroyOnClose
        width="60%"
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
        </Tabs>
      </Modal>
    </>
  );
};

export default TableQuanLyDonAdmin;
