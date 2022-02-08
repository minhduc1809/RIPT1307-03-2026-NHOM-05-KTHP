import { Tabs } from 'antd';
import TableKhoanThu from './components/TableKhoanThu';

const { TabPane } = Tabs;

const CongNo = () => {
  return (
    <Tabs style={{ marginTop: '-8px' }} defaultActiveKey="1">
      <TabPane tab="Đã thanh toán" key="1">
        <TableKhoanThu type="dathanhtoan" />
      </TabPane>
      <TabPane tab="Chưa thanh toán" key="2">
        <TableKhoanThu type="chuathanhtoan" />
      </TabPane>
    </Tabs>
  );
};

export default CongNo;
