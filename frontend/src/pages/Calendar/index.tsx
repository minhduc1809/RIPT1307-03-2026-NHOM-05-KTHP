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
  showMore: (total: number) => `+ Xem thêm (${total})`,
};

export default () => {
  const eventPropGetter = (event: { title: string }) => ({
    style: { backgroundColor: toHexa(event.title) },
  });

  const onSelectEvent = (record: SuKien.Record) => {
    const { loaiSuKien } = record;
    Modal.info({
      title: 'Chi tiết sự kiện',
      // width: '40%',
      maskClosable: true,
      okText: 'Đóng',
      content: (
        <div>
          <b>
            <p>Tên sự kiện: {record?.info?.mon_hoc_id?.[1] ?? ''}</p>
            <p>Loại sự kiện: {`${loaiSuKien || 'Chưa cập nhật'}`}</p>
            <p>Tên môn học: {record?.info?.mon_hoc_id?.[1] ?? ''}</p>
            <p>Mã môn học: {record?.info?.mon_hoc_id?.[0]}</p>
            <p>Tiết bắt đầu: {record?.info?.tiet_bd ?? ''}</p>
            <p>Tiết kết thúc: {record?.info?.tiet_bd + record?.info?.so_tiet}</p>
          </b>
        </div>
      ),
    });
  };
  const eventCustom = ({ event }: any) => {
    const { title, loaiSuKien } = event;
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
      title: x?.info?.mon_hoc_id?.[1],
      start: moment(x?.thoiGianBatDau).toDate(),
      end: moment(x?.thoiGianKetThuc).toDate(),
    }),
  );
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
