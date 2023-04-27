import { AppstoreOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from '../NoticeIcon/index.less';
import ModuleView from './ModuleView';

const ModuleSwitch = () => {
  return (
    <HeaderDropdown
      placement="bottomRight"
      overlayClassName={styles.popover}
      overlay={<ModuleView />}
      trigger={['click']}
    >
      <Tooltip title="Danh sách chức năng" placement="bottom">
        <AppstoreOutlined />
      </Tooltip>
    </HeaderDropdown>
  );
};

export default ModuleSwitch;
