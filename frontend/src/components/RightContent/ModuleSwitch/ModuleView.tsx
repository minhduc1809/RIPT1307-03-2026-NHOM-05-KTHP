import { UserSwitchOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useModel } from 'umi';
import './style.less';
import { Modules } from '@/services/ant-design-pro/constant';

const ModuleView = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;

  return (
    <div className="module-view">
      <div className="module-header">Danh sách chức năng</div>

      <Row gutter={[5, 5]}>
        {user?.permissions?.map((item) => (
          <Col span={8} key={item.rsid}>
            <a href={Modules?.[item.rsname]?.url} target="_blank" rel="noreferrer">
              <div className="module-item">
                <UserSwitchOutlined />
                <span className="module-name">{Modules?.[item.rsname]?.title ?? item.rsname}</span>
              </div>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ModuleView;
