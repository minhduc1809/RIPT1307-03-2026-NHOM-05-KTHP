/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Button, Divider, Modal, Popconfirm, Tabs, Tooltip } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';
import FormQuyTrinh from '../components/FormQuyTrinh';
import Form from './components/Form';

const QuanLyBieuMau = () => {
  const {
    page,
    limit,
    condition,
    getBieuMauAdminModel,
    loading,
    setRecord,
    setEdit,
    setVisibleForm,
    deleteBieuMauAdminModel,
    setRecordCauHinhBieuMau,
    setCurrent,
    setRecordThongTinChung,
    setLoaiDichVu,
    setDanhSach,
  } = useModel('dichvumotcuav2');

  const { getProductByCodeModel } = useModel('thanhtoan');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  useEffect(() => {
    setLoaiDichVu(arrPathName?.includes('dvmc') ? 'DVMC' : 'VAN_PHONG_SO');
    return () => {
      setDanhSach([]);
    };
  }, []);
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [visible, setVisible] = useState<boolean>(false);
  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'ten',
      search: 'search',
      align: 'left',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (record: DichVuMotCuaV2.BieuMau) => {
        return (
          <>
            <Tooltip title="Xem trước">
              <Button
                onClick={() => {
                  setRecordView({ thongTinDichVu: { ...record } } as DichVuMotCuaV2.Don);
                  setVisible(true);
                }}
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip title="Chỉnh sửa">
              <Button
                onClick={() => {
                  if (record?.thongTinThuTuc?.maLePhi) {
                    getProductByCodeModel(record?.thongTinThuTuc?.maLePhi);
                  }
                  setRecord(record);
                  setEdit(true);
                  setVisibleForm(true);
                  setRecordCauHinhBieuMau(record);
                  setCurrent(arrPathName?.includes('dvmc') ? 0 : 1);
                  setRecordThongTinChung({
                    thongTinThuTuc: record?.thongTinThuTuc,
                    thongTinHoSo: record?.thongTinHoSo,
                    thongTinQuyTrinh: record?.thongTinQuyTrinh,
                    thongTinYeuCau: record?.thongTinYeuCau,
                  });
                }}
                shape="circle"
                type="primary"
                icon={<EditOutlined />}
              />
            </Tooltip>

            <Divider type="vertical" />
            <Tooltip title="Xóa">
              <Popconfirm
                onConfirm={() => {
                  deleteBieuMauAdminModel(record._id);
                }}
                title="Bạn có chắc chắn muốn xóa?"
              >
                <Button icon={<DeleteOutlined />} shape="circle" />
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const isLargeScreen = useMediaQuery({
    query: '(min-width: 992px)',
  });

  return (
    <>
      <TableBase
        widthDrawer={!isLargeScreen ? '80%' : '60%'}
        formType="Drawer"
        scroll={{ x: 900 }}
        title="Quản lý dịch vụ"
        modelName="dichvumotcuav2"
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition]}
        getData={() =>
          getBieuMauAdminModel(arrPathName?.includes('dvmc') ? 'DVMC' : 'VAN_PHONG_SO')
        }
        Form={Form}
      >
        <Button
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({} as DichVuMotCuaV2.BieuMau);
            setRecordCauHinhBieuMau({} as DichVuMotCuaV2.BieuMau);
            setRecordThongTinChung({});
            setCurrent(arrPathName?.includes('dvmc') ? 0 : 1);
          }}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
          Thêm mới
        </Button>
      </TableBase>

      <Modal
        destroyOnClose
        width="800px"
        footer={false}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh type="view" record={recordView?.thongTinDichVu?.quyTrinh} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <FormView
              onCancel={() => {
                setVisible(false);
              }}
              type="view"
              record={recordView}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default QuanLyBieuMau;
