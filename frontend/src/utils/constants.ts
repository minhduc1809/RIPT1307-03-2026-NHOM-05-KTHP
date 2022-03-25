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
  ChuyenVien = 'ChuyenVien',
  ThiSinh = 'ThiSinh',
  PhuHuynh = 'PhuHuynh',
  Guest = 'Guest',
}

export enum Gender {
  Nam = 'Nam',
  Nu = 'Nữ',
  Khac = 'Khác',
}

export enum LoaiNoiSinh {
  TRONG_NUOC = 'TRONG_NUOC',
  NUOC_NGOAI = 'NUOC_NGOAI',
}
export const arrKhuVucUuTien = ['KV1', 'KV2_NT', 'KV2', 'KV3'];

export const hanhKiem = ['Tốt', 'Khá', 'Trung bình', 'Yếu'];

export const ToHopXetTuyen = {
  A00: ['Toán học', 'Vật lý', 'Hóa học'],
  A01: ['Toán học', 'Vật lý', 'Tiếng Anh'],
  D01: ['Ngữ văn', 'Toán học', 'Tiếng Anh'],
};

export const MonToHop = {
  'Toán học': 'tongKetToan',
  'Vật lý': 'tongKetLy',
  'Hóa học': 'tongKetHoa',
  'Ngữ văn': 'tongKetVan',
  'Tiếng Anh': 'tongKetNgoaiNgu',
  // 'Lịch sử': 'tongKetSu',
  // 'Địa lý': 'tongKetDia',
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

export enum ELoaiPhuongThucTuyenSinh {
  XET_TUYEN_THANG_BGD = 'Xét tuyển thăng BGD',
  THI_THPT = 'Thi THPT',
  KET_HOP = 'Kết hợp',
}

export enum EMonHoc {
  TOAN = 'Toán học',
  VAT_LY = 'Vật lý',
  DIA_LY = 'Địa lý',
  DIA_LI = 'Địa lí',
  HOA = 'Hóa học',
  TIN = 'Tin học',
  SINH = 'Sinh học',
  SU = 'Lịch sử',
  GDCD = 'Giáo dục công dân',
  // CN = 'Tiếng Trung Quốc',
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
  chuakhoa = 'Chưa khóa',
  dakhoa = 'Đã khóa',
  khongtiepnhan = 'Không tiếp nhận',
  datiepnhan = 'Đã tiếp nhận',
  darasoat = 'Đã rà soát',
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
