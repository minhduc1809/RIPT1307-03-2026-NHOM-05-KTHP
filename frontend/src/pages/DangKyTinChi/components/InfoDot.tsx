import { Row, Col, Tag, Statistic } from 'antd';
import moment from 'moment';

const { Countdown } = Statistic;

const InfoDot = (props: { ngayBatDau: string; ngayKetThuc: string }) => {
  const now = Date.now();
  const diffTime = moment(new Date(props.ngayKetThuc ?? now)).diff(now);
  const deadline = now + diffTime ?? 0;

  let colorDot = 'orange';
  let textTrangThai = 'Đang diễn ra';
  if (moment(new Date()).isBefore(moment(props.ngayBatDau))) {
    textTrangThai = 'Chưa diễn ra';
    colorDot = 'green';
  } else if (moment(new Date()).isAfter(moment(props.ngayKetThuc))) {
    textTrangThai = 'Đã diễn ra';
    colorDot = 'blue';
  }

  return (
    <Row gutter={[8, 0]}>
      <Col xs={24} xl={12}>
        Thời gian bắt đầu: {moment(props.ngayBatDau).format('HH:mm DD/MM/YYYY')}
      </Col>
      <Col xs={24} xl={12}>
        Thời gian kết thúc: {moment(props.ngayKetThuc).format('HH:mm DD/MM/YYYY')}
      </Col>
      <Col xs={24} xl={12}>
        <div style={{ display: 'flex' }}>
          Thời gian còn lại:
          <Countdown
            value={deadline}
            valueStyle={{ fontSize: 14, marginLeft: 4 }}
            format="D ngày H giờ m phút s giây"
          />
        </div>
      </Col>
      <Col xs={24} xl={6}>
        Trạng thái: <Tag color={colorDot}>{textTrangThai}</Tag>
      </Col>
    </Row>
  );
};

export default InfoDot;
