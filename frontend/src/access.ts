/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access() {
  const vaiTro = localStorage.getItem('vaiTro');
  const token = localStorage.getItem('token');
  return {
    admin: token && vaiTro && vaiTro === 'Admin',
    giangVien: token && vaiTro && vaiTro === 'giang_vien',
    sinhVien: token && vaiTro && vaiTro === 'sinh_vien',
    quanTri: token && vaiTro && vaiTro === 'quan_tri',
    mentor: token && vaiTro && vaiTro === 'mentor',
    chuyenGiaHT: token && vaiTro && vaiTro === 'chuyen_gia_ht',
    chuyenGiaCN: token && vaiTro && vaiTro === 'chuyen_gia_cn',
    chuyenVien: token && vaiTro && vaiTro === 'chuyen_vien',
    sinhVienVaGiangVien: token && vaiTro && (vaiTro === 'giang_vien' || vaiTro === 'sinh_vien'),
    canBo: token && vaiTro && vaiTro === 'can_bo',
    giangVienVaCanBo: token && vaiTro && (vaiTro === 'giang_vien' || vaiTro === 'can_bo'),
    sinhVienVaGiangVienVaCanBo:
      token && vaiTro && (vaiTro === 'giang_vien' || vaiTro === 'can_bo' || vaiTro === 'sinh_vien'),
  };
}
