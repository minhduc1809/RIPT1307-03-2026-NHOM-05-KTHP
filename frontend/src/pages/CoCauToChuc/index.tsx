import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Row, Col, Button, Tabs, Modal } from 'antd';
import { useEffect } from 'react';
import CayCoCauToChuc from './components/CayCoCauToChuc';
import BasicInfo from './components/BasicInfo';
import DanhSachCanBo from './components/DanhSachCanBo';
import DanhSachCanBoKiemNhiem from './components/DanhSachCanBoKiemNhiem';
import FormCoCauToChuc from './components/FormCoCauToChuc';

const CoCauToChuc = () => {
  const { getAllDonViModel, setRecord, record, visibleForm, setEdit, setVisibleForm } =
    useModel('donvi');
  const { setPage, setLimit, setCondition, setFilterInfo } = useModel('canbo');
  useEffect(() => {
    getAllDonViModel();
    return () => {
      setRecord(undefined);
    };
  }, []);

  return (
    <>
      <Card title="Cơ cấu tổ chức">
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Button
              type="primary"
              onClick={() => {
                setEdit(false);
                setRecord(undefined);
                setVisibleForm(true);
              }}
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
        <Tabs
          onChange={() => {
            setPage(1);
            setLimit(10);
            setCondition({});
            setFilterInfo({});
          }}
          type="card"
        >
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
      <Modal
        onCancel={() => {
          setVisibleForm(false);
        }}
        footer={false}
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        visible={visibleForm}
      >
        <FormCoCauToChuc />
      </Modal>
    </>
  );
};

export default CoCauToChuc;
