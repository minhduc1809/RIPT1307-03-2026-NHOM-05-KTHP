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

const Color = {
  'Lịch giảng dạy': '#008080B3',
  'Lịch học': '#008080B3',
  'Lịch thi': '#CC0D00',
  'Cá nhân': '#6b8f24b3',
};

export default () => {
  const eventPropGetter = (event: { title: string; loaiSuKien: string }) => ({
    // style: { backgroundColor: toHexa(event.title) },
    style: { backgroundColor: Color?.[event.loaiSuKien] },
  });

  const onSelectEvent = (record: SuKien.Record) => {
    const { loaiSuKien } = record;
    const vaiTro = localStorage.getItem('vaiTro');
    Modal.info({
      title: 'Chi tiết sự kiện',
      width: '500px',
      // width: '40%',
      maskClosable: true,
      okText: 'Đóng',
      content: (
        <div>
          <b>
            <p>Tên sự kiện: {record?.tenSuKien ?? ''}</p>
            <p>Loại sự kiện: {`${loaiSuKien || 'Chưa cập nhật'}`}</p>
            {!['Cá nhân'].includes(record?.loaiSuKien) && (
              <>
                <p>Tên môn: {record?.info?.ten_hoc_phan ?? ''}</p>
                <p>
                  Link phòng học zoom:{' '}
                  {record?.info?.link_zoom ? (
                    <a target="_blank" href={record?.info?.link_zoom}>
                      Link
                    </a>
                  ) : (
                    ''
                  )}
                </p>
                {vaiTro === 'sinh_vien' && (
                  <>
                    <p>ID phòng học Zoom: {record?.info?.id_zoom ?? ''}</p>
                    <p>Mật khẩu phòng học Zoom: {record?.info?.mat_khau_1}</p>
                  </>
                )}
                {vaiTro === 'giang_vien' && (
                  <>
                    <p>Tên đăng nhập Zoom: {record?.info?.tai_khoan ?? ''}</p>
                    <p>Mật khẩu Zoom: {record?.info?.mat_khau}</p>
                  </>
                )}
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
          {record?.loaiSuKien === 'Lịch học' && (
            <a href={`/loptinchi/${record?.info?.lop_tin_chi_id?.[0]}`}>Chi tiết lớp học</a>
          )}
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
