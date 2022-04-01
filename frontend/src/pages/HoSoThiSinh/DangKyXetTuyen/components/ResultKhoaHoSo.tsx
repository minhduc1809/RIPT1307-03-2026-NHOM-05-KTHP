import logo from '@/assets/logo.png';
import ThanhToan from '@/components/ThanhToan';
import { ETrangThaiHoSo, ETrangThaiThanhToan } from '@/utils/constants';
import { Button, Col, Modal, Result, Row } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import RaSoatHoSo from '../RaSoatHoSo';

const ResultHoSo = () => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const [visibleHoSo, setVisibleHoSo] = useState<boolean>(false);
  const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
  const titleByTrangThai = {
    'Đã khóa': 'Bạn đã nộp hồ sơ',
    'Đã tiếp nhận': 'Hồ sơ của bạn đã được tiếp nhận',
    'Không tiếp nhận': 'Rất tiếc, hồ sơ của bạn không đủ điều kiện tiếp nhận',
    'Chưa khóa': 'Đã kết thúc thời gian nộp hồ sơ',
  };

  const lyDoKhongTiepNhan = (
    <div style={{ textAlign: 'center' }}>
      <u style={{ color: 'black' }}>
        <b> Lý do</b>
      </u>
      : {recordHoSo?.ghiChuTiepNhan ?? ''}
      <b>
        Trong trường hợp có thắc mắc, thí sinh vui lòng liên hệ số hotline hoặc email bộ phận tuyển
        sinh để được giải đáp.
      </b>
    </div>
  );

  const subTitleByTrangThai = {
    'Đã khóa': 'Hãy đợi đến ngày công bố kết quả xét tuyển của Học viện nhé.',
    'Đã tiếp nhận': 'Vui lòng chờ các thông báo mới nhất từ Học viện',
    'Chưa khóa': 'Bạn chưa khóa hồ sơ trong thời gian cho phép',
  };

  return (
    <Row>
      <Col span={24}>
        <Result
          style={{ backgroundColor: 'white', paddingBottom: 20 }}
          icon={<img alt="" height="200px" src={logo} />}
          title={
            <div style={{ fontSize: 22 }}>
              <div>{titleByTrangThai?.[recordHoSo?.trangThai ?? ''] ?? ''}</div>
              {recordHoSo?.trangThai !== ETrangThaiHoSo.chuakhoa && (
                <div>
                  Trạng thái thanh toán: <b>{recordHoSo?.trangThaiThanhToan}</b>
                </div>
              )}
            </div>
          }
          subTitle={
            <>
              {recordHoSo?.trangThai !== ETrangThaiHoSo.chuakhoa &&
                recordHoSo?.trangThaiThanhToan === ETrangThaiThanhToan.CHUA_THANH_TOAN_DU && (
                  <div>
                    Thí sinh xem thông tin thanh toán và thực hiện thanh toán theo hướng dẫn
                  </div>
                )}
              <div>
                {recordHoSo?.trangThai === ETrangThaiHoSo.khongtiepnhan
                  ? lyDoKhongTiepNhan
                  : subTitleByTrangThai?.[recordHoSo?.trangThai ?? '']}
              </div>
            </>
          }
          extra={
            <>
              <Button
                onClick={() => {
                  setVisibleHoSo(true);
                }}
                type="primary"
                style={{ marginBottom: 8 }}
              >
                Xem hồ sơ đã nộp
              </Button>
              {recordHoSo?.trangThai !== ETrangThaiHoSo.chuakhoa && (
                <Button
                  onClick={() => {
                    setVisibleThanhToan(true);
                  }}
                  type="primary"
                  style={{ marginBottom: 8 }}
                >
                  Xem thông tin thanh toán
                </Button>
              )}
            </>
          }
        />
      </Col>
      <Modal
        footer={
          <Button
            onClick={() => {
              setVisibleHoSo(false);
            }}
          >
            OK
          </Button>
        }
        width="1200px"
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisibleHoSo(false);
        }}
        visible={visibleHoSo}
      >
        <RaSoatHoSo />
      </Modal>
      <Modal
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleThanhToan(false);
            }}
          >
            OK
          </Button>
        }
        width="1000px"
        onCancel={() => {
          setVisibleThanhToan(false);
        }}
        visible={visibleThanhToan}
      >
        <ThanhToan record={recordHoSo} />
      </Modal>
    </Row>
  );
};

export default ResultHoSo;
