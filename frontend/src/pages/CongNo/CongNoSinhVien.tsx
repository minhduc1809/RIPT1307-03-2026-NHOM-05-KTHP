import { Card, Tabs } from 'antd';
import TableCongNo from './components/TableCongNo';
import { useModel } from 'umi';
import { useState } from 'react';

const CongNoSinhVien = () => {
  const { setCondition, condition } = useModel('thanhtoan');
  const [tableType, setTableType] = useState<'chưa nộp' | 'đã nộp'>('chưa nộp');
  const onChangeTab = (key: string) => {
    setTableType(key === '1' ? 'chưa nộp' : 'đã nộp');
    setCondition({
      ...condition,
      status:
        key === '1'
          ? 'open'
          : {
              $in: ['paid', 'overpaid'],
            },
    });
  };

  return (
    <Card bodyStyle={{ paddingTop: 8 }} title="Thanh toán">
      <Tabs onChange={onChangeTab}>
        <Tabs.TabPane tab="Các khoản chưa nộp" key="1" />
        <Tabs.TabPane tab="Các khoản đã nộp" key="2" />
      </Tabs>
      <TableCongNo type={tableType} />
    </Card>
  );
};

export default CongNoSinhVien;
