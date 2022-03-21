import { Button, Card, Col, Popconfirm, Row } from 'antd';
import { useModel } from 'umi';

const XacNhanNhapHoc = () => {
  const { initialState } = useModel('@@initialState');
  const ketQua = {
    _id: 123,
    soBaoDanh: '1231241231',
    maHoSo: '13241333',
    thiSinh: {
      cmtCccd: '101249321',
    },
    nguyenVong: {
      tenNganh: 'Công nghệ thông tin',
      soThuTu: 1,
    },
    trangThaiXacNhan: false,
    trangThaiNopHoSo: false,
    trangThaiThanhToan: 'Đã thanh toán đủ',
  };
  const thongTinDotAll = {
    maHeThongDot: 'THPT',
    tenDotTuyenSinh: 'Đợt 1',
  };

  return (
    <Card
      size="small"
      title="Kết quả xét tuyển"
      headStyle={{ backgroundColor: '#CC0D00', color: 'white', fontWeight: '700' }}
      style={{ fontSize: '17px' }}
    >
      <p>
        <b>Hội đồng tuyển sinh - Học viện Công nghệ Bưu chính Viễn thông thông báo và chúc mừng:</b>
      </p>
      <Row>
        <Col xl={8} sm={12} xs={24}>
          Thí sinh: <b>{initialState?.currentUser?.ten ?? ''}</b>
        </Col>
        <Col xl={8} sm={12} xs={24}>
          {/* Ngày sinh: <b>{initialState?.currentUser?.ngay_sinh?.split('-')?.reverse()?.join('-')}</b> */}
        </Col>
        {thongTinDotAll?.maHeThongDot?.startsWith('THPT') && (
          <Col xl={8} sm={12} xs={24}>
            Số báo danh: <b>{ketQua?.soBaoDanh ?? ''}</b>
          </Col>
        )}
        <Col xl={8} sm={12} xs={24}>
          Mã hồ sơ: <b>{ketQua?.maHoSo ?? ''}</b>
        </Col>

        <Col xl={8} sm={12} xs={24}>
          Số CCCD/CMND: <b>{ketQua?.thiSinh?.cmtCccd ?? ''}</b>
        </Col>
      </Row>
      <br />
      <div>
        Thí sinh đã đạt ngưỡng điểm trúng tuyển vào đại học hệ chính quy theo phương thức xét tuyển
        kết hợp năm {new Date().getFullYear()}, cụ thể như sau:
      </div>

      <div>
        <div>
          - Ngành: <b>{ketQua?.nguyenVong?.tenNganh}-CNTT</b>{' '}
        </div>
        <div>
          - Thứ tự nguyện vọng trúng tuyển: <b>{ketQua?.nguyenVong?.soThuTu}</b>{' '}
        </div>
      </div>
      <div>
        Thí sinh phải thực hiện xác nhận nhập học để được công nhận trúng tuyển chính thức trong
        thời gian từ ... đến ...
      </div>
      <br />
      {ketQua?.trangThaiXacNhan && (
        <div>
          {/* <div style={{ color: 'red' }}>
            {ketQua?.trangThaiXacNhan === 'Xác nhận'
              ? 'Thí sinh cần làm thủ tục cam kết xác nhận nhập học như sau:'
              : 'Thí sinh đã không xác nhận nhập học. Chúng tôi hy vọng sẽ được gặp lại Bạn vào một ngày gần đây tại Học viện Chính sách và Phát triển.'}
          </div> */}
          {/* {ketQua?.trangThaiXacNhan === 'Xác nhận' && (
            <div>
              <div>
                {ketQua?.trangThaiNopHoSo ? (
                  <span style={{ color: '#0065CA' }}>
                    - Thí sinh đã nộp bản cam kết nhập học về Học viện.
                  </span>
                ) : (
                  <>
                    - Nộp bản cam kết nhập học (Tải xuống tại{' '}
                    <a>
                      <b>đây</b>
                    </a>
                    ) về Học viện từ ngày 13/7/2021 – 17h00 20/7/2021 theo địa chỉ: Phòng Quản lý
                    Đào tạo, Học viện Chính sách và Phát triển, Khu đô thị Nam An Khánh, Xã An
                    Thượng, Huyện Hoài Đức, Thành phố Hà Nội.
                  </>
                )}

                {ketQua?.trangThaiThanhToan === 'Đã thanh toán đủ' ? (
                  <>
                    <div style={{ color: '#0065CA' }}>- Thí sinh đã nộp đủ lệ phí ghi danh.</div>
                  </>
                ) : (
                  <>
                    <br />- Nộp phí ghi danh, số tiền 500.000 đồng (Năm trăm nghìn đồng chẵn).
                    <br />
                    <b>
                      {' '}
                      <u>Hướng dẫn thanh toán: </u>
                    </b>
                    <br />
                    Thí sinh có thể nộp lệ phí qua 2 hình thức:
                    <br />
                    <b>1. Chuyển khoản trực tiếp:</b>
                    <br />
                    Chủ tài khoản: Học viện Chính sách và Phát triển
                    <br />
                    Số tài khoản: 22010007286868, Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV),
                    chi nhánh Thăng Long
                    <br />
                    Cú pháp: họ và tên_ CCCD/CMT_Mã hồ sơ (Ví dụ: Nguyen Van A_0123456_D02120005)
                    <br />
                    <b>2. Thanh toán bằng mã định danh:</b>
                    <div>
                      Thí sinh có thể xem chi tiết Hướng dẫn thanh toán bằng mã tài khoản định danh
                      tại{' '}
                      <a
                      // onClick={() => {
                      //   window.open(
                      //     'https://dkxt.apd.edu.vn/server/data/fileUpload-1626270203271-hd_thanh_to_n_bang_ma_tk_dinh_danh.pdf',
                      //     '_blank'
                      //   );
                      // }}
                      >
                        <b>đây</b>
                      </a>{' '}
                    </div>
                    <div>
                      Nếu phụ huynh/thí sinh có tài khoản BIDV thì mã thanh toán là:{' '}
                      <b>{hoaDon?.identityCode ?? ''}</b>
                    </div>
                    <div>
                      Nếu phụ huynh/thí sinh có tài khoản tại ngân hàng khác, số tài khoản định danh
                      của thí sinh là: <b>{hoaDon?.identityCode ?? ''}</b>
                    </div>
                    <div>
                      <b>{hoaDon?.identityCode ?? ''}</b> : chính là mã định danh của thí sinh để
                      thanh toán trên hệ thống
                    </div>
                  </>
                )}
                {(ketQua?.trangThaiThanhToan !== 'Đã thanh toán đủ' ||
                  ketQua?.trangThaiNopHoSo !== true) && (
                  <>
                    <b>Lưu ý:</b> Thí sinh không nộp các giấy tờ cam kết nhập học theo trình tự các
                    bước và thời gian quy định như trên sẽ bị huỷ kết quả xét tuyển đại học hệ chính
                    quy theo phương thức dựa trên kết quả học tập THPT Đợt 2 năm 2021.
                  </>
                )}
              </div>
            </div>
          )} */}
        </div>
      )}
      {!ketQua?.trangThaiXacNhan && (
        <>
          {
            <div style={{ textAlign: 'center', fontSize: '17px' }}>
              <Popconfirm
                disabled={ketQua?.trangThaiXacNhan}
                title={
                  <div>
                    Bạn có chắc chắn xác nhận nhập học không?
                    <br />
                    Sau khi Đồng ý sẽ không thể thay đổi kết quả xác nhận!
                  </div>
                }
                // onConfirm={() => this.xacNhanNhapHoc(ketQua?._id, 'Xác nhận')}
              >
                <Button
                  style={{ marginRight: 8, fontSize: '16px' }}
                  disabled={ketQua?.trangThaiXacNhan}
                  type="primary"
                >
                  Xác nhận nhập học
                </Button>
              </Popconfirm>

              <Popconfirm
                disabled={ketQua?.trangThaiXacNhan}
                // onConfirm={() => this.xacNhanNhapHoc(ketQua?._id, 'Không xác nhận')}
                title={
                  <div>
                    Bạn có chắc chắn xác nhận không nhập học không?
                    <br />
                    Sau khi Đồng ý sẽ không thể thay đổi kết quả xác nhận!
                  </div>
                }
              >
                <Button
                  disabled={ketQua?.trangThaiXacNhan}
                  style={{ marginRight: 8, fontSize: '16px' }}
                >
                  Không xác nhận nhập học
                </Button>
              </Popconfirm>
            </div>
          }
        </>
      )}
    </Card>
  );
};

export default XacNhanNhapHoc;
