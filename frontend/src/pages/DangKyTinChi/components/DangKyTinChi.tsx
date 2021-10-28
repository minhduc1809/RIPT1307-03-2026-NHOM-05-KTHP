import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { values } from '@umijs/deps/compiled/lodash';
import { Button, Checkbox, Col, Divider, Result, Row, Table } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import InfoDot from './InfoDot';
import TableDanhSachHocPhan from './TableDanhSachHocPhan';
import TableDanhSachHocPhanDaChon from './TableDanhSachHocPhanDaChon';

interface LopDaChon extends DangKyTinChi.LopTinChi, DangKyTinChi.MonHoc {
  tongSoSinhVienNhomLop?: number;
  loaiNhom?: string;
}

const TinChi = (props: {
  danhSachHocPhanKyNay: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocVuot: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocCaiThien: DangKyTinChi.MonHoc[];
  danhSachHocPhanHocLai: DangKyTinChi.MonHoc[];
  danhSachTatCaHocPhan: DangKyTinChi.MonHoc[];
  danhSachHocPhanMien: DangKyTinChi.MonHoc[];
}) => {
  const {
    recordDotTinChi,
    setCurrent,
    getDotDangKyTinChiByKyHocModel,
    getDSLopDaDangKyByIdDotModel,
    getThongTinKyHocModel,
    getDSLopTinChiByIdDotAndIdMonHocModel,
    setDanhSachLopTinChi,
    danhSachLopTinChi,
    loading,
    danhSachLopDaDangKy,
  } = useModel('dangkytinchi');

  const { record } = useModel('kyhoc');
  const [recordHocPhanCurrent, setRecordHocPhanCurrent] = useState<DangKyTinChi.MonHoc>(
    {} as DangKyTinChi.MonHoc,
  );

  const [danhSachLopDaChon, setDanhSachLopDaChon] = useState<LopDaChon[]>([]);
  let tongSoTinChi = 0;
  let tongHocPhi = 0;
  const checkTimeDangKy =
    moment(recordDotTinChi?.ngay_bat_dau_tin_chi).isBefore(moment(new Date())) &&
    moment(new Date()).isBefore(moment(recordDotTinChi?.ngay_ket_thuc_tin_chi));
  danhSachLopDaChon?.forEach((item) => {
    tongSoTinChi += item.soTinChi;
    tongHocPhi += item.hocPhi;
  });

  const onCell = (recordHP: DangKyTinChi.MonHoc) => ({
    onClick: async () => {
      setDanhSachLopTinChi([]);
      setRecordHocPhanCurrent(recordHP);
      getDSLopTinChiByIdDotAndIdMonHocModel(recordHP.idHocPhan);
    },
    style: { cursor: 'pointer' },
  });

  const renderCell = (val: string, recordMonHoc: DangKyTinChi.MonHoc) => (
    <div
      style={{
        color: recordMonHoc.idHocPhan === recordHocPhanCurrent?.idHocPhan ? '#CC0D00' : '#000',
      }}
    >
      {val}
    </div>
  );

  const onSelectLopTinChi = async (
    value: { target: { checked: boolean } },
    recordLopTinChi: DangKyTinChi.LopTinChi,
  ) => {
    if (value.target.checked) {
      const lopDaChonCuaHocPhanHienTai = danhSachLopDaChon?.find(
        (item) => item.idHocPhan === recordHocPhanCurrent.idHocPhan,
      );

      setDanhSachLopDaChon([
        ...danhSachLopDaChon?.filter((item) => item.idLop !== lopDaChonCuaHocPhanHienTai?.idLop),
        { ...recordLopTinChi, ...recordHocPhanCurrent },
      ]);
    } else {
      setDanhSachLopDaChon(
        danhSachLopDaChon?.filter((item) => item.idLop !== recordLopTinChi.idLop),
      );
    }
  };

  const columns: IColumn<DangKyTinChi.MonHoc>[] = [
    {
      title: 'Học phần',
      dataIndex: 'tenMonHoc',
      width: 200,
      align: 'center',
      onCell,
      render: renderCell,
      search: 'search',
    },
    {
      title: 'Mã học phần',
      dataIndex: 'maMonHoc',
      width: 200,
      align: 'center',
      render: renderCell,
      onCell,
      search: 'search',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
      render: renderCell,
      onCell,
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      width: 100,
      align: 'center',
      render: (val, recordMonHoc) => (
        <div
          style={{
            color: recordMonHoc.idHocPhan === recordHocPhanCurrent?.idHocPhan ? '#CC0D00' : '#000',
          }}
        >
          {currencyFormat(val)}
        </div>
      ),
      onCell,
    },
  ];

  const columnsLopDaChon: IColumn<LopDaChon>[] = [
    {},
    {
      title: 'Học phần',
      dataIndex: 'tenMonHoc',
      // width: 200,
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
      title: 'STT Lớp',
      dataIndex: 'soThuTuLop',
      width: 100,
      align: 'center',
    },
    {
      title: 'STT Nhóm',
      dataIndex: 'soThuTuNhomLop',
      width: 100,
      align: 'center',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 100,
      align: 'center',
      render: (val, recordLop) => (
        <div style={{ fontWeight: recordLop?.tenMonHoc === 'Tổng' ? 'bold' : 'normal' }}>{val}</div>
      ),
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      width: 200,
      align: 'center',
      render: (val, recordLop) => (
        <div style={{ fontWeight: recordLop?.tenMonHoc === 'Tổng' ? 'bold' : 'normal' }}>
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
    {
      title: 'Danh sách học phần được miễn',
      dataSource: props.danhSachHocPhanMien,
    },
  ];

  const columnsLopTinChi: IColumn<DangKyTinChi.LopTinChi>[] = [
    {
      title: 'Đăng ký',
      dataIndex: 'soThuTuKyHoc',
      render: (val, recordLopTinChi) => {
        return (
          <Checkbox
            checked={
              !!danhSachLopDaChon?.find(
                (item) =>
                  item.idLop === recordLopTinChi?.idLop &&
                  (typeof item.idNhomLop === 'number'
                    ? item.idNhomLop === recordLopTinChi.idNhomLop
                    : true),
              )?.idLop
            }
            onChange={(value) => onSelectLopTinChi(value, recordLopTinChi)}
          />
        );
      },
      width: 100,
      align: 'center',
    },
    {
      title: 'Học phần',
      render: () => <div>{recordHocPhanCurrent?.tenMonHoc}</div>,
      align: 'center',
      // width: 200,
    },
    {
      title: 'Số thứ tự lớp',
      dataIndex: 'soThuTuLop',
      align: 'center',
      width: 100,
    },
    {
      title: 'Sinh viên đăng ký lớp',
      dataIndex: 'tongSoSinhVienLop',
      align: 'center',
      render: (val, recordLopTinChi) => (
        <div>
          {val}/{recordLopTinChi?.siSoLop}
        </div>
      ),
      width: 100,
    },
    {
      title: 'Số thứ tự nhóm',
      dataIndex: 'soThuTuNhomLop',
      align: 'center',
      width: 100,
    },
    {
      title: 'Sinh viên đăng ký nhóm',
      dataIndex: 'tongSoSinhVienNhomLop',
      align: 'center',
      render: (val, recordLopTinChi) => (
        <div> {recordLopTinChi?.idNhomLop ? `${val}/${recordLopTinChi?.siSoNhomLop}` : ''}</div>
      ),
      width: 100,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'tenGiangVien',
      align: 'center',
      // width: 200,
    },
    {
      title: 'Lịch học',
      dataIndex: 'maHoaLichHoc',
      align: 'center',
      render: (val: DangKyTinChi.LichHoc[]) => {
        if (!val) return <div>Chưa cập nhật</div>;
        return val?.map((item, index) => (
          <div key={index}>
            <span>Thứ: {Number(item.thu) !== 6 ? Number(item.thu) + 2 : 'Chủ nhật'}</span>
            <Divider type="vertical" />
            <span>Tiết bắt đầu: {item.tietBatDau}</span>
            <Divider type="vertical" />
            <span>Số tiết: {item.soTiet}</span>
            <div>Danh sách tuần: {item.danhSachTuan?.join(', ')}</div>
          </div>
        ));
      },
    },
  ];

  useEffect(() => {
    getDotDangKyTinChiByKyHocModel(record?.id);
    getThongTinKyHocModel(record?.id);
    return () => {
      setDanhSachLopTinChi([]);
    };
  }, [record?.id]);

  useEffect(() => {
    getDSLopDaDangKyByIdDotModel();
  }, [recordDotTinChi?.id]);
  useEffect(() => {
    const danhSach: LopDaChon[] = [];
    danhSachLopDaDangKy.forEach((lop) => {
      for (let i = 0; i < props?.danhSachTatCaHocPhan?.length; i += 1) {
        const hocPhan = props?.danhSachTatCaHocPhan?.[i];
        if (lop.hocPhanId === hocPhan?.idHocPhan) {
          danhSach.push({
            idNhomLop: lop?.idNhomLopTinChi ?? [],
            soThuTuNhomLop: lop.soThuTuNhom === 0 ? undefined : lop.soThuTuNhom,
            tongSoSinhVienNhomLop: 0,
            siSoNhomLop: 0,
            loaiNhom: '',
            idHocPhan: lop.hocPhanId,
            maMonHoc: lop.maHocPhan,
            soThuTuKyHoc: 0,
            soTinChi: lop?.soTinChi ?? 0,
            tenMonHoc: lop.hocPhan,
            hocPhi: hocPhan?.hocPhi ?? 0,
            tenGiangVien: '',
            soThuTuLop: lop.soThuTuLop,
            idLop: lop.idLopTinChi,
            tongSoSinhVienLop: 0,
            siSoLop: 0,
            soLuongNhom: 0,
            maHoaLichHoc: [],
          });
          break;
        }
      }
    });
    setDanhSachLopDaChon(danhSach);
  }, [danhSachLopDaDangKy]);
  return (
    <div>
      {recordDotTinChi === null && (
        <div>
          <Result
            title="Chưa có đợt đăng ký cho kỳ này"
            // extra={<Button type="primary">Back Home</Button>}
          />
        </div>
      )}
      {recordDotTinChi?.id && (
        <div>
          <>
            <InfoDot
              ngayBatDau={recordDotTinChi.ngay_bat_dau_tin_chi}
              ngayKetThuc={recordDotTinChi.ngay_ket_thuc_tin_chi}
            />
            <Row gutter={[8, 24]}>
              {checkTimeDangKy && (
                <>
                  <Col xs={24}>
                    {/* <Scrollbars style={{ height: '300px' }}> */}
                    <TableDanhSachHocPhan data={data} columns={columns} />
                    {/* </Scrollbars> */}
                  </Col>

                  {recordHocPhanCurrent?.idHocPhan && (
                    <Col span={24}>
                      <Table
                        loading={loading}
                        pagination={false}
                        title={() => <b>Danh sách lớp tín chỉ</b>}
                        dataSource={danhSachLopTinChi}
                        columns={columnsLopTinChi}
                      />
                    </Col>
                  )}
                </>
              )}
              <Col xs={24}>
                <TableDanhSachHocPhanDaChon
                  checkTime={checkTimeDangKy}
                  danhSachHocPhanDaChon={danhSachLopDaChon?.map((item, index) => {
                    return { ...item, index: index + 1 };
                  })}
                  tongSoTinChi={tongSoTinChi}
                  tongHocPhi={tongHocPhi}
                  columns={columnsLopDaChon}
                />
              </Col>
            </Row>
            <br />
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={() => {
                  setCurrent(0);
                }}
                type="primary"
                icon={<ArrowLeftOutlined />}
              >
                Quay lại
              </Button>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default TinChi;
