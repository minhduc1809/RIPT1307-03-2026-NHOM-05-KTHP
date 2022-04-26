import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import { useEffect } from 'react';
import { Button, Card, Dropdown, Menu, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import TableChiTieu from './components/TableChiTieu';
import { EModeKhoiTao } from '@/utils/constants';
import { SlidersOutlined } from '@ant-design/icons';

const ChiTieu = () => {
  const { record } = useModel('dottuyensinh');
  const { setRecord, loading, adminExportGiaLapModel } = useModel('chitieu');
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
      {record?.choPhepGiaLapTheoCoSo !== true && (
        <Dropdown
          overlay={
            <Menu
              onClick={async (val: { key: string }) => {
                adminExportGiaLapModel(record?._id ?? '', { mode: val.key as EModeKhoiTao });
              }}
            >
              <Menu.Item key={EModeKhoiTao.SO_LUONG}>Sử dụng chỉ tiêu số lượng</Menu.Item>
              <Menu.Item key={EModeKhoiTao.DIEM_SAN}>Sử dụng chỉ tiêu điểm sàn</Menu.Item>
            </Menu>
          }
          key="ellipsis"
        >
          <Button icon={<SlidersOutlined />} loading={loading} type="primary">
            Giả lập điểm
          </Button>
        </Dropdown>
      )}
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
