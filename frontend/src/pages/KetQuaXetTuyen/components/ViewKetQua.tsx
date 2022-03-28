import RaSoatHoSo from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo';
import BlockNguyenVong from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo/components/BlockNguyenVong';
import BlockRaSoatThongTinCaNhan from '@/pages/HoSoThiSinh/DangKyXetTuyen/RaSoatHoSo/components/BlockThongTinCaNhan';
import { EyeOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, Modal, Row } from 'antd';
import { useModel } from 'umi';
import { TableThongTinKhaiXacNhanNhapHoc } from './TableThongTinKhaiXacNhanNhapHoc';

const ViewHoSoTrungTuyen = () => {
  const { record } = useModel('dottuyensinh');
  const { record: recordKetQua } = useModel('ketquaxettuyen');
  const { visibleForm, setVisibleForm, adminGetHoSoByIdHoSoModel } = useModel('hosoxettuyen');
  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>
              HỐ SƠ TRÚNG TUYỂN ĐẠI HỌC HỆ CHÍNH QUY NĂM {record?.namTuyenSinh ?? ''}
            </b>

            <div style={{ color: 'red' }}>
              <i>({record?.phuongThucTuyenSinh?.tenPhuongThuc ?? ''})</i>
            </div>
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
            <TableThongTinKhaiXacNhanNhapHoc index={1} />
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
