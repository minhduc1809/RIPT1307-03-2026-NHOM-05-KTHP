const data: any = {
  trangThai: [
    { value: 'PROCESSING', text: 'Đang xử lý' },
    { value: 'OK', text: 'Đã duyệt' },
    { value: 'NOT_OK', text: 'Không duyệt' },
  ],
  path: {
    sinh_vien: '/hosothisinh/dottuyensinh',
    nhan_vien: '/dashboard',
    Admin: '/baivietchung',
    quan_tri: '/dashboard',
  },
  doiTuong: ['Vai trò', 'Tất cả'],
  vaiTro: [
    { value: 'sinh_vien', text: 'Sinh viên' },
    { value: 'nhan_vien', text: 'Cán bộ, giảng viên' },
  ],
  gioiTinh: ['Nam', 'Nữ'],
  'info.anToan': [
    { value: false, text: 'Không an toàn' },
    { value: true, text: 'An toàn' },
  ],

  loaiHinhDaoTao: ['Đại học Chính quy', 'Đại học Phi chính quy', 'Sau Đại học', 'Liên kết quốc tế'],

  loaiDonVi: ['Đơn vị cứng', 'Đơn vị mềm'],

  CapDonVi: {
    'Bộ môn': { Trưởng: 'Trưởng bộ môn', Phó: 'Phó trưởng bộ môn', 'Cán bộ': 'Cán bộ' },
    Phòng: { Trưởng: 'Trưởng phòng', Phó: 'Phó trưởng phòng', 'Cán bộ': 'Cán bộ' },
    Khoa: { Trưởng: 'Trưởng khoa', Phó: 'Phó trưởng khoa', 'Cán bộ': 'Cán bộ' },
    'Trung tâm': {
      Trưởng: 'Giám đốc trung tâm',
      Phó: 'Phó giám đốc trung tâm',
      'Cán bộ': 'Cán bộ',
    },
    Viện: { Trưởng: 'Viện trưởng', Phó: 'Phó viện trưởng', 'Cán bộ': 'Cán bộ' },
    'Học viện': { Trưởng: 'Giám đốc', Phó: 'Phó giám đốc', 'Cán bộ': 'Cán bộ' },
    'Hội đồng trường': { Trưởng: 'Chủ tịch', Phó: 'Phó chủ tịch', 'Cán bộ': 'Cán bộ' },
    'Trung tâm nhỏ': {
      Trưởng: 'Trưởng trung tâm',
      Phó: 'Phó trưởng trung tâm',
      'Cán bộ': 'Cán bộ',
    },
  },

  error: {
    BAD_REQUEST_DEVICE_IDENDIFIED: 'BAD_REQUEST_DEVICE_IDENDIFIED',
    BAD_REQUEST_WRONG_PASSWORD: 'Sai mật khẩu',
    BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID: 'BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID',
    BAD_REQUEST_CLIENT_DEVICE_ID_EXIST: 'BAD_REQUEST_CLIENT_DEVICE_ID_EXIST',
    BAD_REQUEST_WRONG_OLD_PASSWORD: 'Mật khẩu cũ không đúng',
    BAD_REQUEST_DUPLICATE_NEW_PASSWORD: 'Mật khẩu mới giống mật khẩu cũ',
    BAD_REQUEST_DUPLICATE_EMAIL: 'Đã tồn tại tài khoản sử dụng email này',
    UNAUTHORIZED_WRONG_PASSWORD: 'Tên tài khoản hoặc mật khẩu chưa chính xác',
    UNAUTHORIZED_USERNAME_NOT_FOUND: 'Tên tài khoản hoặc mật khẩu chưa chính xác',
    BAD_REQUEST_ID_EXISTED: 'Mã đã tồn tại',
    BAD_REQUEST_STILL_PROCESSING:
      'Đơn của bạn đang được xử lý. Vui lòng không tạo thêm yêu cầu mới.',
  },
};

export default data;
