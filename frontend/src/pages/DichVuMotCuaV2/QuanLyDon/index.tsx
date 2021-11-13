import { Card, Tabs } from 'antd';
import TableQuanLyDon from './components/TableQuanLyDon';
import { useModel } from 'umi';
import { useEffect } from 'react';

const { TabPane } = Tabs;

const QuanLyDon = () => {
  const { trangThaiQuanLyDon, setTrangThaiQuanLyDon, getAllBieuMauChuyenVienModel } =
    useModel('dichvumotcuav2');

  useEffect(() => {
    getAllBieuMauChuyenVienModel();
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
