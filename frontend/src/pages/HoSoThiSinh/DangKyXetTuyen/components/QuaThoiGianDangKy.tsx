import img from '@/assets/success.png';
import { ETrangThaiHoSo } from '@/utils/constants';
import { Col, Result, Row } from 'antd';
import { useModel } from 'umi';

const QuaThoiGianDangKy = () => {
  const { recordHoSo } = useModel('hosoxettuyen');

  const subTitleByTrangThai = {
    'Đã khóa': 'Đã quá thời gian đăng ký, mọi thắc mắc vui lòng liên hệ với học viện.',
    'Chưa mở đăng ký': 'Chưa đến thời gian đăng ký',
  };

  return (
    <Row>
      <Col span={24}>
        <Result
          style={{ backgroundColor: 'white', paddingBottom: 20 }}
          icon={<img alt="" height="200px" src={img} />}
          title="Đã quá thời gian đăng ký"
          subTitle={
            <>
              {recordHoSo?.trangThai === ETrangThaiHoSo.khongtiepnhan
                ? 'Đã quá thời gian đăng ký'
                : subTitleByTrangThai?.[recordHoSo?.trangThai ?? '']}
            </>
          }
        />
      </Col>
    </Row>
  );
};

export default QuaThoiGianDangKy;
