import { UserSwitchOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useModel } from 'umi';
import './style.less';

const ModuleView = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;
  console.log('🚀 ~ file: ModuleView.tsx:10 ~ ModuleView ~ user:', user);

  return (
    <div className="module-view">
      <div className="module-header">Danh sách chức năng</div>

      <Row gutter={[5, 5]}>
        <Col span={8}>
          <div className="module-item">
            <UserSwitchOutlined />
            <span className="module-name">Tổ chức nhân sự</span>
          </div>
        </Col>
        <Col span={8}>
          <div className="module-item">
            <UserSwitchOutlined />
            <span className="module-name">Tổ chức nhân sự</span>
          </div>
        </Col>
        <Col span={8}>
          <div className="module-item">
            <UserSwitchOutlined />
            <span className="module-name">Tổ chức nhân sự</span>
          </div>
        </Col>
        <Col span={8}>
          <div className="module-item">
            <UserSwitchOutlined />
            <span className="module-name">Tổ chức nhân sự</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ModuleView;
