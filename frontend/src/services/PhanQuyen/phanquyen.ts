import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

/**
 * thanhpq 27/10/2021
 * get danh sách tất cả nhóm vai trò
 * @param payload condition theo vai trò, vd: can_bo, giang_vien
 * @returns danh sách nhóm vai trò
 */

export async function getAllNhomVaiTro(payload: { condition?: any }) {
  return axios.get(`${ip3}/phan-quyen/nhom-vai-tro/all`, { params: payload });
}

export async function getNhomVaiTro(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/phan-quyen/nhom-vai-tro/paging`, { params: payload });
}

/**
 * thanhpq 27/10/2021
 * thêm 1 nhóm vai trò mới
 * @param payload data nhóm vai trò muốn thêm
 * @returns nhóm vai trò mới
 */

export async function postNhomVaiTro(payload: { _id: string; vaiTro: string }) {
  return axios.post(`${ip3}/phan-quyen/nhom-vai-tro`, payload);
}

/**
 * thanhpq 10/01/2022
 * chỉnh sửa 1 nhóm vai trò
 * @param payload id nhóm vai trò, mảng vai trò muốn chỉnh sửa
 * @returns nhóm vai trò đã chỉnh sửa
 */

export async function putNhomVaiTro(payload: { _id?: string; data: { vaiTro: string[] } }) {
  return axios.put(`${ip3}/phan-quyen/nhom-vai-tro/${payload._id}`, payload.data);
}

/**
 * thanhpq 27/10/2021
 * xóa 1 nhóm vai trò
 * @param payload id nhóm vai trò muốn xóa
 * @returns nhóm vai trò mới
 */

export async function deleteNhomVaiTro(payload: { idNhomVaiTro: string }) {
  return axios.delete(`${ip3}/phan-quyen/nhom-vai-tro/${payload.idNhomVaiTro}`);
}

/**
 * thanhpq 27/10/2021
 * get danh sách tất cả chức năng có thể phân quyền
 * @param payload condition theo vai trò, vd: can_bo, giang_vien
 * @returns danh sách chức năng
 */

export async function getAllChucNang(payload: { condition?: any }) {
  return axios.get(`${ip3}/phan-quyen/chuc-nang/all`, { params: payload });
}

/**
 * thanhpq 27/10/2021
 * get danh sách tất cả loại chức năng có thể phân quyền (mỗi chức năng thuộc một loại chức năng)
 * @returns danh sách loại chức năng
 */

export async function getAllLoaiChucNang() {
  return axios.get(`${ip3}/phan-quyen/loai-chuc-nang/all`);
}

/**
 * thanhpq 28/10/2021
 * phân quyền cho 1 nhóm chức năng
 *
 */
export async function putPhanQuyenChucNangNhomVaiTro(
  payload: { idNhomVaiTro: string; idChucNang: string }[],
) {
  return axios.put(`${ip3}/phan-quyen/nhom-vai-tro-chuc-nang/bulk`, payload);
}

/**
 * thanhpq 29/10/2021
 * get danh sách user để phân nhóm vai trò
 * @returns danh sách user
 */

export async function getUserPhanNhom(payload: {
  page: number;
  limit: number;
  vaiTro: string;
  condition: any;
}) {
  return axios.get(`${ip3}/phan-quyen/odoo-user-phan-nhom/pageable/vai-tro/${payload.vaiTro}`, {
    params: payload,
  });
}

/**
 * thanhpq 29/10/2021
 * gán nhóm vai trò cho 1 user
 *
 */
export async function putUserPhanNhom(payload: {
  userId: string;
  danhSachPhanNhom: PhanQuyen.PhanNhom[];
  vaiTro: string;
  service: 'Odoo' | 'Internal';
}) {
  return axios.put(`${ip3}/phan-quyen/phan-nhom`, payload);
}

/**
 * thanhpq 29/10/2021
 * get danh sách chức năng được phân quyền của user hiện tại
 * @returns danh sách chức năng được phân quyền
 */

export async function getPhanNhomUserCurrent() {
  return axios.get(`${ip3}/phan-quyen/phan-nhom/me`);
}

// export async function getPhanNhomUserCurrent() {
//   return axios.get(`${ip3}/phan-quyen/phan-nhom/me-cu`);
// }

/**
 * thanhpq 30/10/2021
 * get danh sách đối tượng phân nhóm theo mực độ
 * @returns danh sách đối tượng phân nhóm
 */

export async function getDoiTuongPhanNhomByMucDo(mucDo: string) {
  return axios.get(`${ip3}/phan-quyen/doi-tuong-phan-nhom/muc-do/${mucDo}`);
}

/**
 * thanhpq 08/11/2021
 * get danh sách chuyên viên để điều phối đơn 1 cửa
 * @returns danh sách chuyên viên được phép xử lý đơn
 */

export async function getChuyenVienXuLyDon(idDonVi: string) {
  return axios.get(
    `${ip3}/phan-quyen/phan-nhom/user/odoo/all/don-vi/${idDonVi}?nhomVaiTroId=Chuyên viên tiếp nhận`,
  );
}
