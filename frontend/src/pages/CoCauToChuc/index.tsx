import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Row, Col, Button, Tabs } from 'antd';
import { useEffect } from 'react';
import CayCoCauToChuc from './components/CayCoCauToChuc';
import BasicInfo from './components/BasicInfo';
import DanhSachCanBo from './components/DanhSachCanBo';
import DanhSachCanBoKiemNhiem from './components/DanhSachCanBoKiemNhiem';

const CoCauToChuc = () => {
  const { getAllDonViModel, setRecord, record } = useModel('donvi');

  useEffect(() => {
    getAllDonViModel();
    return () => {
      setRecord(undefined);
    };
  }, []);

  return (
    <>
      <Card title="Cơ cấu tổ chức">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button
              type="primary"
              // onClick={this.handleThemMoiKhoa}
              icon={<PlusOutlined />}
            >
              Thêm mới đơn vị
            </Button>
          </Col>
          <Col xs={24} md={12}>
            <CayCoCauToChuc />
          </Col>
          <Col xs={24} md={12}>
            <BasicInfo />
          </Col>
        </Row>
      </Card>
      <br />
      {record?.ten_don_vi && (
        <Tabs type="card">
          <Tabs.TabPane
            tab={
              ['Hội đồng Học viện', 'Ban giám đốc Học viện', 'Lãnh đạo Học viện'].includes(
                record?.ten_don_vi,
              )
                ? 'Danh sách thành viên'
                : 'Danh sách cán bộ'
            }
            key="1"
          >
            <DanhSachCanBo />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Lãnh đạo" key="2">
            <DanhSachCanBoKiemNhiem />
          </Tabs.TabPane>
        </Tabs>
      )}
    </>
  );
};

export default CoCauToChuc;
