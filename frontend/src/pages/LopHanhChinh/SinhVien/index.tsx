import ThongBao from '@/pages/LopTinChi/components/ThongBao';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getDataLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ThongTinChungLopHanhChinh from '../components/ThongTinChung';

const LopHanhChinh = () => {
  const isGiangVien = localStorage.getItem('vaiTro') === 'giang_vien';
  const [dataLopHanhChinh, setdataLopHanhChinh] = useState<APILopHanhChinh.Data>(
    {} as APILopHanhChinh.Data,
  );
  useEffect(() => {
    const getData = async () => {
      const res = await getDataLopHanhChinh(isGiangVien ? 'can-bo' : 'sinh-vien');
      setdataLopHanhChinh(res?.data?.data ?? {});
    };
    getData();
  }, []);

  const { danhSachSinhVien, canBo, si_so, ten_lop_hanh_chinh } = dataLopHanhChinh;

  return (
    <Card title={`Lớp hành chính ${ten_lop_hanh_chinh || ''}`}>
      <Tabs>
        <Tabs.TabPane tab="Thông tin chung" key={0}>
          <ThongTinChungLopHanhChinh
            danhSachSinhVien={danhSachSinhVien || []}
            giangVien={canBo}
            siSo={si_so || 0}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông báo" key={1}>
          <ThongBao isGiangVien={isGiangVien} id={dataLopHanhChinh?.id} typeLop="LopHanhChinh" />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default LopHanhChinh;
