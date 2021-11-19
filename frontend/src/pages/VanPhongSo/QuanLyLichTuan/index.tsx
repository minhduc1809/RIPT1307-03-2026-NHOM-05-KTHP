/* eslint-disable no-underscore-dangle */
import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import Sukien from '@/pages/SuKien';

const LichTuan = () => {
  useEffect(() => {}, []);

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card
            bodyStyle={{ padding: 0 }}
            style={{ height: '100%' }}
            bordered={false}
            title={<div className="cardTitle">Lịch tuần Học viện (Bản nháp)</div>}
          >
            <Sukien loaiLichTuan="nhap" />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bodyStyle={{ padding: 0 }}
            style={{ height: '100%' }}
            bordered={false}
            title={<div className="cardTitle">Lịch tuần Học viện (Bản chính thức)</div>}
          >
            <Sukien loaiLichTuan="chinhthuc" />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LichTuan;
