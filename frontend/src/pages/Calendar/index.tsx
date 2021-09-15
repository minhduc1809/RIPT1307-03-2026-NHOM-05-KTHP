import { toHexa } from '@/utils/utils';
import { Card, Modal } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';

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
  showMore: (total: any) => `+ Xem thêm (${total})`,
};

export default () => {
  const eventPropGetter = (event: { title: string }) => ({
    style: { backgroundColor: toHexa(event.title) },
  });

  const onSelectEvent = (record: any) => {
    const {
      title,
      info: { ma_mon_hoc, ten_mon_hoc, loai_hinh, tiet_bat_dau, tiet_ket_thuc },
      loaiSuKien,
    } = record;
    Modal.info({
      title: 'Chi tiết sự kiện',
      // width: '40%',
      maskClosable: true,
      okText: 'Đóng',
      content: (
        <div>
          <p>
            {' '}
            <b>Tên sự kiện:</b> {`${title || 'Chưa cập nhật'}\n\n`}
            <b>Loại sự kiện:</b> {`${loaiSuKien || 'Chưa cập nhật'}\n\n`}
          </p>
          <b>
            <p>Loại hình: {loai_hinh}</p>
            <p>Tên môn học: {ten_mon_hoc}</p>
            <p>Mã môn học: {ma_mon_hoc}</p>
            <p>Tiết bắt đầu: {tiet_bat_dau}</p>
            <p>Tiết kết thúc: {tiet_ket_thuc}</p>
          </b>
        </div>
      ),
    });
  };
  const eventCustom = ({ event }: any) => {
    const {
      title,
      // info: { ma_mon_hoc, ten_mon_hoc, loai_hinh, tiet_bat_dau, tiet_ket_thuc },
      loaiSuKien,
    } = event;
    return (
      <div style={{ width: '100%', fontSize: 13 }}>
        <p>
          {' '}
          <p>Tên sự kiện: {`${title || 'Chưa cập nhật'}\n\n`} </p>
          <p>Loại sự kiện: {`${loaiSuKien || 'Chưa cập nhật'}\n\n`}</p>
        </p>
      </div>
    );
  };
  const localizer = momentLocalizer(moment);
  const { danhSachSuKien, getSuKienSinhVienByNamModel } = useModel('sukien');

  useEffect(() => {
    getSuKienSinhVienByNamModel(new Date().getFullYear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dataCalendar: { title: string; [x: string]: unknown }[] | undefined = [];
  danhSachSuKien?.forEach((x: SuKien.Record) =>
    dataCalendar.push({
      ...x,
      title: x?.info?.ten_buoi_hoc,
      start: moment(x?.thoiGianBatDau).subtract(new Date().getTimezoneOffset(), 'minutes').toDate(),
      end: moment(x?.thoiGianKetThuc).subtract(new Date().getTimezoneOffset(), 'minutes').toDate(),
    }),
  );
  // console.log('dataCalendar :>> ', dataCalendar);
  return (
    <div style={{ height: 600 }}>
      <Card bordered>
        <Calendar
          localizer={localizer}
          events={dataCalendar}
          defaultView={Views.WEEK}
          scrollToTime={new Date(1970, 1, 1)}
          defaultDate={new Date()}
          messages={messages}
          views={['month', 'week', 'day']}
          style={{ height: 600 }}
          min={moment('0000', 'HHmm').toDate()}
          max={moment('2300', 'HHmm').toDate()}
          eventPropGetter={eventPropGetter}
          onSelectEvent={(record: any) => onSelectEvent(record)}
          components={{ event: (event: any) => eventCustom(event) }}
          popup
        />
      </Card>
    </div>
  );
};
