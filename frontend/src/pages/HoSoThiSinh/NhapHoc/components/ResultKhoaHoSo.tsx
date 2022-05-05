import logo from '@/assets/logo.png';
import ThanhToan from '@/components/ThanhToan';
import { ETrangThaiNhapHoc } from '@/utils/constants';
import { Button, Col, Modal, Popconfirm, Result, Row } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import RaSoatHoSo from '../RaSoatHoSo';

const ResultHoSoNhapHoc = () => {
  const { moKhoaMyHoSoModel, exportMyPhieuDangKyModel, loading } = useModel('hosoxettuyen');
  const { record: recordHoSo } = useModel('ketquaxettuyen');
  const { record } = useModel('dottuyensinh');
  const [visibleHoSo, setVisibleHoSo] = useState<boolean>(false);
  const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
  const lyDoYeuCauChinhSua = (
    <div style={{ textAlign: 'center' }}>
      <u style={{ color: 'black' }}>
        <b> Lý do</b>
      </u>
      : {recordHoSo?.ghiChuTiepNhan ?? ''}
      <br />
      <div style={{ fontSize: 14, color: '#00000073' }}>
        Trong trường hợp có thắc mắc, thí sinh vui lòng liên hệ số hotline hoặc email bộ phận tuyển
        sinh để được giải đáp.
      </div>
    </div>
  );

  const titleDaKhoa = (
    <div>
      <div>Thí sinh đã hoàn thành thủ tục nhập học.</div>
      <div>Học viện sẽ có thông báo tiếp theo sau khi xác minh hồ sơ của thí sinh</div>
    </div>
  );

  const titleDaTiepNhan = <div>Hồ sơ nhập học của thí sinh đã được tiếp nhận.</div>;

  const titleYeuCauChinhSua = (
    <div>
      <div>Hồ sơ nhập học của thí sinh được yêu cầu chỉnh sửa lại.</div>
      <div>{lyDoYeuCauChinhSua}</div>
    </div>
  );

  const titleByTrangThai = {
    'Đã khóa': {
      'Đã thanh toán đủ': titleDaKhoa,
      'Thanh toán thừa': titleDaKhoa,
      'Chưa thanh toán đủ': (
        <div>
          <div>Thí sinh đã khóa hồ sơ</div>
        </div>
      ),
    },
    'Đã tiếp nhận': titleDaTiepNhan,
    'Không tiếp nhận': titleYeuCauChinhSua,
    'Chưa khóa': 'Đã kết thúc thời gian nộp hồ sơ',
  };

  const isKetThucThoiGianDangKy = moment(record?.thoiGianKetThucNopHoSo).isBefore();

  const subTitleByTrangThai = {
    'Đã khóa': {
      'Chưa thanh toán đủ': (
        <div>
          <div>Thí sinh xem thông tin thanh toán và thực hiện thanh toán theo hướng dẫn</div>
        </div>
      ),
    },
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
              <div>
                {recordHoSo?.trangThaiNhapHoc === ETrangThaiNhapHoc.DA_KHOA
                  ? titleByTrangThai?.[recordHoSo?.trangThai ?? '']?.[
                      recordHoSo?.trangThaiThanhToan ?? ''
                    ]
                  : titleByTrangThai?.[recordHoSo?.trangThai ?? ''] ?? ''}
              </div>
              {recordHoSo?.trangThaiNhapHoc !== ETrangThaiNhapHoc.CHUA_KHOA && (
                <div>
                  Trạng thái thanh toán: <b>{recordHoSo?.trangThaiThanhToan}</b>
                </div>
              )}
            </div>
          }
          subTitle={
            subTitleByTrangThai?.[recordHoSo?.trangThai ?? '']?.[
              recordHoSo?.trangThaiThanhToan ?? ''
            ]
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
              {recordHoSo?.trangThaiNhapHoc !== ETrangThaiNhapHoc.CHUA_KHOA && (
                <Button
                  loading={loading}
                  onClick={() => {
                    exportMyPhieuDangKyModel(recordHoSo?._id ?? '');
                  }}
                >
                  In phiếu
                </Button>
              )}
              {recordHoSo?.trangThaiNhapHoc === ETrangThaiNhapHoc.DA_KHOA &&
                !isKetThucThoiGianDangKy &&
                record?.choPhepThiSinhMoKhoa === true && (
                  <Popconfirm
                    onConfirm={() => {
                      moKhoaMyHoSoModel(recordHoSo?._id);
                    }}
                    title="Bạn có chắc chắn muốn mở khóa hồ sơ?"
                  >
                    <Button type="primary" style={{ marginBottom: 8 }}>
                      Mở khóa hồ sơ
                    </Button>
                  </Popconfirm>
                )}
              {recordHoSo?.trangThaiNhapHoc !== ETrangThaiNhapHoc.CHUA_KHOA && (
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
        <ThanhToan
          record={{
            identityCode: recordHoSo?.identityCode ?? '',
            trangThaiThanhToan: recordHoSo?.trangThaiThanhToan,
          }}
        />
      </Modal>
    </Row>
  );
};

export default ResultHoSoNhapHoc;
