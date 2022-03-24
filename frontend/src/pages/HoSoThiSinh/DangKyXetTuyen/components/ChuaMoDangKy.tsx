import img from '@/assets/success.png';
import { ETrangThaiHoSo } from '@/utils/constants';
import { Col, Result, Row } from 'antd';
import { useModel } from 'umi';

const ChuaMoDangKy = () => {
  const { recordHoSo } = useModel('hosoxettuyen');

  const subTitleByTrangThai = {
    'Chưa mở đăng ký': 'Chưa đến thời gian đăng ký',
    'Đã khóa': 'Hãy đợi đến ngày đăng ký của học viện nhé.',
  };

  return (
    <Row>
      <Col span={24}>
        <Result
          style={{ backgroundColor: 'white', paddingBottom: 20 }}
          icon={<img alt="" height="200px" src={img} />}
          title="Chưa đến thời gian đăng ký"
          subTitle={
            <>
              {recordHoSo?.trangThai === ETrangThaiHoSo.khongtiepnhan
                ? 'Chưa đến thời gian đăng ký'
                : subTitleByTrangThai?.[recordHoSo?.trangThai ?? '']}
            </>
          }
        />
      </Col>
    </Row>
  );
};

export default ChuaMoDangKy;
