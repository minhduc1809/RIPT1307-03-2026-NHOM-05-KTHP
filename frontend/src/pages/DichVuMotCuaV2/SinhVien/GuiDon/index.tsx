/* eslint-disable no-underscore-dangle */
import DanhMuc from '@/pages/DichVuMotCua/components/DanhMuc';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Select } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';

const SinhVienTaoDon = () => {
  const {
    danhSach,
    getAllBieuMauModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setRecord,
    record,
  } = useModel('dichvumotcuav2');

  useEffect(() => {
    getAllBieuMauModel();
  }, []);

  return (
    <Card>
      <b>Loại biểu mẫu:</b>
      <Select
        onChange={(val: string) => {
          setRecord(danhSach?.find((item) => item._id === val));
        }}
        showSearch
        value={record?._id}
        style={{ width: '400px', marginBottom: 20, marginLeft: 8 }}
      >
        {danhSach?.map((item) => (
          <Select.Option key={item._id} value={item._id}>
            {item.ten}
          </Select.Option>
        ))}
      </Select>
      <Button
        onClick={() => {
          setVisibleFormBieuMau(true);
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
          setVisibleFormBieuMau(false);
        }}
        footer={false}
        width="800px"
        bodyStyle={{ padding: 0 }}
        visible={visibleFormBieuMau}
      >
        <FormBieuMau
          record={
            {
              thongTinDichVu: { ...record },
            } as DichVuMotCuaV2.Don
          }
        />
      </Modal>
      <DanhMuc />
    </Card>
  );
};

export default SinhVienTaoDon;
