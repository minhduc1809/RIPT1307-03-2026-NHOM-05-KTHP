import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { history, useModel } from 'umi';
import HocLieuSo from './components/HocLieuSo';
import KetQuaHocTapGV from './components/KetQuaHocTap/KetQuaHocTapGV';
import KetQuaHocTapSV from './components/KetQuaHocTap/KetQuaHocTapSV';
import ThongBao from './components/ThongBao';
import ThongTinChung from './components/ThongTinChung';

const DetailLopTinChi = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { record } = useModel('loptinchi');
  const isGiangVien = localStorage.getItem('vaiTro') === 'giang_vien';
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/loptinchi');
            }}
          >
            <TeamOutlined /> Lớp tín chỉ
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {record?.ma_lop ?? ''}-{record?.mon_hoc_ids?.[1] ?? ''}
          </Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs>
        <Tabs.TabPane tab={isGiangVien ? 'Danh sách sinh viên' : 'Thông tin chung'} key="1">
          <ThongTinChung id={id} isGiangVien={isGiangVien} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Điểm danh" key="2">
          Tính năng đang phát triển
        </Tabs.TabPane>
        <Tabs.TabPane tab="Kết quả học tập" key="3">
          {isGiangVien ? <KetQuaHocTapGV id={id} /> : <KetQuaHocTapSV id={id} />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông báo" key="4">
          <ThongBao isGiangVien={isGiangVien} id={id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Học liệu số" key="5">
          <HocLieuSo />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DetailLopTinChi;
