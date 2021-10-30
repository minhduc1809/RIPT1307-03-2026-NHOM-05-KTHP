import { Role } from '@/utils/constants';
import { Avatar, Card, List, message } from 'antd';
import logo from '@/assets/logo.png';
import { getInfo } from '@/services/ant-design-pro/api';
import data from '@/utils/data';
import { useModel, history, useIntl } from 'umi';
import { getCodeAccess } from '@/utils/utils';

const SelectRoles = (props: {
  roles: { token: string; vai_tro: string }[];
  onClose?: Function;
  type: 'login' | 'changeRole';
}) => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { getThongBaoModel } = useModel('thongbao');
  const vaiTro = localStorage?.getItem('vaiTro');
  const handleRole = async (role: { token: string; vai_tro: string }) => {
    const defaultloginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: 'success',
    });
    localStorage.setItem('token', role?.token);
    localStorage.setItem('vaiTro', role?.vai_tro);
    const info = await getInfo();
    const arrCodeAccess = await getCodeAccess();
    setInitialState({
      ...initialState,
      currentUser: info?.data?.data ?? {},
      arrCodeAccess,
    });
    message.success(
      props.type === 'login'
        ? defaultloginSuccessMessage
        : `Đăng nhập với vai trò ${Role[role.vai_tro]}`,
    );
    history.push(data?.path?.[role?.vai_tro] ?? '/');
    getThongBaoModel();
    if (props.onClose) props.onClose();
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={
        props.type === 'changeRole'
          ? props.roles?.filter((item) => item.vai_tro !== vaiTro)
          : props.roles
      }
      renderItem={(item) => (
        <>
          <Card onClick={() => handleRole(item)} hoverable>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ width: 30, height: 40 }} shape="square" src={logo} />}
                title={<a>{Role[item.vai_tro]}</a>}
                description={`Đăng nhập với vai trò ${Role[item.vai_tro]}`}
              />
            </List.Item>{' '}
          </Card>
          <br />
        </>
      )}
    />
  );
};

export default SelectRoles;
