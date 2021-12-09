/* eslint-disable no-nested-ternary */
import { Descriptions } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ThongTinNguoiTaoDon = (props: { record?: Login.Profile }) => {
  const { loaiDichVu } = useModel('dichvumotcuav2');

  return (
    <Descriptions>
      <Descriptions.Item>
        Họ và tên: {props?.record?.name || props?.record?.hoTen || ''}
      </Descriptions.Item>
      {loaiDichVu === 'DVMC' && (
        <Descriptions.Item>
          Ngày sinh:{' '}
          {props?.record?.ngay_sinh
            ? moment(props?.record?.ngay_sinh)?.format('DD-MM-YYYY')
            : props?.record?.ngaySinh !== 'false'
            ? props?.record?.ngaySinh?.split('-')?.reverse()?.join('-')
            : ''}
        </Descriptions.Item>
      )}
      <Descriptions.Item>
        {loaiDichVu === 'DVMC' ? 'Mã sinh viên' : 'Mã cán bộ'}:{' '}
        {props?.record?.ma_dinh_danh || props?.record?.maSinhVien || ''}
      </Descriptions.Item>
      <Descriptions.Item>
        Khoa:{' '}
        {props?.record?.ten_don_vi
          ? props?.record?.ten_don_vi
          : props?.record?.tenDonVi && props?.record?.tenDonVi !== 'false'
          ? props?.record?.tenDonVi
          : ''}
      </Descriptions.Item>
      {loaiDichVu === 'DVMC' && (
        <>
          <Descriptions.Item>
            Lớp: {props?.record?.lop_hanh_chinh_id?.[1] || props?.record?.tenLopHanhChinh || ''}
          </Descriptions.Item>
          <Descriptions.Item>
            Chuyên ngành: {props?.record?.ten_nganh || props?.record?.tenNganh || ''}
          </Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
};

export default ThongTinNguoiTaoDon;
