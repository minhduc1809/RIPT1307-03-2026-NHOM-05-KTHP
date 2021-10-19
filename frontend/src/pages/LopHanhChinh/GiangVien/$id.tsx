import ThongBao from '@/pages/LopTinChi/components/ThongBao';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getDSSVLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ThongTinChung from '../components/ThongTinChung';

const DetailLopHanhChinh = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: number } };
}) => {
  const { record } = useModel('lophanhchinh');

  const { initialState } = useModel('@@initialState');

  const isGiangVien = localStorage.getItem('vaiTro') === 'giang_vien';

  const [danhSachSinhVien, setDanhSachSinhVien] = useState<APILopHanhChinh.DanhSachSinhVien[]>([]);
  useEffect(() => {
    const getData = async () => {
      const res = await getDSSVLopHanhChinh(id);
      setDanhSachSinhVien(res?.data?.data?.sinhVienList ?? []);
    };
    getData();
  }, []);

  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/lophanhchinhgiangvien');
            }}
          >
            <TeamOutlined /> Lớp hành chính
          </Breadcrumb.Item>
          <Breadcrumb.Item>{record?.ten_lop_hanh_chinh ?? ''}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs>
        <Tabs.TabPane tab={isGiangVien ? 'Danh sách sinh viên' : 'Thông tin chung'} key="1">
          <ThongTinChung
            danhSachSinhVien={danhSachSinhVien}
            siSo={record?.si_so ?? 0}
            giangVien={initialState?.currentUser}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thông báo" key="4">
          <ThongBao isGiangVien={isGiangVien} id={id} typeLop="LopHanhChinh" />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DetailLopHanhChinh;
