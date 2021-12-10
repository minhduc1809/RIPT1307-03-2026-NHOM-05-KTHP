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
