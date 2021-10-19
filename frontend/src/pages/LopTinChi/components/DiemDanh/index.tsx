import type { BuoiHoc } from '@/services/LopTinChi/typings';
import { toHexa } from '@/utils/utils';
import { Button, Card, Modal } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import DanhSachSinhVien from './DanhSachSinhVien';
import DetailBuoiHoc from './ModalDetail';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const messages = {
  allDay: 'Cả ngày',
  previous: 'Trước',
  next: 'Sau',
  today: 'Hôm nay',
  month: 'Tháng',
  week: 'Tuần',
  day: 'Ngày',
  agenda: 'Chung',
  date: 'Ngày',
  time: 'Thời gian',
  event: 'Sự kiện',
  showMore: (total: number) => `+ Xem thêm (${total})`,
};

export default (props: { idLopTinChi: number }) => {
  const {
    danhSach,
    getDanhSachBuoiHocByIdLopTinChiModel,
    setRecord,
    setRecordDSSV,
    recordDSSV,
    khoiTaoDiemDanhByIdBuoiHocModel,
    giangVienDiemDanhModel,
    loading,
  } = useModel('diemdanh');
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDiemDanh, setVisibleDiemDanh] = useState<boolean>(false);
  const eventPropGetter = (event: { title: string }) => ({
    style: { backgroundColor: toHexa(event.title) },
  });

  const [dataDiemDanh, setDataDiemDanh] = useState<BuoiHoc.SinhVienDiemDanh[]>(
    recordDSSV?.danhSachDiemDanh ?? [],
  );
  useEffect(() => {
    setDataDiemDanh(recordDSSV?.danhSachDiemDanh ?? []);
  }, [recordDSSV?.danhSachDiemDanh?.length]);

  const onSelectEvent = (record: BuoiHoc.Record) => {
    setRecord(record);
    setVisible(true);
  };
  const eventCustom = ({ event }: any) => {
    const { title } = event;
    return <div style={{ width: '100%', fontSize: 13 }}>{`${title || 'Chưa cập nhật'}`}</div>;
  };
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    getDanhSachBuoiHocByIdLopTinChiModel(props.idLopTinChi);
  }, [props.idLopTinChi]);
  const dataBuoiHoc: { title: string; [x: string]: unknown }[] | undefined = [];
  danhSach?.forEach((x: BuoiHoc.Record) =>
    dataBuoiHoc.push({
      ...x,
      title: x?.ten_hoc_phan ?? '',
      start: moment(x?.ngay_gio_hoc).toDate(),
      end: moment(x?.ngay_gio_ket_thuc).toDate(),
    }),
  );
  return (
    <Card bordered>
      <Calendar
        localizer={localizer}
        events={dataBuoiHoc}
        defaultView={Views.WEEK}
        scrollToTime={new Date(1970, 1, 1)}
        defaultDate={new Date()}
        messages={messages}
        views={['month', 'week', 'day']}
        style={{ height: 700 }}
        min={moment('0600', 'HHmm').toDate()}
        max={moment('2100', 'HHmm').toDate()}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(record: any) => onSelectEvent(record)}
        components={{ event: (event: any) => eventCustom(event) }}
        popup
      />
      <Modal
        style={{ zIndex: 9 }}
        footer={
          <>
            <Button
              type="primary"
              onClick={async () => {
                await khoiTaoDiemDanhByIdBuoiHocModel();
                setVisibleDiemDanh(true);
              }}
            >
              Điểm danh
            </Button>
            <Button
              onClick={() => {
                setVisible(false);
                // setRecord({} as BuoiHoc.Record);
              }}
            >
              Đóng
            </Button>
          </>
        }
        destroyOnClose
        title="Chi tiết buổi học"
        onCancel={() => {
          setVisible(false);
          // setRecord({} as BuoiHoc.Record);
        }}
        visible={visible}
      >
        <DetailBuoiHoc />
      </Modal>
      <Modal
        footer={
          <>
            <Button
              loading={loading}
              onClick={async () => {
                await giangVienDiemDanhModel({
                  danhSachDiemDanh: dataDiemDanh?.map((item) => ({
                    id: item.id,
                    diem_cong: item.diem_cong,
                    trang_thai: item.trang_thai,
                  })),
                });
                getDanhSachBuoiHocByIdLopTinChiModel(props.idLopTinChi);
                setVisibleDiemDanh(false);
                setRecordDSSV({} as BuoiHoc.ListSinhVien);
              }}
              type="primary"
            >
              Lưu
            </Button>
            <Button
              onClick={() => {
                setVisibleDiemDanh(false);
                setRecordDSSV({} as BuoiHoc.ListSinhVien);
              }}
            >
              Đóng
            </Button>
          </>
        }
        width="80%"
        destroyOnClose
        style={{ zIndex: 10 }}
        title="Điểm danh"
        visible={visibleDiemDanh}
        onCancel={() => {
          setVisibleDiemDanh(false);
          setRecordDSSV({} as BuoiHoc.ListSinhVien);
        }}
      >
        <DanhSachSinhVien data={dataDiemDanh} setData={setDataDiemDanh} />
      </Modal>
    </Card>
  );
};
