/* eslint-disable no-underscore-dangle */
import DanhMuc from '@/pages/DichVuMotCuaV2/components/DanhMuc';
import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { getInfoSinhVien } from '@/services/ant-design-pro/api';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SinhVienTaoDon = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const {
    // danhSach,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    // setRecord,
    record,
    getBieuMauByIdModel,
  } = useModel('dichvumotcuav2');
  const [infoSinhVien, setInfoSinhVien] = useState<Login.Profile>();
  useEffect(() => {
    const getInfoSV = async () => {
      const res = await getInfoSinhVien();
      setInfoSinhVien(res?.data?.data ?? {});
    };
    getInfoSV();
    getBieuMauByIdModel(id);
  }, []);
  return (
    <Card>
      {/* <b>Loại biểu mẫu: {record?.ten ?? ''}</b> */}
      {/* <Select
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
      </Select> */}

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
      <DanhMuc
        button={
          <Button
            disabled={!record?._id}
            onClick={() => {
              setVisibleFormBieuMau(true);
            }}
            icon={<PlusCircleOutlined />}
            type="primary"
            style={{ marginRight: '18%' }}
          >
            Sử dụng dịch vụ
          </Button>
        }
      />
    </Card>
  );
};

export default SinhVienTaoDon;
