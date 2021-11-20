import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { history, useModel } from 'umi';
import HocLieuSo from './components/HocLieuSo';
import KetQuaHocTapGV from './components/KetQuaHocTap/KetQuaHocTapGV';
import KetQuaHocTapSV from './components/KetQuaHocTap/KetQuaHocTapSV';
import ThongBao from './components/ThongBao';
import ThongTinChung from './components/ThongTinChung';
import DiemDanh from './components/DiemDanh';

const DetailLopTinChi = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: number } };
}) => {
  const { record } = useModel('loptinchi');
  const isNhanVien = localStorage.getItem('vaiTro') === 'nhan_vien';
  return (
    <Card
      bodyStyle={{ paddingTop: 4 }}
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
            {record?.ma_lop ?? ''} - {record?.mon_hoc_ids?.[1] ?? ''}
          </Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs>
        <Tabs.TabPane tab={isNhanVien ? 'Danh sách sinh viên' : 'Thông tin chung'} key="1">
          <ThongTinChung id={id} isGiangVien={isNhanVien} />
        </Tabs.TabPane>
        {isNhanVien && (
          <Tabs.TabPane tab="Điểm danh" key="2">
            <DiemDanh idLopTinChi={id} />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab="Kết quả học tập" key="3">
          {isNhanVien ? <KetQuaHocTapGV id={id} /> : <KetQuaHocTapSV id={id} />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông báo" key="4">
          <ThongBao isNhanVien={isNhanVien} id={id} typeLop="LopTinChi" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Học liệu số" key="5">
          <HocLieuSo />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DetailLopTinChi;
