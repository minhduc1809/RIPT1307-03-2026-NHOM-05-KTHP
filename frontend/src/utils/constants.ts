export const doiTuongUuTienTuyenSinh = [
  'Không thuộc diện ưu tiên',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
];

export enum EKhuVucUuTien {
  KV1 = 'KV1',
  'KV2-NT' = 'KV2_NT',
  KV2 = 'KV2',
  KV3 = 'KV3',
}

export enum ESystemRole {
  Admin = 'Admin',
  QuanTriVien = 'QuanTriVien',
  ThiSinh = 'ThiSinh',
  PhuHuynh = 'PhuHuynh',
  Guest = 'Guest',
}

export enum Role {
  nhan_vien = 'Cán bộ, giảng viên',
  sinh_vien = 'Sinh viên',
  Admin = 'Quản trị viên hệ thống',
  quan_tri = 'Quản trị viên đơn vị',
}

export const MapKeyRole = {
  Admin: 'Admin',
  QuanTriVien: 'Quản trị viên',
  ThiSinh: 'Thí sinh',
  PhuHuynh: 'Phụ huynh',
  Guest: 'Khách',
};

export enum Gender {
  Nam = 'Nam',
  Nu = 'Nữ',
  Khac = 'Khác',
}

export enum LoaiNoiSinh {
  TRONG_NUOC = 'TRONG_NUOC',
  NUOC_NGOAI = 'NUOC_NGOAI',
}

export const MapKeyLoaiNoiSinh = {
  TRONG_NUOC: 'Trong nước',
  NUOC_NGOAI: 'Nước ngoài',
};
export const arrKhuVucUuTien = ['KV1', 'KV2_NT', 'KV2', 'KV3'];

export const hanhKiem = ['Tốt', 'Khá', 'Trung bình', 'Yếu'];

export const ToHopXetTuyen = {
  A00: ['Toán học', 'Vật lý', 'Hóa học'],
  A01: ['Toán học', 'Vật lý', 'Tiếng Anh'],
  C00: ['Ngữ văn', 'Lịch sử', 'Địa lý'],
  C01: ['Ngữ văn', 'Toán học', 'Vật lý'],
  C02: ['Ngữ văn', 'Toán học', 'Hóa học'],
  D01: ['Ngữ văn', 'Toán học', 'Tiếng Anh'],
  D02: ['Ngữ văn', 'Toán học', 'Tiếng Nga'],
  D03: ['Ngữ văn', 'Toán học', 'Tiếng Pháp'],
  D04: ['Ngữ văn', 'Toán học', 'Tiếng Trung'],
  D06: ['Ngữ văn', 'Toán học', 'Tiếng Nhật'],
  D07: ['Toán học', 'Hóa học', 'Tiếng Anh'],
  D09: ['Toán học', 'Lịch sử', 'Tiếng Anh'],
};

export enum EToHopXetTuyen {
  A00 = 'A00',
  A01 = 'A01',
  C00 = 'C00',
  C01 = 'C01',
  C02 = 'C02',
  D01 = 'D01',
  D02 = 'D02',
  D03 = 'D03',
  D04 = 'D04',
  D06 = 'D06',
  D07 = 'D07',
  D09 = 'D09',
}

export const MonToHop = {
  'Toán học': 'tongKetToan',
  'Vật lý': 'tongKetLy',
  'Hóa học': 'tongKetHoa',
  'Ngữ văn': 'tongKetVan',
  'Tiếng Anh': 'tongKetNgoaiNgu',
  'Lịch sử': 'tongKetSu',
  'Địa lý': 'tongKetDia',
  'Tổng kết': 'diemTBC',
  'Hạnh kiểm': 'hanhKiem',
};

export enum ELoaiChungChiQuocTe {
  SAT = 'SAT',
  ACT = 'ACT',
}

export enum ELoaiChungChiNgoaiNgu {
  IELTS = 'IELTS',
  TOEFL_IBT = 'TOEFL iBT',
  TOEFL_ITP = 'TOEFL ITP',
}

export enum EHinhThucThanhToan {
  BIDV_SMART_BANKING = 'BIDV_SMART_BANKING',
  TRUYEN_THONG = 'TRUYEN_THONG',
}

export const MapKeyHinhThucThanhToan = {
  BIDV_SMART_BANKING: 'BIDV Smart Banking',
  TRUYEN_THONG: 'Truyền thống',
};

export enum ELoaiChungChiTiengAnh {
  IELTS = 'IELTS',
  TOEFL_IBT = 'TOEFL iBT',
  TOEFL_ITP = 'TOEFL ITP',
  TOEIC = 'TOEIC',
  TOEFL_CBT = 'TOEFL_CBT',
}

