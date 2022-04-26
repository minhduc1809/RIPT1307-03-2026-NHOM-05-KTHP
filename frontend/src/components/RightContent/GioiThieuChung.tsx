import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel, useAccess } from 'umi';

const GioiThieuChung = (props: { marginTop: number }) => {
  const access = useAccess();
  const { getSettingByKeyModel, record } = useModel('setting');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (access.thiSinh || access.thiSinhChuaKichHoat) getSettingByKeyModel('GIOI_THIEU_CHUNG');
  }, []);

  return (
    <>
      <InfoCircleOutlined
        style={{ fontSize: 20, marginTop: props.marginTop }}
        onClick={() => {
          setVisible(true);
        }}
      />
      <Modal
        width={1000}
        title="Giới thiệu chung"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            OK
          </Button>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: record?.value ?? '' }} />
      </Modal>
    </>
  );
};

export default GioiThieuChung;
