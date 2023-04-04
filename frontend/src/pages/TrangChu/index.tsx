import ThoiKhoaBieu from '@/pages/Calendar';
import { Col, Row } from 'antd';
import { useAccess } from 'umi';
import TinTucDashboard from '../TinTuc/TinTucDashboard';
import BlockAdmin from './components/BlockAdmin';
import BlockSinhVien from './components/BlockSinhVien';

const TrangChu = () => {
  const access = useAccess();
  return (
    <>
      <Row gutter={[20, 20]}>
        {/* {access.sinhVien && <BlockSinhVien />}
        {(access.admin || access.quanTri || access.guest) && <BlockAdmin />}
        {access.sinhVienVaNhanVien && (
          <>
            <Col xs={24} lg={14} xl={16}>
              <ThoiKhoaBieu type="dashboard" />
            </Col>
            <Col xs={24} lg={10} xl={8}>
              <TinTucDashboard />
            </Col>
          </>
        )} */}
      </Row>
    </>
  );
};

export default TrangChu;
