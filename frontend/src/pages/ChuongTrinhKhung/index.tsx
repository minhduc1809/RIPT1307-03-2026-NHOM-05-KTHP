import Block from './components/block';
import { Button, Card, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import InFoMonHoc from './components/ModalInfoMonHoc';

const ChuongTrinhKhung = () => {
  const { loading, getTienTrinhHocTapModel, tienTrinhHocTap } = useModel('chuongtrinhkhung');
  const arrKyHoc: number[] = [];
  const [visible, setVisible] = useState<boolean>(false);
  const length = tienTrinhHocTap?.[0]?.mon_hoc_dieu_kien_ids?.length ?? 0;
  for (let i = 1; i <= tienTrinhHocTap?.[0]?.mon_hoc_dieu_kien_ids?.[length - 1]?.hoc_ky; i += 1)
    arrKyHoc.push(i);
  const { getInfoMonHocModel } = useModel('loptinchi');
  useEffect(() => {
    getTienTrinhHocTapModel();
  }, []);

  return (
    <Card title="Tiến trình học tập">
      <Spin spinning={loading}>
        <b>Ngành: {tienTrinhHocTap?.[0]?.ten_chuong_trinh_khung}</b>
        <ul>
          <li>
            <br />
            <b> I. Học phần chung của ngành:</b>
            <div style={{ overflowX: 'auto' }}>
              {arrKyHoc?.map((item) => {
                let soTinChiKy = 0;
                tienTrinhHocTap?.[0]?.mon_hoc_dieu_kien_ids?.forEach((mon) => {
                  if (mon.hoc_ky === item) soTinChiKy += mon?.so_tin_chi ?? 0;
                });
                return (
                  <div style={{ display: 'flex' }} key={item}>
                    <Block type="hocky" title={`Học kỳ ${item}`} number={soTinChiKy} />
                    {tienTrinhHocTap?.[0]?.mon_hoc_dieu_kien_ids
                      ?.filter((mon) => mon.hoc_ky === item)
                      ?.map((mon) => {
                        return (
                          <div
                            onClick={() => {
                              getInfoMonHocModel(mon?.hoc_phan_id?.[0]);
                              setVisible(true);
                            }}
                          >
                            <Block
                              key={mon.id}
                              type="hocphan"
                              title={mon?.hoc_phan_id?.[1] ?? ''}
                              maHocPhan={mon?.ma_hoc_phan_moi ?? ''}
                              diem={mon?.ketQuaHocTap}
                              number={mon?.so_tin_chi ?? 0}
                            />
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </li>
          <li>
            <br />
            <b> II. Học phần riêng của chuyên ngành:</b>
            <div style={{ overflowX: 'auto' }}></div>
          </li>
        </ul>
        <br />
        <br />
      </Spin>
      <Modal
        title="Thông tin học phần"
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
        onCancel={() => setVisible(false)}
        visible={visible}
      >
        <InFoMonHoc />
      </Modal>
    </Card>
  );
};

export default ChuongTrinhKhung;
