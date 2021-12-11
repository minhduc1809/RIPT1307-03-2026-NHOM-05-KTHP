/* eslint-disable no-underscore-dangle */
import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDon from './components/TableQuanLyDon';

const { TabPane } = Tabs;

const QuanLyDon = () => {
  const {
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    getAllBieuMauChuyenVienDieuPhoiModel,
    getAllBieuMauChuyenVienTiepNhanModel,
    setRecord,
    setDanhSach,
    setCondition,
    setFilterInfo,
    setLoaiDichVu,
  } = useModel('dichvumotcuav2');

  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const isDVMC = arrPathName?.includes('dvmc');
  useEffect(() => {
    setLoaiDichVu(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    if (arrPathName?.includes('quanlydondieuphoi'))
      getAllBieuMauChuyenVienDieuPhoiModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    else getAllBieuMauChuyenVienTiepNhanModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setCondition({});
      setFilterInfo({});
    };
  }, []);

  return (
    <Card bodyStyle={{ padding: '8px 24px 24px 24px' }} title="Quản lý đơn">
      <Tabs
        onChange={(key: string) => {
          setTrangThaiQuanLyDon(key);
        }}
        activeKey={trangThaiQuanLyDon}
      >
        <TabPane tab="Chờ xử lý" key="PENDING" />
        <TabPane tab="Duyệt" key="OK" />
        <TabPane tab="Không duyệt" key="NOT_OK" />
      </Tabs>
      <TableQuanLyDon />
    </Card>
  );
};

export default QuanLyDon;
