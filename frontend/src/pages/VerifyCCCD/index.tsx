import GlobalFooter from '@/components/GlobalFooter';
import Header from '@/components/Header';
import data from '@/utils/data';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import EditCCCD from '../account/center/components/Profile/EditCCCD';

const VerifyCCCD = () => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    const verifiedCCCD = initialState?.currentUser?.cmtCccd !== undefined;
    if (verifiedCCCD) {
      history.push(data?.path?.[initialState?.currentUser?.systemRole || 'guest'] ?? '/');
    }
  }, [initialState?.currentUser?.systemRole, initialState?.currentUser?.cmtCccd]);
  return (
    <>
      <Header />
      <Card
        title="Cập nhật thông tin cá nhân"
        style={{
          width: '400px',
          margin: '50px auto',
          textAlign: 'center',
          boxShadow: '0 1px 2px -2px rgb(0, 0, 0, 0.1), 0 3px 6px 0 rgb(0, 0, 0, 0.05)',
        }}
        bodyStyle={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: 0,
        }}
      >
        <EditCCCD />
      </Card>

      <GlobalFooter />
    </>
  );
};

export default VerifyCCCD;
