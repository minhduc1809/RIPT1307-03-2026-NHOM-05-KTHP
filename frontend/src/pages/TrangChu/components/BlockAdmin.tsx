// import DemoPie from '@/components/Chart/Pie';
import {
  thongKeDonVi,
  thongKeNhanSu,
  thongKePhanHoi,
  thongKeThongBao,
} from '@/services/Dashboard/dashboard';
import { Badge, Card, Col, Statistic, Tag } from 'antd';
import { useEffect, useState } from 'react';
import Table from '@/components/Table/Table';
import { useModel } from 'umi';

type ThongKeDonVi = {
  tenDonVi: string;
  maDonVi: string;
  soLuongNhanVien: number;
  soLuongSinhVien: number;
};

const BlockAdmin = () => {
  const [dataThongKeNhanSu, setDataThongKeNhanSu] = useState<{
    soLuongNhanVien: number;
    soLuongSinhVien: number;
  }>({ soLuongNhanVien: 0, soLuongSinhVien: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [dataThongKeDonVi, setDataThongKeDonVi] = useState<ThongKeDonVi[]>([]);
  const [dataThongKeThongBao, setDataThongKeThongBao] = useState<{
    totalThongBao: number;
    totalThongBaoHeThong: number;
  }>({ totalThongBao: 0, totalThongBaoHeThong: 0 });

  const [dataThongKePhanHoi, setDataThongKePhanHoi] = useState<{
    totalPhanHoi: number;
    daTraLoi: number;
  }>({ totalPhanHoi: 0, daTraLoi: 0 });

  const { adminGetTongSoDonDVMCModel, idDichVu, recordTongSoDon } = useModel('dashboard');

  useEffect(() => {
    adminGetTongSoDonDVMCModel();
  }, [idDichVu]);

  const getThongKeDonVi = async () => {
    setLoading(true);
    const resNhanSu = await thongKeNhanSu();
    setDataThongKeNhanSu(resNhanSu?.data?.data ?? {});
    const resDonVi = await thongKeDonVi();
    setDataThongKeDonVi(resDonVi?.data?.data ?? []);
    let sumGV = 0;
    let sumSV = 0;
    resDonVi?.data?.data?.forEach((item: ThongKeDonVi) => {
      sumGV += item.soLuongNhanVien;
      sumSV += item.soLuongSinhVien;
    });

    setDataThongKeDonVi([
      ...(resDonVi?.data?.data ?? []),
      {
        tenDonVi: 'Chưa xác định',
        maDonVi: 'Chưa xác định',
        soLuongNhanVien: resNhanSu?.data?.data?.soLuongNhanVien - sumGV,
        soLuongSinhVien: resNhanSu?.data?.data?.soLuongSinhVien - sumSV,
      },
    ]);
    setLoading(false);
  };

  const getThongKeThongBao = async () => {
    const res = await thongKeThongBao();
    setDataThongKeThongBao(res?.data?.data);
  };

  const getThongKePhanHoi = async () => {
    const res = await thongKePhanHoi();
    setDataThongKePhanHoi(res?.data?.data);
  };

  useEffect(() => {
    getThongKePhanHoi();
    getThongKeThongBao();
    getThongKeDonVi();
  }, []);

  return (
    <>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Tổng số tài khoản</div>}
            value={
              dataThongKeNhanSu?.soLuongNhanVien ?? 0 + dataThongKeNhanSu?.soLuongSinhVien ?? 0
            }
          />
          <Badge color="blue" />
          Cán bộ/Giảng viên: {dataThongKeNhanSu?.soLuongNhanVien}
          <br />
          <Badge color="red" />
          Sinh viên: {dataThongKeNhanSu?.soLuongSinhVien}
          <br />
          <br />
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Số lượng thông báo</div>}
            value={dataThongKeThongBao?.totalThongBao ?? 0}
          />
          <Badge color="blue" />
          TB hệ thống: {dataThongKeThongBao?.totalThongBaoHeThong ?? 0}
          <br />
          <Badge color="red" />
          TB từ người dùng:{' '}
          {dataThongKeThongBao?.totalThongBao - dataThongKeThongBao?.totalThongBaoHeThong} <br />
          <br />
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Số lượng phản hồi</div>}
            value={dataThongKePhanHoi?.totalPhanHoi ?? 0}
          />
          <Badge color="blue" />
          Đã trả lời: {dataThongKePhanHoi?.daTraLoi ?? 0}
          <br />
          <Badge color="red" />
          Chưa trả lời: {dataThongKePhanHoi?.totalPhanHoi - dataThongKePhanHoi?.daTraLoi}
          <br />
          <br />
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Số lượng đơn DVMC</div>}
            value={recordTongSoDon?.reduce((previousValue, currentValue) => {
              return previousValue + currentValue?.soLuong;
            }, 0)}
          />
          <Badge color="blue" />
          Đang xử lý:{' '}
          {recordTongSoDon?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0}
          <br />
          <Badge color="green" />
          Đã duyệt: {recordTongSoDon?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0}
          <br />
          <Badge color="red" />
          Không duyệt: {recordTongSoDon?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0}
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card
          loading={loading}
          bodyStyle={{ padding: 0 }}
          title="Thống kê cán bộ/giảng viên theo đơn vị"
        >
          {/* <DemoPie
            height={350}
            hideLegend
            labelTotal={''}
            hideLabel
            data={dataThongKeDonVi?.map((item) => ({
              x: item?.tenDonVi || 'Đang cập nhật',
              y: item.soLuongNhanVien,
            }))}
          /> */}
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card loading={loading} bodyStyle={{ padding: 0 }} title="Thống kê sinh viên theo đơn vị">
          {/* <DemoPie
            height={350}
            hideLegend
            labelTotal={''}
            hideLabel
            data={dataThongKeDonVi?.map((item) => ({
              x: item?.tenDonVi || 'Đang cập nhật',
              y: item.soLuongSinhVien,
            }))}
          /> */}
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <Table
            columns={[
              {
                title: 'STT',
                dataIndex: 'index',
                align: 'center',
                width: 80,
              },
              {
                title: 'Tên đơn vị',
                dataIndex: 'tenDonVi',
                align: 'center',
                width: 200,
                search: 'search',
              },
              {
                title: 'Mã đơn vị',
                dataIndex: '_id',
                align: 'center',
                width: 200,
                search: 'search',
                render: (val: string) => <Tag color="green">{val}</Tag>,
              },
              {
                title: 'Số Cán bộ/Giảng viên',
                dataIndex: 'soLuongNhanVien',
                align: 'center',
                width: 200,
              },
              {
                title: 'Số sinh viên',
                dataIndex: 'soLuongSinhVien',
                align: 'center',
                width: 200,
              },
            ]}
            data={dataThongKeDonVi?.map((item, index) => ({ ...item, index: index + 1 }))}
          />
        </Card>
      </Col>
    </>
  );
};

export default BlockAdmin;
