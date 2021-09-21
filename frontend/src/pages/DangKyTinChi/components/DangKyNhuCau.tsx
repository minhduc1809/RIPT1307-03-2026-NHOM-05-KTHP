import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { ArrowRightOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, List, Popconfirm, Row, Statistic, Tag, Result, Table } from 'antd';
import TableTemp from '@/components/Table/Table';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useModel } from 'umi';

const { Countdown } = Statistic;

const DangKyNhuCau = () => {
  const {
    recordDot,
    recordPhieuDangKy,
    recordHocPhan,
    postDanhSachHocPhanDangKyModel,
    recordThongTinKyHoc,
    current,
    setCurrent,
  } = useModel('dangkytinchi');
  const { record } = useModel('kyhoc');
  const danhSachHocPhanKyNay: DangKyTinChi.MonHoc[] = [];
  const danhSachHocPhanHocVuot: DangKyTinChi.MonHoc[] = [];
  const danhSachHocPhanHocCaiThien: DangKyTinChi.MonHoc[] = recordHocPhan?.dat ?? [];
  const danhSachHocPhanHocLai: DangKyTinChi.MonHoc[] = recordHocPhan?.khongDat ?? [];
  const [danhSachHocPhanDaChon, setDanhSachHocPhanDaChon] = useState<DangKyTinChi.MonHoc[]>([]);
  const [danhSachIdHocPhanDaChon, setDanhSachIdHocPhanDaChon] = useState<number[]>([]);
  const [tongSoTinChi, setTongSoTinChi] = useState<number>(0);
  recordHocPhan?.chuaHoc?.forEach((item) => {
    if (item?.soThuTuKyHoc === record?.soThuTu) {
      danhSachHocPhanKyNay?.push(item);
    } else danhSachHocPhanHocVuot?.push(item);
  });
  const danhSachTatCaHocPhan = [
    ...danhSachHocPhanHocCaiThien,
    ...danhSachHocPhanHocLai,
    ...danhSachHocPhanKyNay,
    ...danhSachHocPhanHocVuot,
  ];
  const onSelectMonHoc = (value: CheckboxChangeEvent, recordMonHoc: DangKyTinChi.MonHoc) => {
    const danhSachTemp = [...danhSachHocPhanDaChon];
    const danhSachIdTemp = [...danhSachIdHocPhanDaChon];
    if (value.target.checked) {
      danhSachTemp.push({ ...recordMonHoc, index: danhSachHocPhanDaChon.length + 1 });
      danhSachIdTemp.push(recordMonHoc.idHocPhan);
      setDanhSachHocPhanDaChon(danhSachTemp);
      setDanhSachIdHocPhanDaChon(danhSachIdTemp);
      setTongSoTinChi(tongSoTinChi + recordMonHoc.soTinChi);
    } else {
      setTongSoTinChi(tongSoTinChi - recordMonHoc.soTinChi);
      setDanhSachHocPhanDaChon(
        danhSachTemp
          ?.filter((item) => item.idHocPhan !== recordMonHoc.idHocPhan)
          ?.map((item, index) => {
            return { ...item, index: index + 1 };
          }),
      );
      setDanhSachIdHocPhanDaChon(danhSachIdTemp?.filter((item) => item !== recordMonHoc.idHocPhan));
    }
  };

  const columns: IColumn<DangKyTinChi.MonHoc>[] = [
    {
      title: 'Đăng ký',
      dataIndex: 'soThuTuKyHoc',
      render: (val, recordMonHoc) => (
        <Checkbox
          checked={danhSachIdHocPhanDaChon.includes(recordMonHoc.idHocPhan)}
          onChange={(value) => onSelectMonHoc(value, recordMonHoc)}
        />
      ),
      width: 100,
      align: 'center',
    },
    {
      title: 'Học phần',
      dataIndex: 'tenMonHoc',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Mã học phần',
      dataIndex: 'maMonHoc',
      width: 200,
      align: 'center',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      width: 200,
      align: 'center',
      render: (val) => <div>{currencyFormat(val)}</div>,
    },
  ];

  const data = [
    { title: 'Danh sách học phần kỳ này', dataSource: danhSachHocPhanKyNay },
    {
      title: 'Danh sách học phần học vượt',
      dataSource: danhSachHocPhanHocVuot,
    },
    {
      title: 'Danh sách học phần học lại',
      dataSource: danhSachHocPhanHocLai,
    },
    {
      title: 'Danh sách học phần học cải thiện',
      dataSource: danhSachHocPhanHocCaiThien,
    },
  ];

  const now = Date.now();
  const diffTime = moment(new Date(recordDot?.ngay_ket_thuc_nhu_cau ?? now)).diff(now);
  const deadline = now + diffTime ?? 0;

  let colorDot = 'orange';
  let textTrangThai = 'Đang diễn ra';
  if (moment(new Date()).isBefore(moment(recordDot?.ngay_bat_dau_nhu_cau))) {
    textTrangThai = 'Chưa diễn ra';
    colorDot = 'green';
  } else if (moment(new Date()).isAfter(moment(recordDot?.ngay_ket_thuc_nhu_cau))) {
    textTrangThai = 'Đã diễn ra';
    colorDot = 'blue';
  }
  const checkTrongThoiGianDangKy = textTrangThai === 'Đang diễn ra';
  let textConfirmSave = 'Bạn có chắc chắn muốn lưu không ?';
  if (tongSoTinChi < recordThongTinKyHoc.tinChiDangKyToiThieu) {
    textConfirmSave = `Bạn đã đăng ký số tín chỉ ít hơn ${recordThongTinKyHoc.tinChiDangKyToiThieu} tín chỉ theo quy định. Bạn có chắc chắn muốn tiếp tục đăng ký không?`;
  } else if (tongSoTinChi > recordThongTinKyHoc.tinChiDangKyToiDa) {
    textConfirmSave = `Bạn đã đăng ký số tín chỉ lớn hơn ${recordThongTinKyHoc.tinChiDangKyToiDa} tín chỉ theo quy định. Bạn vui lòng đăng ký lại`;
  }

  const onSave = () => {
    if (tongSoTinChi > recordThongTinKyHoc.tinChiDangKyToiDa) return;
    const danhSachHocPhan = danhSachHocPhanDaChon?.map((item) => {
      return { idHocPhan: item.idHocPhan };
    });
    postDanhSachHocPhanDangKyModel(danhSachHocPhan);
  };

  useEffect(() => {
    const danhSachHocPhanDaChonTemp: DangKyTinChi.MonHoc[] = [];
    const danhSachIdHocPhanDaChonTemp: number[] = [];
    recordPhieuDangKy?.danhSachNguyenVong?.forEach((item, index) => {
      const hocPhanRecord = danhSachTatCaHocPhan?.find(
        (hocPhan) => hocPhan.idHocPhan === item.idHocPhan,
      );
      if (hocPhanRecord?.idHocPhan) {
        danhSachHocPhanDaChonTemp.push({ ...hocPhanRecord, index: index + 1 });
        danhSachIdHocPhanDaChonTemp.push(hocPhanRecord?.idHocPhan);
      }
    });
    if (danhSachHocPhanDaChonTemp.length === 0) {
      danhSachHocPhanKyNay?.forEach((item, index) => {
        danhSachHocPhanDaChonTemp.push({ ...item, index: index + 1 });
        danhSachIdHocPhanDaChonTemp.push(item.idHocPhan);
      });
    }
    setDanhSachHocPhanDaChon(danhSachHocPhanDaChonTemp);
    setDanhSachIdHocPhanDaChon(danhSachIdHocPhanDaChonTemp);
    setTongSoTinChi(recordPhieuDangKy?.phieuDangKy?.tong_so_tin_chi ?? 0);
  }, [recordHocPhan, recordPhieuDangKy]);
  return (
    <div>
      {recordDot === null && (
        <div>
          <Result
            title="Chưa có đợt đăng ký cho kỳ này"
            // extra={<Button type="primary">Back Home</Button>}
          />
        </div>
      )}
      {recordDot?.id && (
        <div>
          {recordPhieuDangKy && recordPhieuDangKy !== null && (
            <>
              <Row gutter={[8, 0]}>
                <Col xs={24} xl={12}>
                  Thời gian bắt đầu:{' '}
                  {moment(recordDot.ngay_bat_dau_nhu_cau).format('HH:mm DD/MM/YYYY')}
                </Col>
                <Col xs={24} xl={12}>
                  Thời gian kết thúc:{' '}
                  {moment(recordDot.ngay_ket_thuc_nhu_cau).format('HH:mm DD/MM/YYYY')}
                </Col>
                <Col xs={24} xl={12}>
                  <div style={{ display: 'flex' }}>
                    Thời gian còn lại:
                    <Countdown
                      value={deadline}
                      valueStyle={{ fontSize: 14, marginLeft: 4 }}
                      format="D ngày H giờ m phút s giây"
                    />
                  </div>
                </Col>
                <Col xs={24} xl={6}>
                  Trạng thái: <Tag color={colorDot}>{textTrangThai}</Tag>
                </Col>
              </Row>
              <Row gutter={[8, 0]}>
                <Col xs={24} xl={12} xxl={12}>
                  <Scrollbars autoHide style={{ height: 'calc(100vh - 350px)' }}>
                    <List
                      style={{ paddingRight: 10 }}
                      itemLayout="horizontal"
                      dataSource={data}
                      renderItem={(item) => (
                        <List.Item style={{ padding: 0 }} key={item.title}>
                          <Table
                            style={{ width: '100%' }}
                            pagination={
                              item.title === 'Danh sách học phần kỳ này'
                                ? false
                                : {
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '25', '50', '100'],
                                    showTotal: (tongSo: number) => {
                                      return <div>Tổng số: {tongSo}</div>;
                                    },
                                  }
                            }
                            title={() => <b>{item.title}</b>}
                            columns={columns}
                            dataSource={item.dataSource}
                          />
                        </List.Item>
                      )}
                    />
                  </Scrollbars>
                </Col>
                <Col xs={24} xl={12} xxl={12}>
                  <Scrollbars autoHide style={{ height: 'calc(100vh - 350px)' }}>
                    <TableTemp
                      title={
                        <b>
                          <span>Danh sách học phần đã chọn</span>
                          <span style={{ float: 'right' }}>
                            <Popconfirm
                              disabled={
                                danhSachHocPhanDaChon.length === 0 || !checkTrongThoiGianDangKy
                              }
                              onConfirm={onSave}
                              title={<div style={{ maxWidth: 300 }}>{textConfirmSave}</div>}
                            >
                              <Button
                                icon={<SaveOutlined />}
                                style={{ marginRight: '-16px' }}
                                disabled={
                                  danhSachHocPhanDaChon.length === 0 || !checkTrongThoiGianDangKy
                                }
                                type="primary"
                              >
                                Lưu
                              </Button>
                            </Popconfirm>
                          </span>
                        </b>
                      }
                      columns={[
                        {
                          title: 'STT',
                          width: 80,
                          align: 'center',
                          dataIndex: 'index',
                        },
                        ...columns.slice(1),
                      ]}
                      data={
                        danhSachHocPhanDaChon.length > 0
                          ? [
                              ...danhSachHocPhanDaChon,
                              {
                                tenMonHoc: 'Tổng',
                                soTinChi: tongSoTinChi,
                                soThuTuKyHoc: tongSoTinChi,
                                idHocPhan: -1,
                                maMonHoc: '',
                              },
                            ]
                          : danhSachHocPhanDaChon
                      }
                    />
                  </Scrollbars>
                </Col>
              </Row>
              <br />
              <div style={{ textAlign: 'center' }}>
                <Button
                  onClick={() => setCurrent(current + 1)}
                  type="primary"
                  icon={<ArrowRightOutlined />}
                >
                  Tiếp theo
                </Button>
              </div>
            </>
          )}
          {recordPhieuDangKy === null && (
            <Result
              title="Bạn chưa đăng ký nhu cầu học phần trong đợt này"
              extra={<Button type="primary">Bắt đầu đăng ký</Button>}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DangKyNhuCau;
