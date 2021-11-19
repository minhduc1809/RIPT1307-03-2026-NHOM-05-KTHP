/* eslint-disable no-underscore-dangle */
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

const SuKien = (props: any) => {
  const {
    getModel,
    getBanChinhThucModel,
    danhSach,
    danhSachChinhThuc,
    edit,
    setEdit,
    delModel,
    phatHanhLichTuanModel,
    updModel,
  } = useModel('lichtuan');
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
  const [recordLichTuan, setRecordLichTuan] = useState<LichTuan.Record>({} as any);

  const onCacelModel = () => {
    setVisibleModal(false);
    setRecordLichTuan({} as any);
    setShowModalLichTuan(false);
  };

  let lichTuanFinal: any[] = [];
  if (props.loaiLichTuan === 'nhap') {
    lichTuanFinal = danhSach;
  } else if (props.loaiLichTuan === 'chinhthuc') {
    lichTuanFinal = danhSachChinhThuc;
  }
  const dataLichTuan = lichTuanFinal?.map((event) => ({
    ...event,
    start: moment(event?.thoiGianBatDau).toDate(),
    end: moment(event?.thoiGianKetThuc).toDate(),
    loai: 'lichtuan',
    title: `Lịch tuần: ${event?.noiDungCongViec ?? ''}`,
    desc: event?.diaDiem,
  }));

  const onCancelModelXemLichTuan = () => {
    setShowModalLichTuan(false);
    setRecordLichTuan({} as any);
  };

  const themMoiSuKien = () => {
    setVisibleModal(true);
    setRecordLichTuan({} as any);
    setEdit(false);
  };

  const chinhSuaLichTuan = () => {
    setEdit(true);
    setVisibleModal(true);
  };

  const xoaLichTuan = () => {
    delModel(recordLichTuan._id);
    setShowModalLichTuan(false);
    getBanChinhThucModel();
    getModel();
  };

  const phatHanhLichTuan = (type: boolean) => {
    let weekOfYear = moment(new Date()).week();
    if (type) {
      weekOfYear += 1;
    }
    const year = moment().year();
    phatHanhLichTuanModel(weekOfYear, year);
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
            false
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
                Thêm mới sự kiện
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
            setRecordLichTuan(event);
          }}
          onSelectSlot={() => handleSelect()}
          messages={messages}
          views={['month', 'week']}
          style={{ height: 594 }}
          min={moment('0600', 'HHmm').toDate()}
          max={moment('2300', 'HHmm').toDate()}
          popup
        />
      </Card>

      <Modal visible={visibleModal} footer={null} onCancel={() => onCacelModel()} destroyOnClose>
        <FormLichTuan onCancel={onCacelModel} record={recordLichTuan} edit={edit} />
      </Modal>

      <Modal
        footer={
          props.loaiLichTuan === 'chinhthuc'
            ? false
            : [
                <Button type="primary" onClick={() => chinhSuaLichTuan()}>
                  Sửa
                </Button>,
                <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => xoaLichTuan()}>
                  <Button type="primary">Xóa</Button>
                </Popconfirm>,
                <Button type="default" onClick={() => onCancelModelXemLichTuan()}>
                  Đóng
                </Button>,
              ]
        }
        destroyOnClose
        onCancel={() => setShowModalLichTuan(false)}
        visible={showModalLichTuan}
        title="Lịch tuần Học viện"
      >
        <div>
          <Typography.Paragraph>
            Thời gian bắt đầu: {moment(recordLichTuan?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Thời gian Kết thúc: {moment(recordLichTuan?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
          </Typography.Paragraph>
          <Typography.Paragraph>Địa điểm: {recordLichTuan?.diaDiem ?? ''}</Typography.Paragraph>

          <Typography.Paragraph>
            Nội dung công việc: {recordLichTuan?.noiDungCongViec ?? ''}
          </Typography.Paragraph>
          <Typography.Paragraph>Chủ trì: {recordLichTuan?.chuTri ?? ''}</Typography.Paragraph>
          <Typography.Paragraph>
            Thành phần tham dự: {recordLichTuan?.thanhPhanThamDu ?? ''}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Đơn vị chuẩn bị: {recordLichTuan?.donViChuanBi ?? 'Không có'}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Đơn vị phối hợp: {recordLichTuan?.donViPhoiHop ?? 'Không có'}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Ghi chú: {recordLichTuan?.ghiChu ?? 'Không có'}
          </Typography.Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default SuKien;
