import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import { useEffect } from 'react';
import { Button, Card, Dropdown, Menu, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import TableChiTieu from './components/TableChiTieu';
import { EModeKhoiTao } from '@/utils/constants';
import { CheckSquareOutlined, SlidersOutlined } from '@ant-design/icons';
import { useCheckAccess } from '@/utils/utils';

const ChiTieu = () => {
  const { record } = useModel('dottuyensinh');
  const { setRecord, loading, adminExportGiaLapModel, KhoiTaoKetQuaXetTuyenModel } =
    useModel('chitieu');
  const [idCoSo, setIdCoSo] = useState<string | undefined>(record?.danhSachCoSoDaoTao?.[0]?._id);
  useEffect(() => {
    setIdCoSo(record?.danhSachCoSoDaoTao?.[0]?._id);
  }, [record?._id]);

  useEffect(() => {
    return () => {
      setRecord(undefined);
    };
  }, []);

  const khoiTaoAll = useCheckAccess('danh-sach-trung-tuyen:khoi-tao-all');

  return (
    <Card title="Chỉ tiêu xét tuyển">
      <FilterDotTuyenSinh />
      {record?.choPhepGiaLapTheoCoSo !== true && (
        <>
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
          {khoiTaoAll && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (val: any) => {
                    await KhoiTaoKetQuaXetTuyenModel(record?._id ?? '', { mode: val?.key });
                  }}
                >
                  <Menu.Item key={EModeKhoiTao.SO_LUONG}>Sử dụng chỉ tiêu số lượng</Menu.Item>
                  <Menu.Item key={EModeKhoiTao.DIEM_SAN}>Sử dụng chỉ tiêu điểm sàn</Menu.Item>
                </Menu>
              }
            >
              <Button
                style={{ marginLeft: 8 }}
                icon={<CheckSquareOutlined />}
                loading={loading}
                type="primary"
              >
                Khởi tạo DS Trúng tuyển
              </Button>
            </Dropdown>
          )}
        </>
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
