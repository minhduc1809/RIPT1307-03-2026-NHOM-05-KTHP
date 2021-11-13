import ThoiKhoaBieu from '@/pages/Calendar';
import TinTuc from '@/pages/QuanLyTinTuc';
import { Col, Row } from 'antd';
import BlockSinhVien from './components/BlockSinhVien';

const TrangChu = () => {
  const vaiTro = localStorage?.getItem('vaiTro');
  return (
    <>
      <Row gutter={[20, 20]}>
        {vaiTro === 'sinh_vien' && <BlockSinhVien />}
        <Col xs={24} lg={14} xl={16}>
          <ThoiKhoaBieu type="dashboard" />
        </Col>
        <Col xs={24} lg={10} xl={8}>
          <TinTuc type="dashboard" />
        </Col>
      </Row>
    </>
  );
};

export default TrangChu;
