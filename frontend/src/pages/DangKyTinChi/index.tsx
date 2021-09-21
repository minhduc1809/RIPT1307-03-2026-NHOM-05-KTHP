import { Card, Select, Steps } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DangKyNhuCau from './components/DangKyNhuCau';

const DangKyTinChi = () => {
  const { Step } = Steps;

  const {
    getAllKyHocModel,
    danhSach,
    record,
    setRecord,
    loading: loadingKyHoc,
  } = useModel('kyhoc');
  const {
    getDotDangKyByKyHocModel,
    recordDot,
    getPhieuDangKyByDotModel,
    getDanhSachHocPhanDangKyModel,
    getThongTinKyHocModel,
    current,
    setCurrent,
  } = useModel('dangkytinchi');

  useEffect(() => {
    getAllKyHocModel();
    getDanhSachHocPhanDangKyModel();
  }, []);

  useEffect(() => {
    getDotDangKyByKyHocModel(record?.id);
    getThongTinKyHocModel(record?.id);
  }, [record?.id]);

  useEffect(() => {
    getPhieuDangKyByDotModel();
  }, [recordDot?.id]);

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
      {current === 0 && <DangKyNhuCau />}
      {current === 1 && <div>Chức năng đang phát triển</div>}
    </Card>
  );
};

export default DangKyTinChi;
