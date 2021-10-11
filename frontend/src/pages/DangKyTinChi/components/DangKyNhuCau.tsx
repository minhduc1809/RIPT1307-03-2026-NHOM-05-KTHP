import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Result, Row } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useModel } from 'umi';
import InfoDot from './InfoDot';
import TableDanhSachHocPhan from './TableDanhSachHocPhan';
import TableDanhSachHocPhanDaChon from './TableDanhSachHocPhanDaChon';

const DangKyNhuCau = (props: {
  danhSachHocPhanKyNay: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocVuot: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocCaiThien: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocLai: DangKyTinChi.MonHoc[];
  danhSachTatCaHocPhan: DangKyTinChi.MonHoc[];
}) => {
  const {
    recordDotNhuCau,
    recordPhieuDangKy,
    recordHocPhan,
    setCurrent,
    getDotDangKyNhuCauByKyHocModel,
    getPhieuDangKyByDotModel,
    getThongTinKyHocModel,
  } = useModel('dangkytinchi');

  const { record } = useModel('kyhoc');

  const [danhSachHocPhanDaChon, setDanhSachHocPhanDaChon] = useState<DangKyTinChi.MonHoc[]>([]);
  const [danhSachIdHocPhanDaChon, setDanhSachIdHocPhanDaChon] = useState<number[]>([]);
  const [tongSoTinChi, setTongSoTinChi] = useState<number>(0);
  const [tongHocPhi, setTongHocPhi] = useState<number>(0);
  const checkTimeDangKy =
    moment(recordDotNhuCau?.ngay_bat_dau_nhu_cau).isAfter(moment(new Date())) &&
    moment(new Date()).isBefore(moment(recordDotNhuCau?.ngay_ket_thuc_nhu_cau));
  const onSelectMonHoc = (value: CheckboxChangeEvent, recordMonHoc: DangKyTinChi.MonHoc) => {
    const danhSachTemp = [...danhSachHocPhanDaChon];
    const danhSachIdTemp = [...danhSachIdHocPhanDaChon];
    if (value.target.checked) {
      danhSachTemp.push({ ...recordMonHoc, index: danhSachHocPhanDaChon.length + 1 });
      danhSachIdTemp.push(recordMonHoc.idHocPhan);
      setDanhSachHocPhanDaChon(danhSachTemp);
      setDanhSachIdHocPhanDaChon(danhSachIdTemp);
      setTongSoTinChi(tongSoTinChi + recordMonHoc.soTinChi);
      setTongHocPhi(tongHocPhi + recordMonHoc.hocPhi);
    } else {
      setTongSoTinChi(tongSoTinChi - recordMonHoc.soTinChi);
      setTongHocPhi(tongHocPhi - recordMonHoc.hocPhi);
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
      render: (val) => <div style={{ fontWeight: val === 'Tổng' ? 'bold' : 'normal' }}>{val}</div>,
    },
    {
      title: 'Mã học phần',
      dataIndex: 'maMonHoc',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
      render: (val, recordHP) => (
        <div style={{ fontWeight: recordHP?.tenMonHoc === 'Tổng' ? 'bold' : 'normal' }}>{val}</div>
      ),
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      width: 200,
      align: 'center',
      render: (val, recordHP) => (
        <div style={{ fontWeight: recordHP?.tenMonHoc === 'Tổng' ? 'bold' : 'normal' }}>
          {currencyFormat(val)}
        </div>
      ),
    },
  ];

  const data = [
    { title: 'Danh sách học phần kỳ này', dataSource: props.danhSachHocPhanKyNay },
    {
      title: 'Danh sách học phần học vượt',
      dataSource: props.danhSachHocPhanHocVuot,
    },
    {
      title: 'Danh sách học phần học lại',
      dataSource: props.danhSachHocPhanHocLai,
    },
    {
      title: 'Danh sách học phần học cải thiện',
      dataSource: props.danhSachHocPhanHocCaiThien,
    },
  ];

  useEffect(() => {
    getDotDangKyNhuCauByKyHocModel(record?.id);
    getThongTinKyHocModel(record?.id);
  }, [record?.id]);

  useEffect(() => {
    getPhieuDangKyByDotModel();
  }, [recordDotNhuCau?.id]);

  useEffect(() => {
    const danhSachHocPhanDaChonTemp: DangKyTinChi.MonHoc[] = [];
    const danhSachIdHocPhanDaChonTemp: number[] = [];
    let tongSoTinChiTemp = 0;
    let tongHocPhiTemp = 0;
    recordPhieuDangKy?.danhSachNguyenVong?.forEach((item, index) => {
      const hocPhanRecord = props.danhSachTatCaHocPhan?.find(
        (hocPhan) => hocPhan.idHocPhan === item.idHocPhan,
      );
      if (hocPhanRecord?.idHocPhan) {
        danhSachHocPhanDaChonTemp.push({ ...hocPhanRecord, index: index + 1 });
        danhSachIdHocPhanDaChonTemp.push(hocPhanRecord?.idHocPhan);
        tongSoTinChiTemp += hocPhanRecord.soTinChi;
        tongHocPhiTemp += hocPhanRecord.hocPhi;
      }
    });
    if (danhSachHocPhanDaChonTemp.length === 0) {
      props.danhSachHocPhanKyNay?.forEach((item, index) => {
        danhSachHocPhanDaChonTemp.push({ ...item, index: index + 1 });
        danhSachIdHocPhanDaChonTemp.push(item.idHocPhan);
        tongSoTinChiTemp += item.soTinChi;
        tongHocPhiTemp += item.hocPhi;
      });
    }
    setDanhSachHocPhanDaChon(danhSachHocPhanDaChonTemp);
    setDanhSachIdHocPhanDaChon(danhSachIdHocPhanDaChonTemp);
    setTongSoTinChi(tongSoTinChiTemp);
    setTongHocPhi(tongHocPhiTemp);
  }, [recordHocPhan, recordPhieuDangKy]);
  return (
    <div>
      {recordDotNhuCau === null && (
        <div>
          <Result
            title="Chưa có đợt đăng ký cho kỳ này"
            // extra={<Button type="primary">Back Home</Button>}
          />
        </div>
      )}
      {recordDotNhuCau?.id && (
        <div>
          {recordPhieuDangKy && recordPhieuDangKy !== null && (
            <>
              <InfoDot
                ngayBatDau={recordDotNhuCau?.ngay_bat_dau_nhu_cau}
                ngayKetThuc={recordDotNhuCau?.ngay_ket_thuc_nhu_cau}
              />
              <Row gutter={[8, 0]}>
                <Col xs={24}>
                  <Scrollbars autoHide style={{ height: 'calc(100vh - 350px)' }}>
                    <TableDanhSachHocPhan data={data} columns={columns} />
                  </Scrollbars>
                </Col>
                <Col xs={24}>
                  {/* <Scrollbars autoHide style={{ height: 'calc(100vh - 350px)' }}> */}
                  <TableDanhSachHocPhanDaChon
                    checkTime={checkTimeDangKy}
                    danhSachHocPhanDaChon={danhSachHocPhanDaChon}
                    tongSoTinChi={tongSoTinChi}
                    tongHocPhi={tongHocPhi}
                    columns={columns}
                  />{' '}
                  {/* </Scrollbars> */}
                </Col>
              </Row>
              <br />
              <div style={{ textAlign: 'center' }}>
                <Button onClick={() => setCurrent(1)} type="primary" icon={<ArrowRightOutlined />}>
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
