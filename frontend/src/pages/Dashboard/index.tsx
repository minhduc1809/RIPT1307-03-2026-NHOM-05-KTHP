import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import { getSoLuongHoSoByIdDot, getSoLuongNguyenVongByIdDot } from '@/services/Dashboard/dashboard';
import { Badge, Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BlockNguyenVong from './components/BlockNguyenVong';
import BlockSoLuongHoSo from './components/BlockSoLuongHoSo';

const Dashboard = () => {
  const arrColor = ['orange', 'blue', 'green', 'red'];

  const [recordTongSoLuongHoSo, setRecordTongSoLuongHoSo] = useState<any>({});
  const [recordSoLuongHoSoHomNay, setRecordSoLuongHoSoHomNay] = useState<any>({});
  const [recordSoLuongNguyenVong, setRecordSoLuongNguyenVong] = useState<any>({});
  const { record } = useModel('dottuyensinh');

  const getTongSoLuongHoSo = async () => {
    if (record?._id) {
      const response = await getSoLuongHoSoByIdDot(record?._id);
      setRecordTongSoLuongHoSo(response?.data?.data ?? {});
    }
  };

  const getSoLuongHoSoHomNay = async () => {
    if (record?._id) {
      const response = await getSoLuongHoSoByIdDot(record?._id, { today: 1 });
      setRecordSoLuongHoSoHomNay(response?.data?.data ?? {});
    }
  };

  const getSoLuongNguyenVong = async (groupBy: 'coSo' | 'nganh' | 'doiTuong' | 'phuongThuc') => {
    if (record?._id) {
      const response = await getSoLuongNguyenVongByIdDot(record?._id, { groupBy });
      setRecordSoLuongNguyenVong(response?.data?.data ?? {});
    }
  };

  useEffect(() => {
    getSoLuongNguyenVong('coSo');
    getTongSoLuongHoSo();
    getSoLuongHoSoHomNay();
  }, [record?._id]);

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <FilterDotTuyenSinh />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <BlockSoLuongHoSo title="Tổng Số Lượng Hồ Sơ" recordSoLuongHoSo={recordTongSoLuongHoSo} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 16 }}>Số Lượng Hồ Sơ Đã Tiếp Nhận</div>}
              value={0}
            />
            <br />
            <br />
            <br />
            <Badge color="orange" />
            Dữ liệu đang cập nhật: {0}
            <br />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <BlockSoLuongHoSo
            title="Số Lượng Hồ Sơ Hôm Nay"
            recordSoLuongHoSo={recordSoLuongHoSoHomNay}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 16 }}>Số Nguyện Vọng CSĐT</div>}
              value={Object?.values(recordSoLuongNguyenVong)
                ?.filter((item) => typeof item === 'number')
                ?.map((item: any) => item)
                ?.reduce((previousValue, currentValue) => {
                  return previousValue + currentValue;
                }, 0)}
            />
            {Array.from({ length: 4 - Object.keys(recordSoLuongNguyenVong)?.length ?? 0 }).map(
              () => (
                <br />
              ),
            )}
            {Object.keys(recordSoLuongNguyenVong)
              ?.filter((item) => item !== '_id')
              ?.map((item, index) => (
                <>
                  <Badge color={arrColor[index]} />
                  {item}: {recordSoLuongNguyenVong?.[item] ?? 0}
                  <br />
                </>
              ))}
          </Card>
        </Col>
        <Col span={24}>
          <BlockNguyenVong />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
