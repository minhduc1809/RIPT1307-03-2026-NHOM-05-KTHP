import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableDanhSachTrungTuyen from './components/TableDanhSachTrungTuyen';

const DanhSachTrungTuyen = () => {
  const { record } = useModel('dottuyensinh');
  const [idCoSo, setIdCoSo] = useState<string | undefined>(record?.danhSachCoSoDaoTao?.[0]?._id);
  useEffect(() => {
    setIdCoSo(record?.danhSachCoSoDaoTao?.[0]?._id);
  }, [record?._id]);

  return (
    <Card title="Danh sách trúng tuyển">
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
      <TableDanhSachTrungTuyen type="xacnhannhaphoc" hideThaoTac idCoSo={idCoSo} />
    </Card>
  );
};

export default DanhSachTrungTuyen;
