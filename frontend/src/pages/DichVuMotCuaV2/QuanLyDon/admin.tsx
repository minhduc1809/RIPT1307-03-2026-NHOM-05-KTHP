import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDonAdmin from './components/TableQuanLyDonAdmin';

const { TabPane } = Tabs;

const QuanLyDonAdmin = () => {
  const { trangThaiQuanLyDonAdmin, setTrangThaiQuanLyDonAdmin, adminGetAllBieuMauModel } =
    useModel('dichvumotcuav2');

  useEffect(() => {
    adminGetAllBieuMauModel();
  }, []);

  return (
    <Card bodyStyle={{ padding: '8px 24px 24px 24px' }} title="Quản lý đơn">
      <Tabs
        onChange={(key: string) => {
          setTrangThaiQuanLyDonAdmin(key);
        }}
        activeKey={trangThaiQuanLyDonAdmin}
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
