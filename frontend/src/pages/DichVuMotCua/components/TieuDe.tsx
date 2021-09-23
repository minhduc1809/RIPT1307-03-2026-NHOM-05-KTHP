import { useModel } from 'umi';
import { Col, Row } from 'antd';

const TieuDe = () => {
  const { loaiPhongBan, loaiGiayTo } = useModel('dichvumotcua');
  return (
    <>
      {loaiPhongBan === 'Giáo vụ' && (
        <>
          <Row>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 650, fontSize: '20px' }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                <u>Độc lập - Tự do - Hạnh phúc</u>
              </p>
            </div>
          </Row>
          <Row>
            <p
              style={{
                textAlign: 'center',
                fontWeight: 650,
                fontSize: '22px',
                textTransform: 'uppercase',
              }}
            >
              {loaiGiayTo}
            </p>
            <p style={{ textAlign: 'center', marginTop: '-30px' }}>
              <i>
                (Sử dụng chung cho tất cả các loại Đơn/Giấy đề nghị/trình bày/thay đổi/điều chỉnh)
              </i>
            </p>
            {loaiGiayTo !== 'Đơn xin chuyển trường' && (
              <p style={{ textAlign: 'center', fontSize: '16px' }}>
                <i>
                  <u>Kính gửi:</u>
                </i>{' '}
                <b>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</b> (Đơn vị: Phòng giáo vụ)
              </p>
            )}
          </Row>
        </>
      )}
      {(loaiPhongBan === 'Trung tâm khảo thí' || loaiPhongBan === 'trungtamkhaothi') && (
        <>
          <Row>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 650, fontSize: '20px' }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                <u>Độc lập - Tự do - Hạnh phúc</u>
              </p>
            </div>
          </Row>
          <Row>
            <p
              style={{
                textAlign: 'center',
                fontWeight: 650,
                fontSize: '22px',
                textTransform: 'uppercase',
              }}
            >
              {loaiGiayTo}
            </p>
            <p style={{ textAlign: 'center', fontSize: '16px' }}>
              <i>
                <u>Kính gửi:</u>
              </i>{' '}
              <b>Trung tâm Khảo thí & Đảm bảo Chất lượng Giáo dục</b>
            </p>
          </Row>
        </>
      )}

      {(loaiPhongBan === 'Công tác chính trị sinh viên' || loaiPhongBan === 'ctctsv') && (
        <Row justify="center">
          {(loaiGiayTo === 'Yêu cầu cấp giấy xác nhận tình trạng học tập' ||
            loaiGiayTo === 'Yêu cầu cấp giấy xác nhận vay vốn sinh viên') && (
            <>
              <Col xl={12}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 450 }}>BỘ THÔNG TIN VÀ TRUYỀN THÔNG</p>
                  <p style={{ fontWeight: 'bold' }}>HỌC VIỆN CÔNG NGHỆ </p>
                  <p style={{ fontWeight: 'bold' }}>
                    <u>BƯU CHÍNH VIỄN THÔNG</u>
                  </p>
                </div>
              </Col>
              <Col xl={12}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 450 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p style={{ fontWeight: 'bold' }}>
                    <u>Độc lập - Tự do - Hạnh phúc</u>
                  </p>
                </div>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <p
                  style={{
                    textAlign: 'center',
                    fontWeight: 650,
                    fontSize: '22px',
                    textTransform: 'uppercase',
                  }}
                >
                  Giấy xác nhận
                </p>
                {loaiGiayTo === 'Yêu cầu cấp giấy xác nhận tình trạng học tập' && (
                  <>
                    <p style={{ fontSize: 16, fontWeight: 650 }}>
                      HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
                    </p>
                    <p>
                      <i style={{ fontWeight: 'bold' }}>Địa chỉ: </i>Km10, Đường Nguyễn Trãi, Mộ
                      Lao, Hà Đông, Hà Nội.
                    </p>
                    <p>
                      {' '}
                      <i style={{ fontWeight: 'bold' }}>Điện thoại: </i> 024.38547795 (Phòng Chính
                      trị & Công tác sinh viên)
                    </p>
                  </>
                )}
              </Col>
            </>
          )}

          {loaiGiayTo === 'Yêu cầu cấp giấy xác nhận hồ sơ ưu đãi giáo dục' && (
            <>
              <Row>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 650, fontSize: '20px' }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                    }}
                  >
                    <u>Độc lập - Tự do - Hạnh phúc</u>
                  </p>
                </div>
              </Row>
              <Row>
                <p
                  style={{
                    fontWeight: 650,
                    fontSize: '20px',
                    textAlign: 'center',
                  }}
                >
                  GIẤY XÁC NHẬN
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
                  {' '}
                  (Dùng cho các cơ sở giáo dục nghề nghiệp, giáo dục đại học xác nhận)
                </p>
              </Row>
            </>
          )}

          {loaiGiayTo === 'Yêu cầu cấp giấy đăng ký vé tháng xe buýt' && (
            <Row style={{ justifyContent: 'center' }}>
              <p
                style={{
                  fontWeight: 650,
                  fontSize: 20,
                  textAlign: 'center',
                  color: 'black',
                }}
              >
                MẪU ĐĂNG KÝ LÀM THẺ VÉ THÁNG XE BUÝT
              </p>
            </Row>
          )}

          {(loaiGiayTo === 'Đơn đề nghị miễn, giảm học phí' ||
            loaiGiayTo === 'Đơn đăng ký dự thi chuẩn đầu ra Tiếng Anh' ||
            loaiGiayTo === 'Đơn đề nghị thi ghép') && (
            <>
              <Row>
                <Col span={24}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 650, fontSize: '20px' }}>
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p
                      style={{
                        // marginBottom: '-15px',
                        fontWeight: 'bold',
                        fontSize: '18px',
                      }}
                    >
                      <u>Độc lập - Tự do - Hạnh phúc</u>
                    </p>
                  </div>
                </Col>
                {loaiGiayTo === 'Đơn đề nghị miễn, giảm học phí' && (
                  <Col span={24}>
                    <Row style={{ justifyContent: 'center' }}>
                      <p style={{ fontWeight: 650, fontSize: 20 }}>
                        ĐƠN ĐỀ NGHỊ MIỄN, GIẢM HỌC PHÍ
                      </p>
                    </Row>
                    <div>
                      <p style={{ fontWeight: 650, fontSize: 16 }}>Kính gửi:</p>
                      <p
                        style={{
                          fontWeight: 650,
                          fontSize: 16,
                          marginLeft: '30px',
                        }}
                      >
                        - Giám đốc Học viện Công nghệ Bưu chính Viễn thông
                      </p>
                      <p style={{ fontWeight: 650, fontSize: 16, marginLeft: '30px' }}>
                        - Trưởng phòng Chính trị & CTSV
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
              {loaiGiayTo === 'Đơn đăng ký dự thi chuẩn đầu ra Tiếng Anh' && (
                <>
                  <Row style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 650, fontSize: 20 }}>ĐƠN ĐĂNG KÝ THI LẠI</p>
                    <p style={{ fontWeight: 650, fontSize: 20, marginTop: '-30px' }}>
                      KỲ THI CHUẨN ĐẦU RA TIẾNG ANH ĐỢT 1 NĂM 2020
                    </p>
                  </Row>
                  <Row>
                    <p
                      style={{
                        textAlign: 'center',
                        fontSize: 18,
                        lineHeight: 1.6,
                      }}
                    >
                      Kính gửi: Trung tâm Khảo thí và Đảm bảo chất lượng giáo dục - Học viện <br />
                      Công nghệ Bưu chính Viễn thông
                    </p>
                  </Row>
                </>
              )}
              {loaiGiayTo === 'Đơn đề nghị thi ghép' && (
                <>
                  <Row style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 650, fontSize: 20 }}>ĐƠN ĐỀ NGHỊ THI GHÉP</p>
                  </Row>
                  <Row>
                    <p
                      style={{
                        textAlign: 'center',
                        fontSize: 18,
                      }}
                    >
                      Kính gửi: HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
                    </p>
                  </Row>
                </>
              )}
            </>
          )}

          {loaiGiayTo === 'Yêu cầu cấp giấy giới thiệu' && (
            <>
              <Row>
                <Col xl={12}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 450 }}>BỘ THÔNG TIN VÀ TRUYỀN THÔNG</p>
                    <p style={{ fontWeight: 'bold' }}>HỌC VIỆN CÔNG NGHỆ </p>
                    <p style={{ fontWeight: 'bold' }}>
                      <u>BƯU CHÍNH VIỄN THÔNG</u>
                    </p>
                  </div>
                </Col>
                <Col xl={12}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 450 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p style={{ fontWeight: 'bold' }}>
                      <u>Độc lập - Tự do - Hạnh phúc</u>
                    </p>
                  </div>
                </Col>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 650, fontSize: 20 }}>GIẤY GIỚI THIỆU</p>
                <p style={{ fontSize: 16, fontWeight: 650 }}>
                  HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
                </p>
                <p>
                  <i style={{ fontWeight: 'bold' }}>Địa chỉ: </i>Km10, Đường Nguyễn Trãi, Mộ Lao, Hà
                  Đông, Hà Nội.
                </p>
                <p>
                  {' '}
                  <i style={{ fontWeight: 'bold' }}>Điện thoại: </i> 024.38547795 (Phòng Chính trị &
                  Công tác sinh viên)
                </p>
              </Row>
            </>
          )}
        </Row>
      )}
    </>
  );
};

export default TieuDe;
