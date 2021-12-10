/* eslint-disable no-underscore-dangle */
import { useModel, history } from 'umi';
import { useEffect } from 'react';
import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { Button, Card, Modal, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FormBieuMau from '../../components/FormBieuMau';

const GuiDon = () => {
  const {
    danhSach,
    getAllBieuMauModel,
    setDanhSach,
    setLoaiDichVu,
    record,
    setRecord,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
  } = useModel('dichvumotcuav2');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const isDVMC = arrPathName?.includes('dvmc');
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    setLoaiDichVu(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    getAllBieuMauModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
    };
  }, []);

  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 120,
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'ten',
      search: 'search',
      align: 'left',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (recordBieuMau: DichVuMotCuaV2.BieuMau) => (
        <Tooltip title="Sử dụng dịch vụ">
          <Button
            onClick={() => {
              if (isDVMC) history.push(`/dichvumotcuasv/taodon/dvmc/${recordBieuMau?._id}`);
              else {
                setRecord(recordBieuMau);
                setVisibleFormBieuMau(true);
              }
            }}
            shape="circle"
            type="primary"
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <Card title="Dịch vụ một cửa">
      <Table
        otherProps={{ pagination: false }}
        hasTotal
        columns={columns}
        data={danhSach?.map((item, index) => ({ ...item, index: index + 1 }))}
      />
      {!isDVMC && (
        <Modal
          destroyOnClose
          onCancel={() => {
            setVisibleFormBieuMau(false);
          }}
          footer={false}
          width="800px"
          bodyStyle={{ padding: 0 }}
          visible={visibleFormBieuMau}
        >
          <FormBieuMau
            type="create"
            infoNguoiTaoDon={initialState?.currentUser}
            record={
              {
                thongTinDichVu: { ...record },
              } as DichVuMotCuaV2.Don
            }
          />
        </Modal>
      )}
    </Card>
  );
};

export default GuiDon;
