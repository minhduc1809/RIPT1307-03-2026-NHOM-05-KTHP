import RaSoatHoSo from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo';
import BlockNguyenVong from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo/components/BlockNguyenVong';
import BlockRaSoatThongTinCaNhan from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo/components/BlockThongTinCaNhan';
import {
  ETrangThaiNhapHoc,
  ETrangThaiTrungTuyen,
  ETrangThaiXacNhanNhapHoc,
} from '@/utils/constants';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PrinterOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Button, Card, Col, Descriptions, Divider, Modal, Row } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import TableThongTinGiaDinh from '../LyLichSinhVien.tsx/components/TableThongTinGiaDinh';
const { Item } = Descriptions;

const ViewHoSoTrungTuyen = () => {
  const access = useAccess();
  const { record } = useModel('dottuyensinh');
  const {
    record: recordKetQua,
    setVisibleForm: setVisibleFormKetQua,
    loading,
    thiSinhKhoaHoSoNhapHocModel,
  } = useModel('ketquaxettuyen');
  const [visible, setVisible] = useState<boolean>(false);
  const { visibleForm, setVisibleForm, setCurrent } = useModel('hosoxettuyen');
  const { record: recordDotNhapHoc } = useModel('dotnhaphoc');
  const [typeXuLy, setTypeXuLy] = useState<ETrangThaiXacNhanNhapHoc>();
  const [visibleFormXuLy, setVisibleFormXuLy] = useState<boolean>(false);
  const phuongThuc = localStorage.getItem('phuongThuc');
  const isTrongThoiGianNhapHoc =
    moment(recordDotNhapHoc?.ngayBatDau).isBefore(moment(new Date())) &&
    moment(recordDotNhapHoc?.ngayKetThuc).isAfter(moment(new Date()));
  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>
              HỒ SƠ NHẬP HỌC ĐẠI HỌC HỆ {record?.hinhThucDaoTao?.ten?.toUpperCase() ?? ''} NĂM{' '}
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
                    // adminGetHoSoByIdHoSoModel(recordKetQua?.idHoSoXetTuyen ?? '');
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

            <Descriptions layout="horizontal" bordered={false}>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>11. Số thẻ BHYT</span>}>
                {recordKetQua?.thongTinThiSinh?.soTheBHYT}
              </Item>
              <Item
                span={1}
                label={<span style={{ fontWeight: 'bold' }}>12. Thành phần xuất thân</span>}
              >
                {recordKetQua?.thongTinThiSinh?.thanhPhanXuatThan}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>13. Ngày vào Đoàn</span>}>
                {recordKetQua?.thongTinThiSinh?.ngayVaoDoan
                  ? moment(recordKetQua.thongTinThiSinh.ngayVaoDoan).format('DD/MM/YYYY')
                  : ''}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>14. Ngày vào Đảng</span>}>
                {recordKetQua?.thongTinThiSinh?.ngayVaoDang
                  ? moment(recordKetQua.thongTinThiSinh.ngayVaoDang).format('DD/MM/YYYY')
                  : ''}
              </Item>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>15. Facebook</span>}>
                {recordKetQua?.thongTinThiSinh?.facebook}
              </Item>
            </Descriptions>
            <Descriptions>
              <Item span={1} label={<span style={{ fontWeight: 'bold' }}>16. Gia đình</span>}>
                {' '}
              </Item>
            </Descriptions>
            <TableThongTinGiaDinh mode="view" />

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
            {/* <TableThongTinKhaiXacNhanNhapHoc index={1} />
            <TableGiayToXacNhanNhapHoc index={2} /> */}
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
                      ETrangThaiXacNhanNhapHoc.XAC_NHAN &&
                    recordKetQua?.trangThaiNhapHoc === ETrangThaiNhapHoc.DA_KHOA && (
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
                  <Button
                    onClick={() => {
                      setVisibleFormKetQua(false);
                    }}
                    icon={<CloseOutlined />}
                  >
                    Đóng
                  </Button>
                </div>
                {/* <Modal
                  destroyOnClose
                  footer={false}
                  width="1000px"
                  title={
                    typeXuLy === ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN
                      ? 'Tiếp nhận hồ sơ'
                      : 'Không tiếp nhận hồ sơ'
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
                </Modal> */}
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  marginTop: 10,
                  justifyContent: 'space-around',
                }}
              >
                {recordKetQua?.trangThaiNhapHoc === ETrangThaiNhapHoc.CHUA_KHOA &&
                isTrongThoiGianNhapHoc ? (
                  <>
                    <Button
                      onClick={() => {
                        setCurrent(0);
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        });
                      }}
                      icon={<EditOutlined />}
                    >
                      Chỉnh sửa hồ sơ
                    </Button>

                    <Button
                      onClick={() => {
                        setVisible(true);
                      }}
                      loading={loading}
                      type="primary"
                      icon={<LockOutlined />}
                    >
                      Khóa hồ sơ
                    </Button>
                    {/* </Popconfirm> */}
                  </>
                ) : (
                  <Button
                    type="primary"
                    loading={loading}
                    // onClick={() => {
                    //   exportMyPhieuDangKyModel(recordHoSo?._id ?? '');
                    // }}
                    icon={<PrinterOutlined />}
                  >
                    In phiếu
                  </Button>
                )}
              </div>
            )}
          </GridContent>
        </Card>
        <Modal
          onCancel={() => {
            setVisible(false);
          }}
          visible={visible}
          title="Khóa hồ sơ"
          footer={
            <>
              <Button
                loading={loading}
                onClick={async () => {
                  await thiSinhKhoaHoSoNhapHocModel(recordKetQua?._id ?? '', recordKetQua);
                  setVisible(false);
                }}
                type="primary"
              >
                Xác nhận
              </Button>

              <Button
                onClick={() => {
                  setVisible(false);
                }}
              >
                Hủy
              </Button>
            </>
          }
        >
          <div>
            Bạn sẽ không thể chỉnh sửa lại hồ sơ sau khi khóa, bạn có chắc chắn muốn khóa hồ sơ?
          </div>
          <br />
          <div>
            <b>Lưu ý:</b> Thí sinh chưa bắt buộc Khóa hồ sơ ngay lập tức mà có thể thực hiện cập
            nhật thông tin hồ sơ, và Khóa hồ sơ trước hạn{' '}
            {moment(recordDotNhapHoc?.ngayKetThuc).format('HH:mm DD/MM/YYYY')}
          </div>
        </Modal>
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
