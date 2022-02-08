import Timeline from '@/components/Timeline';
import { Row, Col } from 'antd';
import Content from './Content';
import Stepper from './Steps';
import ThongTinCaNhan from '../DangKyXetTuyen/ThongTinCaNhan';
import { useModel } from 'umi';
import { useEffect } from 'react';

const NhapHoc = (props: { idDot: string }) => {
  const { getAllDanToc, getAllTonGiao } = useModel('dantoctongiao');
  useEffect(() => {
    getAllDanToc();
    getAllTonGiao();
  }, []);
  return (
    <Row gutter={12}>
      <Col xs={24} lg={4}>
        <ThongTinCaNhan />
        <Stepper />
      </Col>
      <Col xs={24} lg={20}>
        <Timeline idDot={props.idDot} />
        <Content />
      </Col>
    </Row>
  );
};

export default NhapHoc;
