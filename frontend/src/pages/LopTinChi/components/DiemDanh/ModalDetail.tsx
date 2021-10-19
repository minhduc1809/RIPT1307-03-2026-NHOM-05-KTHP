import { Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const DetailBuoiHoc = () => {
  const { record } = useModel('diemdanh');

  return (
    <div>
      <b>
        <p>Tên môn học: {record?.ten_hoc_phan || 'Chưa cập nhật'}</p>
        <p>ID phòng học Zoom: {record?.id_zoom || 'Chưa cập nhật'}</p>
        <p>Phòng học: {record?.phong_hoc || 'Chưa cập nhật'}</p>
        <p>
          Tuần {record?.tuan_hoc || ''},{' '}
          {record?.thu_kieu_so !== 6
            ? `Thứ ${typeof record?.thu_kieu_so === 'number' ? record?.thu_kieu_so + 2 : ''}`
            : 'Chủ nhật'}
          , Tiết {record?.tiet_bd}
        </p>
        <p>
          Thời gian bắt đầu:{' '}
          {record?.ngay_gio_hoc
            ? moment(record?.ngay_gio_hoc).format('HH:mm DD/MM/YYYY')
            : 'Chưa cập nhật'}
        </p>
        <p>
          Thời gian kết thúc:{' '}
          {record?.ngay_gio_ket_thuc
            ? moment(record?.ngay_gio_ket_thuc).format('HH:mm DD/MM/YYYY')
            : 'Chưa cập nhật'}
        </p>
        <p>
          Trạng thái:{' '}
          <Tag color={record?.giang_vien_da_diem_danh ? 'green' : 'red'}>
            {record?.giang_vien_da_diem_danh ? 'Đã điểm danh' : 'Chưa điểm danh'}
          </Tag>
        </p>
      </b>
    </div>
  );
};

export default DetailBuoiHoc;
