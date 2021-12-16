import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDonAdmin from './components/TableQuanLyDonAdmin';

const { TabPane } = Tabs;

const QuanLyDonAdmin = () => {
  const {
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    setDanhSach,
    setRecord,
    setCondition,
    setFilterInfo,
  } = useModel('dichvumotcuav2');

  useEffect(() => {
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
        <TabPane tab="Chờ xử lý" key="PROCESSING" />
        <TabPane tab="Duyệt" key="OK" />
        <TabPane tab="Không duyệt" key="NOT_OK" />
      </Tabs>
      <TableQuanLyDonAdmin />
    </Card>
  );
};

export default QuanLyDonAdmin;
