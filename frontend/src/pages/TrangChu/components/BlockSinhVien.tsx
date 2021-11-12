import { thongKeDon } from '@/services/DichVuMotCuaV2/dichvumotcuav2';
import { ArrowUpOutlined } from '@ant-design/icons';

import { Col, Card, Statistic, Badge, Progress } from 'antd';
import { useEffect, useState } from 'react';

const BlockSinhVien = () => {
  const [dataThongKe, setDataThongKe] =
    useState<{ tong: number; daDuyet: number; khongDuyet: number }>();
  useEffect(() => {
    const getThongKeDon = async () => {
      const res = await thongKeDon();
      setDataThongKe(res?.data?.data ?? {});
    };
    getThongKeDon();
  }, []);

  return (
    <>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic title={<div style={{ fontSize: 16 }}>GPA</div>} value="Đang cập nhật" />
          <br />
          <div>
            <ArrowUpOutlined /> Kỳ gần nhất
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Tổng số tín chỉ tích lũy</div>}
            value={'Chưa có dữ liệu'}
          />
          <br />
          <Progress percent={30} size="small" />
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Xếp hạng sinh viên</div>}
            value={'Đang cập nhật'}
          />
          <br />
          <div>...</div>
        </Card>
      </Col>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title={<div style={{ fontSize: 16 }}>Dịch vụ sử dụng</div>}
            value={`${dataThongKe?.tong ?? 0}`}
          />
          <Badge color="green" text={`Đã duyệt: ${dataThongKe?.daDuyet}`} />
          <br />
          <Badge color="red" text={`Không duyệt: ${dataThongKe?.khongDuyet}`} />
        </Card>
      </Col>
    </>
  );
};

export default BlockSinhVien;
