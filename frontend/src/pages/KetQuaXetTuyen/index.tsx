import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import { EModeKhoiTao } from '@/utils/constants';
import { CheckSquareOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Menu, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableDanhSachTrungTuyen from './components/TableDanhSachTrungTuyen';

const DanhSachTrungTuyen = () => {
  const { record } = useModel('dottuyensinh');
  const { KhoiTaoKetQuaXetTuyenModel, loading } = useModel('chitieu');
  const { getKetQuaXetTuyenPageableModel } = useModel('ketquaxettuyen');
  const [idCoSo, setIdCoSo] = useState<string | undefined>(record?.danhSachCoSoDaoTao?.[0]?._id);
  useEffect(() => {
    setIdCoSo(record?.danhSachCoSoDaoTao?.[0]?._id);
  }, [record?._id]);

  return (
    <Card title="Danh sách trúng tuyển">
      <FilterDotTuyenSinh />
      {record?.choPhepGiaLapTheoCoSo !== true && (
        <Dropdown
          overlay={
            <Menu
              onClick={async (val: any) => {
                await KhoiTaoKetQuaXetTuyenModel(record?._id ?? '', { mode: val?.key });
                getKetQuaXetTuyenPageableModel(record?._id ?? '');
              }}
            >
              <Menu.Item key={EModeKhoiTao.SO_LUONG}>Sử dụng chỉ tiêu số lượng</Menu.Item>
              <Menu.Item key={EModeKhoiTao.DIEM_SAN}>Sử dụng chỉ tiêu điểm sàn</Menu.Item>
            </Menu>
          }
          key="ellipsis"
        >
          <Button icon={<CheckSquareOutlined />} loading={loading} type="primary">
            Khởi tạo DS Trúng tuyển
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
      <TableDanhSachTrungTuyen idCoSo={idCoSo} />
    </Card>
  );
};

export default DanhSachTrungTuyen;
