import Timeline from '@/components/Timeline';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Sticky from 'react-stickynode';
import { useModel } from 'umi';
import ThongTinCaNhan from '../DangKyXetTuyen/components/ThongTinCaNhan';
import Content from './Content';
import Stepper from './Steps';

const NhapHoc = () => {
  const isMdScreen = useMediaQuery({
    query: '(min-width: 992px)',
  });
  const { getAllDanToc, getAllTonGiao } = useModel('dantoctongiao');
  useEffect(() => {
    getAllDanToc();
    getAllTonGiao();
  }, []);
  return (
    <Row gutter={12}>
      <Col xs={24} lg={6} xl={5}>
        {isMdScreen ? (
          <Sticky top={60} bottomBoundary="#content">
            <div>
              <ThongTinCaNhan />
              <Stepper />
            </div>
          </Sticky>
        ) : (
          <div>
            <ThongTinCaNhan />
            <Stepper />
          </div>
        )}
      </Col>
      <Col xs={24} lg={18} xl={19}>
        <div id="content">
          <Timeline />
          <Content />
        </div>
      </Col>
    </Row>
  );
};

export default NhapHoc;
