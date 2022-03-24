import logo from '@/assets/logo.png';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Popconfirm, Row } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const TrungTuyen = () => {
  const { record, xacNhanNhapHocModel } = useModel('ketquaxettuyen');
  const { record: recordDot } = useModel('dottuyensinh');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <Card
        hoverable
        title="Kết quả xét tuyển"
        headStyle={{ fontWeight: '700' }}
        style={{ fontSize: '17px', width: 800 }}
      >
        <p>
          <b>
            Hội đồng tuyển sinh - Học viện Công nghệ Bưu chính Viễn thông thông báo và chúc mừng:
          </b>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img style={{ height: 150, width: 120 }} src={logo} />
        </div>
        <br />

        <Row>
          <Col xl={12} sm={12} xs={24}>
            Thí sinh:{' '}
            <b>
              {record?.thongTinThiSinh?.hoDem} {record?.thongTinThiSinh?.ten}
            </b>
          </Col>
          <Col xl={12} sm={12} xs={24}>
            Ngày sinh:{' '}
            <b>
              {record?.thongTinThiSinh?.ngaySinh
                ? moment(record?.thongTinThiSinh?.ngaySinh).format('DD/MM/YYYY')
                : ''}
            </b>
          </Col>

          <Col xl={12} sm={12} xs={24}>
            Mã hồ sơ: <b>{record?.maHoSo}</b>
          </Col>

          <Col xl={12} sm={12} xs={24}>
            Số CCCD/CMND: <b>{record?.thongTinThiSinh?.cmtCccd}</b>
          </Col>
        </Row>
        <br />
        <div>
          Thí sinh đã đạt ngưỡng điểm trúng tuyển vào đại học hệ chính quy theo phương thức{' '}
          {recordDot?.phuongThucTuyenSinh?.tenPhuongThuc} năm {recordDot?.namTuyenSinh}, cụ thể như
          sau:
        </div>

        <div>
          <div>
            - Ngành: <b>{record?.nguyenVongTrungTuyen?.tenNganhChuyenNganh}</b>{' '}
          </div>
          <div>
            - Mã ngành: <b>{record?.nguyenVongTrungTuyen?.maNganhChuyenNganh}</b>{' '}
          </div>
          <div>
            - Cơ sở đào tạo: <b>{record?.nguyenVongTrungTuyen?.tenCoSoDaoTao}</b>{' '}
          </div>
          <div>
            - Thứ tự nguyện vọng trúng tuyển: <b>{record?.nguyenVongTrungTuyen?.soThuTu}</b>{' '}
          </div>
        </div>
        <div>
          Thí sinh phải thực hiện xác nhận nhập học để được công nhận trúng tuyển chính thức trong
          thời gian từ{' '}
          <b>{moment(recordDot?.thoiGianBatDauXacNhanNhapHoc).format('HH:mm DD/MM/YYYY')}</b> đến{' '}
          <b>{moment(recordDot?.thoiGianKetThucXacNhanNhapHoc).format('HH:mm DD/MM/YYYY')}</b>
        </div>
        <br />

        {record?.thongTinXacNhanNhapHoc?.trangThaiXacNhan ===
          ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN && (
          <>
            {
              <div style={{ textAlign: 'center', fontSize: '17px' }}>
                <Popconfirm
                  title={
                    <div>
                      Bạn có chắc chắn xác nhận nhập học không?
                      <br />
                      Sau khi Đồng ý sẽ không thể thay đổi kết quả xác nhận!
                    </div>
                  }
                  onConfirm={() => xacNhanNhapHocModel('xac-nhan', record?._id ?? '')}
                >
                  <Button icon={<CheckOutlined />} style={{ marginRight: 8 }} type="primary">
                    Xác nhận nhập học
                  </Button>
                </Popconfirm>

                <Popconfirm
                  onConfirm={() => xacNhanNhapHocModel('khong-xac-nhan', record?._id ?? '')}
                  title={
                    <div>
                      Bạn có chắc chắn xác nhận không nhập học không?
                      <br />
                      Sau khi Đồng ý sẽ không thể thay đổi kết quả xác nhận!
                    </div>
                  }
                >
                  <Button icon={<CloseOutlined />} style={{ marginRight: 8 }}>
                    Không xác nhận nhập học
                  </Button>
                </Popconfirm>
              </div>
            }
          </>
        )}
        {record?.thongTinXacNhanNhapHoc?.trangThaiXacNhan === ETrangThaiXacNhanNhapHoc.XAC_NHAN && (
          <b style={{ color: 'red' }}>Bạn đã xác nhận nhập học</b>
        )}
        {record?.thongTinXacNhanNhapHoc?.trangThaiXacNhan ===
          ETrangThaiXacNhanNhapHoc.KHONG_XAC_NHAN && (
          <b style={{ color: 'red' }}>Bạn đã xác nhận không nhập học</b>
        )}
      </Card>
    </div>
  );
};

export default TrungTuyen;
