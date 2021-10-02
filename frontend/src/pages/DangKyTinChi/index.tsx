import { Card, Select, Steps } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DangKyNhuCau from './components/DangKyNhuCau';
import TinChi from './components/DangKyTinChi';

const DangKyTinChi = () => {
  const { Step } = Steps;

  const {
    getAllKyHocModel,
    danhSach,
    record,
    setRecord,
    loading: loadingKyHoc,
  } = useModel('kyhoc');
  const { getDanhSachHocPhanDangKyModel, current, setCurrent, recordHocPhan } =
    useModel('dangkytinchi');

  useEffect(() => {
    getAllKyHocModel();
    getDanhSachHocPhanDangKyModel();
  }, []);

  const danhSachHocPhanKyNay: DangKyTinChi.MonHoc[] = [];
  const danhSachHocPhanHocVuot: DangKyTinChi.MonHoc[] = [];
  const danhSachHocPhanHocCaiThien: DangKyTinChi.MonHoc[] = recordHocPhan?.dat ?? [];
  const danhSachHocPhanHocLai: DangKyTinChi.MonHoc[] = recordHocPhan?.khongDat ?? [];
  recordHocPhan?.chuaHoc?.forEach((item) => {
    if (item?.soThuTuKyHoc === record?.soThuTu) {
      danhSachHocPhanKyNay?.push(item);
    } else danhSachHocPhanHocVuot?.push(item);
  });
  const danhSachTatCaHocPhan = [
    ...danhSachHocPhanHocCaiThien,
    ...danhSachHocPhanHocLai,
    ...danhSachHocPhanKyNay,
    ...danhSachHocPhanHocVuot,
  ];
  const onChangeKyHoc = async (value: number) => {
    const kyHoc: KyHoc.Record | undefined = danhSach.find(
      (item: KyHoc.Record) => item.id === value,
    );
    setRecord(kyHoc);
  };
  return (
    <Card
      loading={loadingKyHoc}
      title={
        <>
          Đăng ký tín chỉ
          <Select onChange={onChangeKyHoc} style={{ width: 205, marginLeft: 8 }} value={record?.id}>
            {danhSach?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}{' '}
              </Select.Option>
            ))}
          </Select>
        </>
      }
    >
      <Steps responsive current={current} onChange={(cur: number) => setCurrent(cur)}>
        <Step title="Bước 1: Đăng ký nhu cầu học phần" />
        <Step title="Bước 2: Đăng ký tín chỉ" />
      </Steps>
      <br />
      {current === 0 && (
        <DangKyNhuCau
          danhSachHocPhanHocCaiThien={danhSachHocPhanHocCaiThien}
          danhSachHocPhanHocLai={danhSachHocPhanHocLai}
          danhSachHocPhanHocVuot={danhSachHocPhanHocVuot}
          danhSachHocPhanKyNay={danhSachHocPhanKyNay}
          danhSachTatCaHocPhan={danhSachTatCaHocPhan}
        />
      )}
      {current === 1 && (
        <TinChi
          danhSachHocPhanHocCaiThien={danhSachHocPhanHocCaiThien}
          danhSachHocPhanHocLai={danhSachHocPhanHocLai}
          danhSachHocPhanHocVuot={danhSachHocPhanHocVuot}
          danhSachHocPhanKyNay={danhSachHocPhanKyNay}
          danhSachTatCaHocPhan={danhSachTatCaHocPhan}
        />
      )}
    </Card>
  );
};

export default DangKyTinChi;
