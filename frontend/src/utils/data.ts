const data: any = {
  path: {
    sinh_vien: '/chuongtrinhkhung',
    giang_vien: '/calendar',
    Admin: '/danhmuc/chudechung',
  },
  doiTuong: ['Vai trò', 'Tất cả'],
  vaiTro: [
    { value: 'sinh_vien', text: 'Sinh viên' },
    { value: 'giang_vien', text: 'Giảng viên' },
  ],
  'info.anToan': [
    { value: false, text: 'Không an toàn' },
    { value: true, text: 'An toàn' },
  ],

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
    BAD_REQUEST_ID_EXISTED: 'Mã chủ đề đã tồn tại',
  },
};

export default data;
