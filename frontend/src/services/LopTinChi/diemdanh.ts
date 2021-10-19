import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

/**
 * ThanhPQ 19/10/2021
 * get danh sách buổi học theo id lớp tín chỉ
 * @param idLopTinChi id lớp tín chỉ
 * @returns danh sách buổi học của lớp tín chỉ
 */
export async function getDanhSachBuoiHocByIdLopTinChi(idLopTinChi: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLopTinChi}/buoi-hoc`);
}

/**
 * ThanhPQ 19/10/2021
 * giảng viên khởi tạo danh sách điểm danh 1 buổi học theo id buổi học
 * @param idBuoiHoc id buổi học
 * @returns
 */

export async function khoiTaoDiemDanhByIdBuoiHoc(idBuoiHoc: number) {
  return axios.post(`${ip3}/odoo-buoi-hoc/${idBuoiHoc}/giang-vien/diem-danh/khoi-tao`);
}

/**
 * ThanhPQ 19/10/2021
 * giảng viên get danh sách sinh viên để điểm danh theo id buổi học
 * @param idBuoiHoc id buổi học
 * @returns danh sách sinh viên
 */
export async function getDanhSachSinhVienDiemDanh(idBuoiHoc: number) {
  return axios.get(`${ip3}/odoo-buoi-hoc/${idBuoiHoc}/giang-vien/diem-danh
  `);
}

/**
 * ThanhPQ 19/10/2021
 * giảng viên gửi kết quả điểm danh của buổi học
 * @param idBuoiHoc id buổi học
 * @param dataDiemDanh data điểm danh gửi lên
 * @returns
 */
export async function giangVienDiemDanh(
  idBuoiHoc: number,
  dataDiemDanh: { danhSachDiemDanh: { id: number; diem_cong: number; trang_thai: string }[] },
) {
  return axios.put(`${ip3}/odoo-buoi-hoc/${idBuoiHoc}/giang-vien/diem-danh`, dataDiemDanh);
}
