import RaSoatHoSo from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo';
import BlockNguyenVong from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo/components/BlockNguyenVong';
import BlockRaSoatThongTinCaNhan from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo/components/BlockThongTinCaNhan';
import { ETrangThaiTrungTuyen, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  StopOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Button, Card, Col, Descriptions, Divider, Modal, Popconfirm, Row } from 'antd';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormTiepNhanXacNhanNhapHoc from './FormTiepNhanXacNhanNhapHoc';
import { TableGiayToXacNhanNhapHoc } from './TableGiayToXacNhanNhapHoc';
import { TableThongTinKhaiXacNhanNhapHoc } from './TableThongTinKhaiXacNhanNhapHoc';

const ViewHoSoTrungTuyen = (props: { idCoSo?: string }) => {
  const access = useAccess();
  const { record } = useModel('dottuyensinh');
  const {
    record: recordKetQua,
    setVisibleForm: setVisibleFormKetQua,
    adminTiepNhanXacNhanNhapHocModel,
  } = useModel('ketquaxettuyen');
  const { visibleForm, setVisibleForm, adminGetHoSoByIdHoSoModel } = useModel('hosoxettuyen');
  const [typeXuLy, setTypeXuLy] = useState<ETrangThaiXacNhanNhapHoc>();
  const [visibleFormXuLy, setVisibleFormXuLy] = useState<boolean>(false);
  const phuongThuc = localStorage.getItem('phuongThuc');
  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>
              HỒ SƠ TRÚNG TUYỂN ĐẠI HỌC HỆ {record?.hinhThucDaoTao?.ten?.toUpperCase() ?? ''} NĂM{' '}
              {record?.namTuyenSinh ?? ''}
            </b>

            {phuongThuc && (
              <div style={{ color: 'red' }}>
                <i>
                  (
                  {record?.danhSachPhuongThucTuyenSinh?.find((item) => item._id === phuongThuc)
                    ?.tenPhuongThuc ?? ''}
                  )
                </i>
              </div>
            )}
          </div>

          <Divider />
          <GridContent>
            <Row>
              <Col lg={16} xs={24}>
                <h2 style={{ fontWeight: 'bold' }}>A. THÔNG TIN THÍ SINH: </h2>
              </Col>
              <Col lg={8} xs={24}>
                <Button
                  onClick={() => {
                    adminGetHoSoByIdHoSoModel(recordKetQua?.idHoSoXetTuyen ?? '');
                    setVisibleForm(true);
                  }}
                  type="primary"
                  icon={<EyeOutlined />}
                >
                  Xem hồ sơ gốc
                </Button>
              </Col>
            </Row>

            <BlockRaSoatThongTinCaNhan record={recordKetQua} />

            <h2 style={{ fontWeight: 'bold' }}>B. THÔNG TIN ĐĂNG KÝ XÉT TUYỂN:</h2>

            <BlockNguyenVong
              title="Nguyện vọng trúng tuyển"
              record={{
                danhSachNguyenVong: recordKetQua?.nguyenVongTrungTuyen
                  ? [recordKetQua?.nguyenVongTrungTuyen]
                  : [],
              }}
            />
            <br />
            <h2 style={{ fontWeight: 'bold' }}>C. THÔNG TIN XÁC NHẬN NHẬP HỌC:</h2>
            <TableThongTinKhaiXacNhanNhapHoc mode="view" index={1} />
            <TableGiayToXacNhanNhapHoc mode="view" index={2} />
            <Descriptions>
              <Descriptions.Item
                span={3}
                label={<span style={{ fontWeight: 'bold' }}>3. Ghi chú chuyên viên</span>}
              >
                {recordKetQua?.thongTinXacNhanNhapHoc?.ghiChuTiepNhan ?? ''}
              </Descriptions.Item>
            </Descriptions>

            {!access.thiSinh ? (
              <>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  {recordKetQua?.trangThai === ETrangThaiTrungTuyen.TRUNG_TUYEN &&
                    recordKetQua?.thongTinXacNhanNhapHoc?.trangThaiXacNhan ===
                      ETrangThaiXacNhanNhapHoc.XAC_NHAN && (
                      <>
                        <Button
                          onClick={() => {
                            setVisibleFormXuLy(true);
                            setTypeXuLy(ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN);
                          }}
                          style={{ marginRight: 8 }}
                          icon={<CheckOutlined />}
                          type="primary"
                        >
                          Tiếp nhận
                        </Button>
                        <Button
                          onClick={() => {
                            setVisibleFormXuLy(true);
                            setTypeXuLy(ETrangThaiXacNhanNhapHoc.KHONG_TIEP_NHAN);
                          }}
                          style={{ marginRight: 8 }}
                          icon={<StopOutlined />}
                          type="primary"
                        >
                          Không tiếp nhận
                        </Button>
                      </>
                    )}
                  {recordKetQua?.trangThai === ETrangThaiTrungTuyen.TRUNG_TUYEN &&
                    recordKetQua?.thongTinXacNhanNhapHoc?.trangThaiXacNhan !==
                      ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN && (
                      <Popconfirm
                        onConfirm={() => {
                          adminTiepNhanXacNhanNhapHocModel(
                            recordKetQua?._id ?? '',
                            {
                              trangThaiXacNhan: ETrangThaiXacNhanNhapHoc.CHUA_XAC_NHAN,
                            },
                            record?._id ?? '',
                            props?.idCoSo,
                          );
                        }}
                        title="Bạn có chắc chắn mở khóa xác nhận nhập học của hồ sơ này?"
                      >
                        <Button style={{ marginRight: 8 }} icon={<UnlockOutlined />} type="primary">
                          Mở khóa xác nhận nhập học
                        </Button>
                      </Popconfirm>
                    )}
                  <Button
                    onClick={() => {
                      setVisibleFormKetQua(false);
                    }}
                    icon={<CloseOutlined />}
                  >
                    Đóng
                  </Button>
                </div>
                <Modal
                  destroyOnClose
                  footer={false}
                  width="1000px"
                  title={
                    typeXuLy === ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN
                      ? 'Tiếp nhận hồ sơ xác nhận nhập học'
                      : 'Không tiếp nhận hồ sơ xác nhận nhập học'
                  }
                  visible={visibleFormXuLy}
                  onCancel={() => setVisibleFormXuLy(false)}
                >
                  <FormTiepNhanXacNhanNhapHoc
                    idCoSo={props.idCoSo}
                    onCancel={() => {
                      setVisibleFormXuLy(false);
                    }}
                    type={typeXuLy}
                  />
                </Modal>
              </>
            ) : (
              <div />
            )}
          </GridContent>
        </Card>
        <Modal
          bodyStyle={{ padding: 0 }}
          footer={false}
          width={1100}
          visible={visibleForm}
          onCancel={() => setVisibleForm(false)}
        >
          <RaSoatHoSo />
        </Modal>
      </div>
    </>
  );
};

export default ViewHoSoTrungTuyen;
