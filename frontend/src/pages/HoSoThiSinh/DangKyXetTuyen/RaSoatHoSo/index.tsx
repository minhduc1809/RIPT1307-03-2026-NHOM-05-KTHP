import FormTiepNhanHoSo from '@/pages/TiepNhanHoSo/components/FormTiepNhanHoSo';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { ELoaiNgoaiNgu, ETrangThaiHoSo, Setting } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { mergeCauHinhDoiTuongXetTuyen } from '@/utils/utils';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LockOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Button, Card, Col, Descriptions, Divider, Modal, Popconfirm, Row, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import BlockGiayToNopOnline from '../ThongTinHocTap/components/BlockGiayToNopOnline';
import BlockChungChiQuocTe from './components/BlockChungChiQuocTe';
import BlockChungChiTiengAnh from './components/BlockChungChiTiengAnh';
import BlockChungChiTiengPhap from './components/BlockChungChiTiengPhap';
import BlockDanhGiaNangLuc from './components/BlockDanhGiaNangLuc';
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
  const { recordHoSo, setVisibleForm, setCurrent, khoaMyHoSoModel, loading } =
    useModel('hosoxettuyen');
  const { record, visibleFormGiayTo, setVisibleFormGiayTo } = useModel('dottuyensinh');
  const cauHinhDoiTuong: any = record?._id
    ? mergeCauHinhDoiTuongXetTuyen(recordHoSo?.maDoiTuong ?? [], record)
    : {};
  let index = 1;
  let indexThongTinTiepNhanHoSo = 1;
  const access = useAccess();
  const [typeXuLy, setTypeXuLy] = useState<ETrangThaiHoSo>();
  const isTrongThoiGianDangKy =
    moment(record?.thoiGianMoDangKy).isBefore(moment(new Date())) &&
    moment(record?.thoiGianKetThucNopHoSo).isAfter(moment(new Date()));
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
      width: '200px',
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
            <Tag style={{ marginTop: 8 }} color={Setting.primaryColor}>{`Xem tập tin ${
              indexGiai + 1
            }`}</Tag>
          </a>
        )),
    },
  ];

  const phuongThuc = localStorage.getItem('phuongThuc');

  return (
    <>
      <div className="box">
        <Card bordered>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 22 }}>
              PHIẾU ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC HỆ {record?.hinhThucDaoTao?.ten?.toUpperCase() ?? ''}{' '}
              NĂM {record?.namTuyenSinh ?? ''}
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

            {recordHoSo?.trangThai === ETrangThaiHoSo.dakhoa && (
              <div style={{ color: 'red', fontStyle: 'italic' }}>(Bản chính thức)</div>
            )}
          </div>

          <Divider />
          <GridContent>
            <Row>
              <Col lg={16} xs={24}>
                <h2 style={{ fontWeight: 'bold' }}>A. THÔNG TIN THÍ SINH: </h2>
              </Col>
              <Col lg={8} xs={24}>
                <h2 style={{ fontWeight: 'bold' }}>
                  TRẠNG THÁI: {recordHoSo?.trangThai?.toUpperCase()}{' '}
                </h2>
              </Col>
            </Row>

            <BlockRaSoatThongTinCaNhan />
            <BlockNoiHocTHPT index={10} />
            <BlockDoiTuongKhuVucUuTien indexDoiTuong={11} indexKhuVuc={12} indexNamTotNghiep={13} />
            {(cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop10?.hanhKiem ||
              cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop11?.hanhKiem ||
              cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop12?.hanhKiem) && (
              <BlockHanhKiem index={14} />
            )}

            {cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT && (
              <BlockDiemTBCCacMon
                cauHinh={cauHinhDoiTuong}
                index={15}
                toHop={
                  record?.suDungToHopMongMuon
                    ? recordHoSo?.toHopMongMuon ?? []
                    : record?.danhSachToHopLuaChon ?? []
                }
                arrLopHoc={[
                  {
                    label: 'Lớp 10',
                    name: ['thongTinHocTapTHPT', 'danhSach', 'truongLop10'],
                    field: 'truongLop10',
                    show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop10,
                  },
                  {
                    label: 'Lớp 11',
                    name: ['thongTinHocTapTHPT', 'danhSach', 'truongLop11'],
                    field: 'truongLop11',
                    show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop11,
                  },
                  {
                    label: 'Lớp 12',
                    name: ['thongTinHocTapTHPT', 'danhSach', 'truongLop12'],
                    field: 'truongLop12',
                    show: cauHinhDoiTuong?.danhSach?.thongTinHocTapTHPT?.danhSach?.truongLop12,
                  },
                ]}
                arrKyHoc={[
                  { label: 'Học kỳ 1', name: 'kqhtHK1' },
                  { label: 'Học kỳ 2', name: 'kqhtHK2' },
                  {
                    label: 'Cả năm',
                    name: 'kqhtCaNam',
                  },
                ]}
              />
            )}

            <br />

            <h2 style={{ fontWeight: 'bold' }}>B. THÔNG TIN ĐĂNG KÝ XÉT TUYỂN:</h2>

            {recordHoSo?.thongTinChungChiQuocTe?.suDungChungChiQuocTe && (
              <BlockChungChiQuocTe index={index++} />
            )}

            {recordHoSo?.thongTinChungChiTiengAnh &&
              String(recordHoSo?.ngonNgu)?.includes(ELoaiNgoaiNgu.ANH) && (
                <BlockChungChiTiengAnh index={index++} />
              )}

            {recordHoSo?.thongTinChungChiTiengPhap &&
              String(recordHoSo?.ngonNgu)?.includes(ELoaiNgoaiNgu.PHAP) && (
                <BlockChungChiTiengPhap index={index++} />
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
            <BlockGiayToNopOnline index={index++} />
            <br />

            {[ETrangThaiHoSo.datiepnhan, ETrangThaiHoSo.khongtiepnhan]?.includes(
              recordHoSo?.trangThai ?? ETrangThaiHoSo.chuakhoa,
            ) && (
              <>
                <h2 style={{ fontWeight: 'bold' }}>C. THÔNG TIN TIẾP NHẬN HỒ SƠ:</h2>
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
                  <Button
                    onClick={() => {
                      setVisibleForm(false);
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
                {recordHoSo?.trangThai === ETrangThaiHoSo.chuakhoa && isTrongThoiGianDangKy && (
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
                      <Button loading={loading} type="primary" icon={<LockOutlined />}>
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
