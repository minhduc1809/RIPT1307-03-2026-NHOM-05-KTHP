import ThoiKhoaBieu from '@/pages/Calendar';
import TinTuc from '@/pages/QuanLyTinTuc';
import { Col, Row } from 'antd';
import BlockSinhVien from './components/BlockSinhVien';
import { useAccess } from 'umi';
import BlockAdmin from './components/BlockAdmin';

const TrangChu = () => {
  const access = useAccess();
  return (
    <>
      <Row gutter={[20, 20]}>
        {access.sinhVien && <BlockSinhVien />}
        {(access.admin || access.quanTri) && <BlockAdmin />}
        {access.sinhVienVaNhanVien && (
          <>
            <Col xs={24} lg={14} xl={16}>
              <ThoiKhoaBieu type="dashboard" />
            </Col>
            <Col xs={24} lg={10} xl={8}>
              <TinTuc type="dashboard" />
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default TrangChu;
