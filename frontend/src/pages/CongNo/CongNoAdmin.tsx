import { Card } from 'antd';
import TableCongNo from './components/TableCongNo';

const CongNoAdmin = () => {
  return (
    <Card bodyStyle={{ padding: 0 }} title="Công nợ">
      <TableCongNo />
    </Card>
  );
};

export default CongNoAdmin;
