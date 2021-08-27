/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: IRecordLogin.User | undefined }) {
  const { currentUser } = initialState || {};
  return {
    admin: currentUser && currentUser.systemRole === 'Admin',
    giangVien: currentUser && currentUser.vai_tro === 'giang_vien',
    sinhVien: currentUser && currentUser.vai_tro === 'sinh_vien',
    quanTri: currentUser && currentUser.vai_tro === 'quan_tri',
    mentor: currentUser && currentUser.vai_tro === 'mentor',
    chuyenGiaHT: currentUser && currentUser.vai_tro === 'chuyen_gia_ht',
    chuyenGiaCN: currentUser && currentUser.vai_tro === 'chuyen_gia_cn',
    chuyenVien: currentUser && currentUser.vai_tro === 'chuyen_vien',
    sinhVienVaGiangVien:
      currentUser && (currentUser.vai_tro === 'giang_vien' || currentUser.vai_tro === 'sinh_vien'),
  };
}
