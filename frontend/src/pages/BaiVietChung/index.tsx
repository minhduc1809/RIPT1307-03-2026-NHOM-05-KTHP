import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Drawer } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const BaiVietChung = () => {
  const { record, getSettingByKeyModel, visibleForm, setVisibleForm, loading } =
    useModel('setting');

  useEffect(() => {
    getSettingByKeyModel('GIOI_THIEU_CHUNG');
  }, []);

  return (
    <Card
      loading={loading}
      title={
        <div>
          Bài viết chung
          <Button
            onClick={() => setVisibleForm(true)}
            style={{ float: 'right' }}
            type="primary"
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div dangerouslySetInnerHTML={{ __html: record?.value ?? '' }} />
      <Drawer
        bodyStyle={{ padding: 0 }}
        width="60%"
        visible={visibleForm}
        onClose={() => setVisibleForm(false)}
      >
        <Form />
      </Drawer>
    </Card>
  );
};

export default BaiVietChung;
