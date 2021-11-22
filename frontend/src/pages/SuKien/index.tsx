/* eslint-disable no-underscore-dangle */
import {
  CheckCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import FormLichTuan from './FormLichTuan';

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

const tmp: any = Calendar;

const DnDCalendar = withDragAndDrop(tmp);

const colorLichTuan = {
  'Chờ duyệt': '#ff4d4f',
  'Đã duyệt': '#1890ff',
  'Không duyệt': '#cacaca',
};

const SuKien = (props: any) => {
  const {
    getModel,
    getBanChinhThucModel,
    danhSach,
    danhSachChinhThuc,
    setEdit,
    delModel,
    phatHanhLichTuanModel,
    updModel,
    setRecord,
    record,
    loading,
    exportLichTuanModel,
  } = useModel('lichtuan');

  const [week, setWeek] = useState<number>(moment(new Date()).week());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [view, setView] = useState<string>('week');

  useEffect(() => {
    if (props.loaiLichTuan === 'nhap') {
      getModel();
    } else if (props.loaiLichTuan === 'chinhthuc') {
      getBanChinhThucModel();
    }
  }, []);
  const localizer = momentLocalizer(moment);

  const [visibleModal, setVisibleModal] = useState(false);
  const [showModalLichTuan, setShowModalLichTuan] = useState(false);

  const onCancelModel = () => {
    setVisibleModal(false);
  };

  let lichTuanFinal: any[] = [];
  if (props.loaiLichTuan === 'nhap') {
    lichTuanFinal = danhSach;
  } else if (props.loaiLichTuan === 'chinhthuc') {
    lichTuanFinal = danhSachChinhThuc?.map((item) => ({ ...item, chuaPhatHanh: false }));
  }
  const dataLichTuan = lichTuanFinal?.map((event) => ({
    ...event,
    start: moment(event?.thoiGianBatDau).toDate(),
    end: moment(event?.thoiGianKetThuc).toDate(),
    loai: 'lichtuan',
    title: (
      <div>
        {event?.chuaPhatHanh === false && <CheckCircleOutlined style={{ marginRight: 4 }} />}
        {`Lịch tuần: ${event?.noiDungCongViec ?? ''}`}
      </div>
    ),
    desc: event?.diaDiem,
  }));

  const eventPropGetter = (event: any) => {
    return {
      style: {
        backgroundColor: colorLichTuan?.[event?.trangThai],
        border: `1px solid ${colorLichTuan?.[event?.trangThai]}`,
      },
    };
  };

  const themMoiSuKien = () => {
    setVisibleModal(true);
    setRecord({} as LichTuan.Record);
    setEdit(false);
  };

  const chinhSuaLichTuan = () => {
    setEdit(true);
    setVisibleModal(true);
  };

  const xoaLichTuan = () => {
    delModel(record?._id);
    setShowModalLichTuan(false);
    getBanChinhThucModel();
    getModel();
  };

  const exportLichTuan = () => {
    exportLichTuanModel(week, year);
  };

  const handleDuyet = (trangThai: string) => {
    updModel({
      trangThai,
      _id: record?._id,
    });
    setShowModalLichTuan(false);
  };

  const phatHanhLichTuan = (type: boolean) => {
    let weekOfYear = moment(new Date()).week();
    if (type) {
      weekOfYear += 1;
    }
    const currentYear = moment().year();
    phatHanhLichTuanModel(weekOfYear, currentYear);
  };

  const handleSelect = () => {
    if (props.loaiLichTuan === 'chinhthuc') return;
    themMoiSuKien();
  };

  const moveEvent = (event: any) => {
    const ngayBatDau = event.start.toISOString();
    const ngayKetThuc = event.end.toISOString();

    if (props.loaiLichTuan === 'chinhthuc') return;

    updModel({
      _id: event.event?._id,
      noiDungCongViec: event.event?.noiDungCongViec,
      thoiGianBatDau: ngayBatDau,
      thoiGianKetThuc: ngayKetThuc,
      diaDiem: event.event?.diaDiem,
      chuTri: event.event?.chuTri,
      thanhPhanThamDu: event.event?.thanhPhanThamDu,
      donViChuanBi: event.event?.donViChuanBi,
      donViPhoiHop: event.event?.donViPhoiHop,
      ghiChu: event.event?.ghiChu,
    });
  };

  return (
    <div style={{ marginLeft: 12, marginRight: 12, marginTop: 24 }}>
      <Card
        bordered={false}
        title={
          props.loaiLichTuan === 'chinhthuc' ? (
            <Button
              type="primary"
              disabled={view !== 'week'}
              onClick={exportLichTuan}
              loading={loading}
              style={{ float: 'left', fontWeight: 'bold' }}
            >
              Xuất lịch tuần
            </Button>
          ) : (
            <div style={{ fontWeight: 'bold' }}>
              <Button
                style={{
                  float: 'left',
                  fontWeight: 'bold',
                }}
                type="primary"
                onClick={() => themMoiSuKien()}
              >
                Thêm mới cuộc họp
              </Button>
              <Popconfirm
                onConfirm={() => phatHanhLichTuan(true)}
                title="Bạn có chắc chắn muốn phát hành lịch tuần tới?"
              >
                <Button style={{ float: 'left', fontWeight: 'bold', marginLeft: 8 }} type="default">
                  Phát hành lịch tuần
                </Button>
              </Popconfirm>
              <Popconfirm
                onConfirm={() => phatHanhLichTuan(false)}
                title="Bạn có chắc chắn muốn phát hành lại lịch tuần này?"
              >
                <Button style={{ float: 'right', fontWeight: 'bold' }} type="primary">
                  Phát hành lại
                </Button>
              </Popconfirm>
            </div>
          )
        }
      >
        <DnDCalendar
          onView={(viewType) => {
            setView(viewType);
          }}
          onNavigate={
            props.loaiLichTuan === 'chinhthuc'
              ? (newDate) => {
                  const weekCurrent: number = moment(newDate).week();
                  const yearCurrent: number = moment(newDate).year();
                  setWeek(weekCurrent);
                  setYear(yearCurrent);
                }
              : () => {}
          }
          localizer={localizer}
          selectable
          events={dataLichTuan}
          defaultView={Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          onEventDrop={moveEvent}
          onEventResize={moveEvent}
          onSelectEvent={(event: any) => {
            setShowModalLichTuan(true);
            setRecord(event);
          }}
          onSelectSlot={() => handleSelect()}
          messages={messages}
          views={['month', 'week']}
          style={{ height: 594 }}
          min={moment('0600', 'HHmm').toDate()}
          max={moment('2300', 'HHmm').toDate()}
          popup
          eventPropGetter={eventPropGetter}
        />
      </Card>

      <Modal
        bodyStyle={{ padding: 0 }}
        visible={visibleModal}
        footer={null}
        onCancel={() => onCancelModel()}
        destroyOnClose
      >
        <FormLichTuan onCancel={onCancelModel} />
      </Modal>

      <Modal
        footer={
          props.loaiLichTuan === 'chinhthuc' ? (
            false
          ) : (
            <>
              {['Chờ duyệt', 'Không duyệt'].includes(record?.trangThai ?? '') && (
                <Button
                  onClick={() => {
                    handleDuyet('Đã duyệt');
                  }}
                  style={{ backgroundColor: '#1890ff', border: '1px solid #1890ff', color: '#fff' }}
                  icon={<CheckOutlined />}
                >
                  Duyệt
                </Button>
              )}
              {['Đã duyệt', 'Chờ duyệt'].includes(record?.trangThai ?? '') && (
                <Button
                  onClick={() => {
                    handleDuyet('Không duyệt');
                  }}
                  style={{ backgroundColor: '#CC0D00', border: '1px solid #CC0D00', color: '#fff' }}
                  icon={<StopOutlined />}
                >
                  Không duyệt
                </Button>
              )}
              <Button icon={<EditOutlined />} onClick={() => chinhSuaLichTuan()}>
                Sửa
              </Button>

              <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => xoaLichTuan()}>
                <Button icon={<DeleteOutlined />} type="primary">
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )
        }
        destroyOnClose
        onCancel={() => setShowModalLichTuan(false)}
        visible={showModalLichTuan}
        title="Lịch tuần Học viện"
      >
        <div>
          <Typography.Paragraph>
            Thời gian bắt đầu: {moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Thời gian Kết thúc: {moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
          </Typography.Paragraph>
          <Typography.Paragraph>Địa điểm: {record?.diaDiem ?? ''}</Typography.Paragraph>

          <Typography.Paragraph>
            Nội dung công việc: {record?.noiDungCongViec ?? ''}
          </Typography.Paragraph>
          <Typography.Paragraph>Chủ trì: {record?.chuTri ?? ''}</Typography.Paragraph>
          <Typography.Paragraph>
            Thành phần tham dự: {record?.thanhPhanThamDu ?? ''}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Đơn vị chuẩn bị: {record?.donViChuanBi ?? 'Không có'}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Đơn vị phối hợp: {record?.donViPhoiHop ?? 'Không có'}
          </Typography.Paragraph>
          <Typography.Paragraph>Ghi chú: {record?.ghiChu ?? 'Không có'}</Typography.Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default SuKien;
