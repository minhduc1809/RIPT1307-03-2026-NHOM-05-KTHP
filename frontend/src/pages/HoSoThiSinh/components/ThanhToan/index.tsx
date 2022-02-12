import { Tabs } from 'antd';
import TableKhoanThu from './components/TableKhoanThu';

const { TabPane } = Tabs;

const CongNo = () => {
  return (
    <Tabs style={{ marginTop: '-8px' }} defaultActiveKey="1">
      <TabPane tab="Chưa thanh toán" key="1">
        <TableKhoanThu type="chuathanhtoan" />
      </TabPane>
      <TabPane tab="Đã thanh toán" key="2">
        <TableKhoanThu type="dathanhtoan" />
      </TabPane>
    </Tabs>
  );
};

export default CongNo;
