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
            <p>Tên sự kiện: {record?.tenSuKien ?? ''}</p>
            <p>Loại sự kiện: {`${loaiSuKien || 'Chưa cập nhật'}`}</p>
            {record?.loaiSuKien === 'Lịch học' && (
              <>
                <p>Tên môn học: {record?.info?.ten_hoc_phan ?? ''}</p>
                <p>ID phòng học Zoom: {record?.info?.id_zoom ?? ''}</p>
              </>
            )}
            <p>
              Thời gian bắt đầu:{' '}
              {record?.thoiGianBatDau
                ? moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
                : 'Chưa cập nhật'}
            </p>
            <p>
              Thời gian kết thúc:{' '}
              {record?.thoiGianKetThuc
                ? moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
                : 'Chưa cập nhật'}
            </p>
          </b>
        </div>
      ),
    });
  };
  const eventCustom = ({ event }: any) => {
    const { title, loaiSuKien } = event;
    return (
      <div style={{ width: '100%', fontSize: 13 }}>
        {`${loaiSuKien || ''}`} - {`${title || 'Chưa cập nhật'}`}{' '}
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
      title: x?.tenSuKien ?? '',
      start: moment(x?.thoiGianBatDau).toDate(),
      end: moment(x?.thoiGianKetThuc).toDate(),
    }),
  );
  return (
    <Card bordered>
      <Calendar
        localizer={localizer}
        events={dataCalendar}
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
    </Card>
  );
};
