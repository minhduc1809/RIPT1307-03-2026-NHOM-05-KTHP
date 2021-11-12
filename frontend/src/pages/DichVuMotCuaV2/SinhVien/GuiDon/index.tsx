/* eslint-disable no-underscore-dangle */
import DanhMuc from '@/pages/DichVuMotCuaV2/components/DanhMuc';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Select } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { includes } from '@/utils/utils';
import { getInfoSinhVien } from '@/services/ant-design-pro/api';

const SinhVienTaoDon = () => {
  const {
    danhSach,
    getAllBieuMauModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setRecord,
    record,
  } = useModel('dichvumotcuav2');
  const [infoSinhVien, setInfoSinhVien] = useState<Login.Profile>();
  useEffect(() => {
    const getInfoSV = async () => {
      const res = await getInfoSinhVien();
      setInfoSinhVien(res?.data?.data ?? {});
    };
    getInfoSV();
    getAllBieuMauModel();
  }, []);

  return (
    <Card>
      <b>Loại biểu mẫu:</b>
      <Select
        notFoundContent="Chưa có biểu mẫu nào"
        placeholder="Chọn loại biểu mẫu"
        onChange={(val: string) => {
          setRecord(danhSach?.find((item) => item._id === val));
        }}
        showSearch
        filterOption={(value, option) => includes(option?.props.children, value)}
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
        disabled={!record?._id}
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
          type="create"
          infoNguoiTaoDon={infoSinhVien}
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
