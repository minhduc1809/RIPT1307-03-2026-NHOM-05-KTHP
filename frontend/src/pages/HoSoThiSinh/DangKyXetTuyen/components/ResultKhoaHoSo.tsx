import logo from '@/assets/logo.png';
import ThanhToan from '@/components/ThanhToan';
import { ETrangThaiHoSo, ETrangThaiThanhToan } from '@/utils/constants';
import { Button, Col, Modal, Popconfirm, Result, Row } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import RaSoatHoSo from '../RaSoatHoSo';

const ResultHoSo = () => {
  const { recordHoSo, moKhoaMyHoSoModel, exportMyPhieuDangKyModel, loading } =
    useModel('hosoxettuyen');
  const { record } = useModel('dottuyensinh');
  const [visibleHoSo, setVisibleHoSo] = useState<boolean>(false);
  const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
  const titleByTrangThai = {
    'Đã khóa': 'Bạn đã nộp hồ sơ',
    'Đã tiếp nhận': 'Hồ sơ của bạn đã được tiếp nhận',
    'Không tiếp nhận': 'Rất tiếc, hồ sơ của bạn không đủ điều kiện tiếp nhận',
    'Chưa khóa': 'Đã kết thúc thời gian nộp hồ sơ',
  };

  const isKetThucThoiGianDangKy = moment(record?.thoiGianKetThucNopHoSo).isBefore();

  const lyDoKhongTiepNhan = (
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

  const subTitleByTrangThai = {
    // 'Đã khóa': 'Hãy đợi đến ngày công bố kết quả xét tuyển của Học viện nhé.',
    // 'Đã tiếp nhận': 'Vui lòng chờ các thông báo mới nhất từ Học viện',
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
              <div>
                {recordHoSo?.trangThai === ETrangThaiHoSo.KHONG_TIEP_NHAN
                  ? lyDoKhongTiepNhan
                  : subTitleByTrangThai?.[recordHoSo?.trangThai ?? '']}
              </div>
              {recordHoSo?.trangThai !== ETrangThaiHoSo.CHUA_KHOA && (
                <div>
                  Trạng thái thanh toán: <b>{recordHoSo?.trangThaiThanhToan}</b>
                </div>
              )}
            </div>
          }
          subTitle={
            <>
              {recordHoSo?.trangThai !== ETrangThaiHoSo.CHUA_KHOA &&
                recordHoSo?.trangThaiThanhToan === ETrangThaiThanhToan.CHUA_THANH_TOAN_DU && (
                  <div>
                    Thí sinh xem thông tin thanh toán và thực hiện thanh toán theo hướng dẫn
                  </div>
                )}
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
              {recordHoSo?.trangThai !== ETrangThaiHoSo.CHUA_KHOA && (
                <Button
                  loading={loading}
                  onClick={() => {
                    exportMyPhieuDangKyModel(recordHoSo?._id ?? '');
                  }}
                >
                  In phiếu
                </Button>
              )}
              {recordHoSo?.trangThai === ETrangThaiHoSo.DA_KHOA &&
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
              {recordHoSo?.trangThai !== ETrangThaiHoSo.CHUA_KHOA && (
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
