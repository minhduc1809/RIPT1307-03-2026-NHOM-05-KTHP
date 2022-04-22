import FilterDotTuyenSinh from '@/components/FilterDotTuyenSinh';
import {
  getSoLuongHoSoByIdDot,
  getSoLuongHoSoTheoNgayByIdDot,
  getSoLuongNguyenVongByIdDot,
} from '@/services/Dashboard/dashboard';
import { ArrowUpOutlined } from '@ant-design/icons/lib/icons';
import { Badge, Card, Col, Row, Statistic } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BlockNguyenVong from './components/BlockNguyenVong';
import BlockSoLuongHoSo from './components/BlockSoLuongHoSo';

const Dashboard = () => {
  const arrColor = ['orange', 'blue', 'green', 'red'];

  const [recordTongSoLuongHoSo, setRecordTongSoLuongHoSo] = useState<any>({});
  const [recordSoLuongNguyenVong, setRecordSoLuongNguyenVong] = useState<any>({});
  const { record } = useModel('dottuyensinh');
  const [soLuongHoSoTheoNgay, setSoLuongHoSoTheoNgay] = useState<number>(0);

  const getTongSoLuongHoSo = async () => {
    if (record?._id) {
      const response = await getSoLuongHoSoByIdDot(record?._id);
      setRecordTongSoLuongHoSo(response?.data?.data ?? {});
    }
  };

  const getSoLuongNguyenVong = async (groupBy: 'coSo' | 'nganh' | 'doiTuong' | 'phuongThuc') => {
    if (record?._id) {
      const response = await getSoLuongNguyenVongByIdDot(record?._id, { groupBy });
      setRecordSoLuongNguyenVong(response?.data?.data ?? {});
    }
  };

  const getSoLuongHoSoTheoNgay = async (ngayThongKe: string) => {
    if (record?._id) {
      const response = await getSoLuongHoSoTheoNgayByIdDot(record?._id, {
        ngayThongKe,
      });
      setSoLuongHoSoTheoNgay(response?.data?.data ?? 0);
    }
  };

  useEffect(() => {
    getSoLuongNguyenVong('coSo');
    getTongSoLuongHoSo();
    getSoLuongHoSoTheoNgay(moment().format('YYYY-MM-DD'));
  }, [record?._id]);

  const tongSoLuongHoSo = Object?.values(recordTongSoLuongHoSo)
    ?.filter((item) => typeof item === 'number')
    ?.map((item: any) => item)
    ?.reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }, 0);

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <FilterDotTuyenSinh />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 16 }}>Tổng số lượng hồ sơ</div>}
              value={tongSoLuongHoSo}
            />
            <br />
            <br />
            <br />
            <div>
              <ArrowUpOutlined /> Tăng {tongSoLuongHoSo - soLuongHoSoTheoNgay} hồ sơ
              {/* {(((tongSoLuongHoSo - soLuongHoSoTheoNgay) / soLuongHoSoTheoNgay) * 100).toFixed(2)}%) */}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <BlockSoLuongHoSo title="Phân loại hồ sơ" recordSoLuongHoSo={recordTongSoLuongHoSo} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic
              title={<div style={{ fontSize: 16 }}>Số lượng hồ sơ hôm nay</div>}
              value={soLuongHoSoTheoNgay}
            />
            <br />
            <br />
            <br />
            <br />
          </Card>
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
        <Col md={24} lg={24}>
          <BlockNguyenVong title="Số lượng nguyện vọng đăng ký theo ngành" groupBy="nganh" />
        </Col>
        <Col md={24} lg={24}>
          <BlockNguyenVong title="Số lượng nguyện vọng đăng ký theo đối tượng" groupBy="doiTuong" />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
