import FormTiepNhanHoSo from '@/pages/TiepNhanHoSo/components/FormTiepNhanHoSo';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { ETrangThaiHoSo } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LockOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Button, Card, Col, Descriptions, Divider, Modal, Popconfirm, Row, Tag } from 'antd';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import BlockChungChiNgoaiNgu from './components/BlockChungChiNgoaiNgu';
import BlockChungChiQuocTe from './components/BlockChungChiQuocTe';
import BlockDanhGiaNangLuc from './components/BlockDanhGiaNangLuc';
import BlockDiemTBC from './components/BlockDiemTBC';
import BlockDiemTBCCacMon from './components/BlockDiemTBCCacMon';
import BlockDoiTuongKhuVucUuTien from './components/BlockDoiTuongKhuVucUuTien';
import BlockGiaiHSG from './components/BlockGiaiHSG';
import BlockGiayTo from './components/BlockGiayTo';
import BlockHanhKiem from './components/BlockHanhKiem';
import BlockNguyenVong from './components/BlockNguyenVong';
import BlockNoiHocTHPT from './components/BlockNoiHocTHPT';
import BlockRaSoatThongTinCaNhan from './components/BlockThongTinCaNhan';
const { Item } = Descriptions;

const RaSoatHoSo = () => {
  const { recordHoSo, setVisibleForm, setCurrent, khoaMyHoSoModel } = useModel('hosoxettuyen');
  const { record, visibleFormGiayTo, setVisibleFormGiayTo } = useModel('dottuyensinh');
  let index = 1;
  let indexThongTinTiepNhanHoSo = 1;
  const access = useAccess();
  const [typeXuLy, setTypeXuLy] = useState<ETrangThaiHoSo>();

  const columnGiaiHSG: IColumn<
    HoSoXetTuyen.ThongTinGiaiTinhTP | HoSoXetTuyen.ThongTinGiaiQuocGia
  >[] = [
    {
      title: 'Loại giải',
      dataIndex: 'loaiGiai',
      align: 'center',
      width: '240px',
      key: 'loaiGiai',
    },
    {
      title: 'Năm đạt giải',
      dataIndex: 'namDatGiai',
      align: 'center',
      key: 'namDatGiai',
      width: '140px',
    },

    {
      title: 'Nơi cấp',
      dataIndex: 'noiCap',
      align: 'center',
      key: 'noiCap',
      // render: value => moment(value).format('DD/MM/YYYY'),
      width: '100px',
    },
    {
      title: 'File minh chứng',
      dataIndex: 'fileChungChi',
      align: 'center',
      key: 'fileChungChi',
      render: (value) =>
        Array.isArray(value) &&
        value.map((item, indexGiai) => (
          <a key={item} href={item} target="_blank" rel="noreferrer">
            <Tag style={{ marginTop: 8 }} color="#c01718">{`Xem tập tin ${indexGiai + 1}`}</Tag>
          </a>
        )),
    },
  ];

  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>
              PHIẾU ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC HỆ CHÍNH QUY NĂM {record?.namTuyenSinh ?? ''}
            </b>
            {localStorage.getItem('loaiDot') !== 'Đặc cách' && (
              <div style={{ color: 'red' }}>
                <i>({record?.phuongThucTuyenSinh?.tenPhuongThuc ?? ''})</i>
              </div>
            )}
            {/* {trangThai === 'Đã khóa' && ( */}
            <div style={{ color: 'red', fontStyle: 'italic' }}>(Bản chính thức)</div>
            {/* )} */}
          </div>

          <Divider />
          <GridContent>
            <Row>
              <Col lg={16} xs={24}>
                <h1 style={{ fontWeight: 'bold' }}>A. THÔNG TIN THÍ SINH: </h1>
              </Col>
              <Col lg={8} xs={24}>
                <h1 style={{ fontWeight: 'bold' }}>
                  TRẠNG THÁI: {recordHoSo?.trangThai?.toUpperCase()}{' '}
                </h1>
              </Col>
            </Row>

            <BlockRaSoatThongTinCaNhan />
            <BlockNoiHocTHPT index={10} />
            <BlockDoiTuongKhuVucUuTien indexDoiTuong={11} indexKhuVuc={12} indexNamTotNghiep={13} />
            <BlockHanhKiem index={14} />

            <BlockDiemTBC index={15} />
            <BlockDiemTBCCacMon
              index={16}
              danhSachMon={['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh']}
            />
            <br />

            <h1 style={{ fontWeight: 'bold' }}>B. THÔNG TIN ĐĂNG KÝ XÉT TUYỂN:</h1>

            {recordHoSo?.thongTinChungChiQuocTe?.suDungChungChiQuocTe && (
              <BlockChungChiQuocTe index={index++} />
            )}

            {recordHoSo?.thongTinChungChiNgoaiNgu?.suDungChungChiNgoaiNgu && (
              <BlockChungChiNgoaiNgu index={index++} />
            )}

            {recordHoSo?.thongTinGiaiQuocGia?.suDungGiaiHGSQG && (
              <BlockGiaiHSG index={index++} type="QG" columnGiaiHSG={columnGiaiHSG} />
            )}

            {recordHoSo?.thongTinGiaiTinhTP?.suDungGiaiHGSTinhTP && (
              <BlockGiaiHSG index={index++} type="TinhTP" columnGiaiHSG={columnGiaiHSG} />
            )}
            {recordHoSo?.thongTinKetQuaDanhGiaNangLuc?.suDungDanhGiaNangLuc && (
              <BlockDanhGiaNangLuc index={index++} />
            )}
            <br />
            {recordHoSo?.thongTinHocTapTHPT?.truongChuyen && (
              <Descriptions>
                <Item
                  span={3}
                  label={<span style={{ fontWeight: 'bold' }}> {index++}. Môn chuyên</span>}
                >
                  <b>{recordHoSo?.thongTinHocTapTHPT?.monChuyen}</b>
                </Item>
              </Descriptions>
            )}

            <BlockNguyenVong index={index++} />

            <br />
            <Descriptions>
              <Item
                span={3}
                label={
                  <span style={{ fontWeight: 'bold' }}>
                    {index++}. Đường dẫn file minh chứng hồ sơ học bạ{' '}
                  </span>
                }
              >
                {recordHoSo?.thongTinHocTapTHPT?.urlHocBa?.length &&
                  recordHoSo.thongTinHocTapTHPT?.urlHocBa.map((x: string, indexFile: number) => (
                    <a key={x} href={x} target="_blank" rel="noreferrer">
                      <Tag color="#c01718"> Xem tập tin {indexFile + 1}</Tag>
                    </a>
                  ))}
              </Item>
              <Item
                span={3}
                label={
                  <span style={{ fontWeight: 'bold' }}>
                    {index++}. Đường dẫn file minh chứng đối tượng ưu tiên{' '}
                  </span>
                }
              >
                {recordHoSo?.thongTinHocTapTHPT?.urlChungNhanDoiTuongUuTien?.length ? (
                  recordHoSo?.thongTinHocTapTHPT?.urlChungNhanDoiTuongUuTien.map(
                    (x: string, indexFile: number) => (
                      <a key={x} href={x} target="_blank" rel="noreferrer">
                        <Tag color="#c01718"> Xem tập tin {indexFile + 1}</Tag>
                      </a>
                    ),
                  )
                ) : (
                  <div />
                )}
              </Item>
            </Descriptions>
            {[ETrangThaiHoSo.datiepnhan, ETrangThaiHoSo.khongtiepnhan]?.includes(
              recordHoSo?.trangThai ?? ETrangThaiHoSo.chuakhoa,
            ) && (
              <>
                <h1 style={{ fontWeight: 'bold' }}>C. THÔNG TIN TIẾP NHẬN HỒ SƠ:</h1>
                {recordHoSo?.thongTinGiayToNopHoSo?.length && (
                  <>
                    <BlockGiayTo index={indexThongTinTiepNhanHoSo++} />
                    <br />
                  </>
                )}
                <Descriptions>
                  <Item
                    span={3}
                    label={
                      <span style={{ fontWeight: 'bold' }}>
                        {indexThongTinTiepNhanHoSo}. Ghi chú xử lý
                      </span>
                    }
                  >
                    {recordHoSo?.ghiChuTiepNhan ?? ''}
                  </Item>
                </Descriptions>
              </>
            )}

            {!access.thiSinh ? (
              <>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  {recordHoSo?.trangThai === ETrangThaiHoSo.dakhoa && (
                    <>
                      <Button
                        onClick={() => {
                          setVisibleFormGiayTo(true);
                          setTypeXuLy(ETrangThaiHoSo.datiepnhan);
                        }}
                        style={{ marginRight: 8 }}
                        icon={<CheckOutlined />}
                        type="primary"
                      >
                        Tiếp nhận
                      </Button>
                      <Button
                        onClick={() => {
                          setVisibleFormGiayTo(true);
                          setTypeXuLy(ETrangThaiHoSo.khongtiepnhan);
                        }}
                        style={{ marginRight: 8 }}
                        icon={<StopOutlined />}
                        type="primary"
                      >
                        Không tiếp nhận
                      </Button>
                    </>
                  )}
                  <Button onClick={() => setVisibleForm(false)} icon={<CloseOutlined />}>
                    Đóng
                  </Button>
                </div>
                <Modal
                  destroyOnClose
                  footer={false}
                  width="1000px"
                  title={
                    typeXuLy === ETrangThaiHoSo.datiepnhan
                      ? 'Tiếp nhận hồ sơ'
                      : 'Không tiếp nhận hồ sơ'
                  }
                  visible={visibleFormGiayTo}
                  onCancel={() => setVisibleFormGiayTo(false)}
                >
                  <FormTiepNhanHoSo type={typeXuLy} />
                </Modal>
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
                {recordHoSo?.trangThai === ETrangThaiHoSo.chuakhoa && (
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
                    <Popconfirm
                      onConfirm={() => khoaMyHoSoModel(recordHoSo?._id)}
                      title={
                        <div>
                          Bạn sẽ không thể chỉnh sửa lại hồ sơ sau khi khóa, bạn có chắc chắn muốn
                          khóa hồ sơ?
                        </div>
                      }
                    >
                      <Button type="primary" icon={<LockOutlined />}>
                        Khóa hồ sơ
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </div>
            )}
          </GridContent>
        </Card>
      </div>
    </>
  );
};

export default RaSoatHoSo;
