/* eslint-disable no-underscore-dangle */
import ThanhToan from '@/components/ThanhToan';
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
  const { visibleFormBieuMau, setVisibleFormBieuMau, record, getBieuMauByIdModel, recordDon } =
    useModel('dichvumotcuav2');
  const { visibleForm, setVisibleForm } = useModel('thanhtoan');
  const [infoSinhVien, setInfoSinhVien] = useState<Login.Profile>();
  useEffect(() => {
    window.scroll({ top: 0 });
    const getInfoSV = async () => {
      const res = await getInfoSinhVien();
      setInfoSinhVien(res?.data?.data ?? {});
    };
    getInfoSV();
    getBieuMauByIdModel(id);
    return () => {
      setVisibleForm(false);
    };
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
      {record?.thongTinThuTuc?.yeuCauTraPhi && (
        <Modal
          maskClosable={false}
          title="Thanh toán (Sinh viên có thể xem lại các thông tin này ở mục 'Đơn đã gửi')"
          destroyOnClose
          onCancel={() => {
            setVisibleForm(false);
          }}
          footer={
            <Button
              onClick={() => {
                setVisibleForm(false);
              }}
            >
              Đóng
            </Button>
          }
          width="800px"
          visible={visibleForm}
        >
          <ThanhToan record={recordDon} />
        </Modal>
      )}
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
