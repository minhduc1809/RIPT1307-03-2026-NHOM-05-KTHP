/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Select, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useAccess, useModel } from 'umi';
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
    setCurrent,
    setLoaiDichVu,
    setDanhSach,
    setCondition,
  } = useModel('dichvumotcuav2');

  const access = useAccess();

  const { getProductByCodeModel } = useModel('thanhtoan');
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  useEffect(() => {
    setLoaiDichVu(arrPathName?.includes('dvmc') ? 'DVMC' : 'VAN_PHONG_SO');
    getAllHinhThucDaoTaoModel();
    return () => {
      setRecord({} as DichVuMotCuaV2.BieuMau);
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
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTaoId',
      align: 'center',
      hide: !access.admin,
      render: (val) => (
        <div>{danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}</div>
      ),
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

                  setCurrent(arrPathName?.includes('dvmc') ? 0 : 1);
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
        <Button
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({} as DichVuMotCuaV2.BieuMau);
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
