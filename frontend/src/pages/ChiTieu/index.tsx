import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import { useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import TableChiTieu from './components/TableChiTieu';

const ChiTieu = () => {
  const { record } = useModel('dottuyensinh');
  const { setRecord } = useModel('chitieu');
  const [idCoSo, setIdCoSo] = useState<string | undefined>(record?.danhSachCoSoDaoTao?.[0]?._id);
  useEffect(() => {
    setIdCoSo(record?.danhSachCoSoDaoTao?.[0]?._id);
  }, [record?._id]);

  useEffect(() => {
    return () => {
      setRecord(undefined);
    };
  }, []);

  return (
    <Card title="Chỉ tiêu xét tuyển">
      <FilterDotTuyenSinh />
      <Tabs
        activeKey={idCoSo}
        onChange={(key) => {
          setIdCoSo(key);
        }}
      >
        {record?.danhSachCoSoDaoTao?.map((item) => (
          <Tabs.TabPane tab={item?.ten} tabKey={item?._id} key={item._id} />
        ))}
      </Tabs>
      <TableChiTieu idCoSo={idCoSo} />
    </Card>
  );
};

export default ChiTieu;
