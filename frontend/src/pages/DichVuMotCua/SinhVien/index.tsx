import { Button, Card, Modal, Select } from 'antd';
import { LoaiDon, PhongBan } from '../components/constants';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DanhMuc from '../components/DanhMuc';
import { PlusCircleOutlined } from '@ant-design/icons';
import FormYeuCauCapGiayXacNhanTinhTrangHocTap from './CTCTSV/FormYeuCauCapGiayXacNhanTinhTrangHocTap';

const CTCTSV = () => {
  const pathname = window.location.pathname?.split('/')?.pop() ?? '';
  const { loaiGiayTo, setLoaiGiayTo, setLoaiPhongBan, visibleForm, setVisibleForm } =
    useModel('dichvumotcua');

  useEffect(() => {
    if (pathname) {
      setLoaiGiayTo(LoaiDon[PhongBan[pathname]]?.[0]);
      setLoaiPhongBan(PhongBan[pathname]);
    }
  }, [pathname]);

  return (
    <Card title={PhongBan?.[pathname]}>
      <b>Loại giấy tờ:</b>
      <Select
        showSearch
        value={loaiGiayTo}
        style={{ width: '400px', marginBottom: 20, marginLeft: 8 }}
      >
        {LoaiDon[PhongBan?.[pathname]]?.map((item: string) => (
          <Select.Option value={item}>{item}</Select.Option>
        ))}
      </Select>
      <Button
        onClick={() => {
          setVisibleForm(true);
        }}
        icon={<PlusCircleOutlined />}
        type="primary"
        style={{ float: 'right' }}
      >
        Sử dụng dịch vụ
      </Button>
      <Modal
        destroyOnClose
        onCancel={() => {
          setVisibleForm(false);
        }}
        footer={false}
        width="70%"
        bodyStyle={{ padding: 0 }}
        visible={visibleForm}
      >
        <FormYeuCauCapGiayXacNhanTinhTrangHocTap />
      </Modal>
      <DanhMuc />
    </Card>
  );
};

export default CTCTSV;
