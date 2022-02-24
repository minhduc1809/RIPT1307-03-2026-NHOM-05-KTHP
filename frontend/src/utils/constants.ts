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

export const khuVucUuTien = [
  { value: 'KV1', label: 'KV1' },
  { value: 'KV2_NT', label: 'KV2-NT' },
  { value: 'KV2', label: 'KV2' },
  { value: 'KV3', label: 'KV3' },
];

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
  'Lịch sử': 'tongKetSu',
  'Địa lý': 'tongKetDia',
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
