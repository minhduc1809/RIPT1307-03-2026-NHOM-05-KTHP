/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Form from './components/Form';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { useState } from 'react';
import moment from 'moment';

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
    setRecordQuyTrinh,
    setCurrent,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [visible, setVisible] = useState<boolean>(false);
  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 200,
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      search: 'search',
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
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
                  setRecord(record);
                  setEdit(true);
                  setVisibleForm(true);
                  setRecordQuyTrinh({
                    ...(record?.quyTrinh ?? {}),
                    danhSachBuoc: record?.quyTrinh?.danhSachBuoc?.map((buoc) => {
                      return {
                        ...buoc,
                        danhSachThaoTac: buoc?.danhSachThaoTac?.map((thaoTac) => {
                          return {
                            ...thaoTac,
                            hanXuLy: thaoTac?.hanXuLy ? moment(thaoTac.hanXuLy) : undefined,
                          };
                        }),
                      };
                    }),
                  });
                  setCurrent(0);
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

  return (
    <>
      <TableBase
        widthDrawer="60%"
        formType="Drawer"
        title="Quản lý dịch vụ"
        modelName="dichvumotcuav2"
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition]}
        getData={getBieuMauAdminModel}
        Form={Form}
      >
        <Button
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({} as DichVuMotCuaV2.BieuMau);
            setRecordQuyTrinh({} as DichVuMotCuaV2.QuyTrinh);
            setCurrent(0);
          }}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
          Thêm mới
        </Button>
      </TableBase>

      <Modal
        destroyOnClose
        width="60%"
        footer={false}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <FormView
          onCancel={() => {
            setVisible(false);
          }}
          type="view"
          record={recordView}
        />
      </Modal>
    </>
  );
};

export default QuanLyBieuMau;