export enum ETrangThaiThanhToan {
  CHUA_THANH_TOAN_DU = 'Chưa thanh toán đủ',
  DA_THANH_TOAN_DU = 'Đã thanh toán đủ',
}

export enum TrangThaiThanhToan {
  open = 'Chưa thanh toán đủ',
  paid = 'Đã thanh toán đủ',
  overpaid = 'Thanh toán thừa',
}

export enum ELoaiChungChiTiengPhap {
  DELF = 'DELF',
  DALF = 'DALF',
}

export enum EBacChungChiTiengPhap {
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum ELoaiNgoaiNgu {
  ANH = 'Tiếng Anh',
  PHAP = 'Tiếng Pháp',
  TRUNG = 'Tiếng Trung Quốc',
  NGA = 'Tiếng Nga',
  NHAT = 'Tiếng Nhật',
}

export enum ELoaiGiaiHSG {
  QUOC_GIA = 'Quốc gia',
  TINH_TP = 'Tỉnh TP',
}

export enum EThoiGianTotNghiep {
  HIEN_TAI = 'HIEN_TAI',
  TRUOC_HIEN_TAI = 'TRUOC_HIEN_TAI',
}

export const MapKeyNgonNgu = {
  thongTinChungChiTiengAnh: ELoaiNgoaiNgu.ANH,
  thongTinChungChiTiengPhap: ELoaiNgoaiNgu.PHAP,
};

export const MapKeyGiaiHSG = {
  thongTinGiaiQuocGia: ELoaiGiaiHSG.QUOC_GIA,
  thongTinGiaiTinhTP: ELoaiGiaiHSG.TINH_TP,
};

export const MaxMinDiemChungChiNgoaiNgu = {
  IELTS: { max: 9, min: 0 },
  'TOEFL iBT': { max: 120, min: 0 },
  'TOEFL ITP': { max: 677, min: 310 },
};

export const MaxMinDiemChungChiQuocTe = {
  SAT: { max: 1600, min: 400 },
  ACT: { max: 36, min: 1 },
};

export enum EMonThiHSG {
  TOAN = 'Toán học',
  VAT_LY = 'Vật lý',
  HOA = 'Hóa học',
  TIN = 'Tin học',
  ENG = 'Tiếng Anh',
}

export enum ETrangThaiTrungTuyen {
  TRUNG_TUYEN = 'Trúng tuyển',
  KHONG_TRUNG_TUYEN = 'Không trúng tuyển',
}

export enum ETrangThaiXacNhanNhapHoc {
  CHUA_XAC_NHAN = 'Chưa xác nhận nhập học',
  XAC_NHAN = 'Xác nhận nhập học',
  KHONG_XAC_NHAN = 'Không xác nhận nhập học',
  DA_TIEP_NHAN = 'Đã tiếp nhận xác nhận nhập học',
  KHONG_TIEP_NHAN = 'Không tiếp nhận xác nhận nhập học',
}

export enum ETrangThaiNhapHoc {
  DA_KHOA = 'Đã khóa hồ sơ nhập học',
  CHUA_KHOA = 'Chưa khóa hồ sơ nhập học',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa hồ sơ nhập học',
  DA_TIEP_NHAN = 'Đã tiếp nhận hồ sơ nhập học',
}

export const MapKeyTrangThaiXacNhanNhapHoc = {
  'Xác nhận': 'Đã xác nhận nhập học',
  'Chưa xác nhận': 'Chưa xác nhận nhập học',
  'Không xác nhận': 'Không xác nhận nhập học',
  'Đã tiếp nhận': 'Đã tiếp nhận',
  'Không tiếp nhận': 'Không tiếp nhận',
};

export enum EModeKhoiTao {
  SO_LUONG = 'SO_LUONG',
  DIEM_SAN = 'DIEM_SAN',
}

export enum ETenTruongThongTin {
  THONG_TIN_HOC_TAP_THPT = 'thongTinHocTapTHPT',
  THONG_TIN_CHUNG_CHI_QUOC_TE = 'thongTinChungChiQuocTe',
  THONG_TIN_CHUNG_CHI_NGOAI_NGU = 'thongTinChungChiNgoaiNgu',
  THONG_TIN_CHUNG_CHI_TIENG_ANH = 'thongTinChungChiTiengAnh',
  THONG_TIN_CHUNG_CHI_TIENG_PHAP = 'thongTinChungChiTiengPhap',
  THONG_TIN_CHUNG_CHI_TIENG_TRUNG = 'thongTinChungChiTiengTrung',
  THONG_TIN_CHUNG_CHI_TIENG_NHAT = 'thongTinChungChiTiengNhat',
  THONG_TIN_GIAI_QUOC_GIA = 'thongTinGiaiQuocGia',
  THONG_TIN_GIAI_TINH_TP = 'thongTinGiaiTinhTP',
  THONG_TIN_GIAI_KHKT = 'thongTinGiaiKHKT',
  THONG_TIN_KET_QUA_DANH_GIA_NANG_LUC = 'thongTinKetQuaDanhGiaNangLuc',
  THONG_TIN_KET_QUA_THI_THPT = 'thongTinKetQuaThiTHPT',
  THONG_TIN_GIAY_TO_NOP_ONLINE = 'thongTinGiayToNopOnline',
}

export enum EGiaiHSG {
  // KK_QG = 'Khuyến khích Quốc gia',
  // TD_QG = 'Tham dự Quốc gia',
  // BA_T_TP = 'Giải Ba Tỉnh/Thành phố',
  // NHI = 'Giải Nhì Tỉnh/Thành phố',
  // NHAT = 'Giải Nhất Tỉnh/Thành phố',
  BA_TINH_TP = 'Giải Ba cấp Tỉnh/TP trực thuộc TW',
  NHI_TINH_TP = 'Giải Nhì cấp Tỉnh/TP trực thuộc TW',
  NHAT_TINH_TP = 'Giải Nhất cấp Tỉnh/TP trực thuộc TW',
  TD_QG = 'Tham dự thi cấp Quốc gia',
  KK_QG = 'Khuyến khích cấp Quốc gia',
  BA_QG = 'Giải Ba cấp Quốc gia',
  NHI_QG = 'Giải Nhì cấp Quốc gia',
  NHAT_QG = 'Giải Nhất Quốc gia',
}

export const giaiHSG = {
  thongTinGiaiQuocGia: ['Giải Nhất', 'Giải Nhì', 'Giải Ba', 'Khuyến khích', 'Tham gia'],
  thongTinGiaiTinhTP: ['Giải Nhất', 'Giải Nhì', 'Giải Ba'],
};

export const DoiTuongXetTuyen = [
  {
    value: 0,
    name: 'Sử dụng Chứng chỉ quốc tế (SAT, ACT)',
  },
  {
    value: 1,
    name: 'Sử dụng Chứng chỉ tiếng Anh quốc tế (IELTS, TOEFL iBT, TOEFL ITP)',
  },
  {
    value: 2,
    name: 'Đạt giải học sinh giỏi cấp Tỉnh/quốc gia',
  },
  {
    value: 3,
    name: 'Học sinh hệ chuyên (Toán, Lý, Hóa, Tin học)',
  },
];

export enum ELoaiDot {
  DE_AN_RIENG = 'Đề án riêng',
  KHAC = 'Khác',
}

export enum EHinhThucDangKyXetTuyen {
  THEO_PHUONG_THUC = 'Theo phương thức',
  THEO_DOT = 'Theo đợt',
}

export enum EMonHoc {
  TOAN = 'Toán học',
  VAT_LY = 'Vật lý',
  DIA_LY = 'Địa lý',
  HOA = 'Hóa học',
  TIN = 'Tin học',
  SINH = 'Sinh học',
  SU = 'Lịch sử',
  GDCD = 'Giáo dục công dân',
  VAN = 'Ngữ văn',
  ENG = 'Tiếng Anh',
  RUS = 'Tiếng Nga',
  FRA = 'Tiếng Pháp',
  JPN = 'Tiếng Nhật',
  CHN = 'Tiếng Trung Quốc',
  KOR = 'Tiếng Hàn',
  GER = 'Tiếng Đức',
  ESP = 'Tiếng Tây Ban Nha',
  EMPTY = '',
}

export enum EDonViTinh {
  NGUYEN_VONG = 'Nguyện vọng',
  HO_SO = 'Hồ sơ',
}

export enum ETrangThaiHoSo {
  CHUA_KHOA = 'Chưa khóa',
  DA_KHOA = 'Đã khóa',
  KHONG_TIEP_NHAN = 'Không tiếp nhận',
  DA_TIEP_NHAN = 'Đã tiếp nhận',
}

export const Setting = {
  navTheme: 'dark',
  primaryColor: '#CC0D00',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Xét tuyển PTIT',
  pwa: false,
  logo: '/favicon.ico',
  iconfontUrl: '',
};
