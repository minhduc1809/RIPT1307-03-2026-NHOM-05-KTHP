import Timeline from '@/components/Timeline';
import { Row, Col, Affix } from 'antd';
import Content from './Content';
import Stepper from './Steps';
import ThongTinCaNhan from '../DangKyXetTuyen/ThongTinCaNhan';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const NhapHoc = (props: { idDot: string }) => {
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
          <Affix offsetTop={16}>
            <div>
              <ThongTinCaNhan />
              <Stepper />
            </div>
          </Affix>
        ) : (
          <div>
            <ThongTinCaNhan />
            <Stepper />
          </div>
        )}
      </Col>
      <Col xs={24} lg={18} xl={19}>
        <Timeline idDot={props.idDot} />
        <Content />
      </Col>
    </Row>
  );
};

export default NhapHoc;
