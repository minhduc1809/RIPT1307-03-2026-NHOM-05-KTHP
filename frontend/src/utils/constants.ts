export enum Role {
  giang_vien = 'Giảng viên',
  can_bo = 'Cán bộ',
}

export enum ElementTemplateType {
  TEXT_INPUT = 'Nhập Text 1 dòng',
  TEXT_AREA = 'Nhập Text nhiều dòng',
  INPUT_NUMBER = 'Nhập số',
  DATE_PICKER = 'Chọn ngày tháng',
  UPLOAD_SINGLE = 'Chọn 1 file',
  UPLOAD_MULTI = 'Chọn nhiều file',
  DROP_LIST_SINGLE = 'Lựa chọn một (dạng Droplist)',
  DROP_LIST_MULTI = 'Lựa chọn nhiều (dạng Droplist)',
  RADIO_BUTTON = 'Lựa chọn một (Radio)',
  CHECKLIST = 'Lựa chọn nhiều (Checklist)',
  DON_VI_HANH_CHINH = 'Đơn vị hành chính',
}

export enum EFileType {
  doc = 'Tài liệu (doc, docx)',
  pdf = 'Tài liệu (pdf)',
  excel = 'Excel (xlsx, xls)',
  image = 'Ảnh (png, jpg, jpeg)',
}

export const LevelDonViHanhChinh = [
  'Tỉnh',
  'Tỉnh, quận',
  'Tỉnh, quận, xã',
  'Tỉnh, quận, xã, số nhà tên đường',
];

export const accessFileUpload = {
  doc: '.doc,.docx',
  excel: '.xmls, .xls',
  image: 'image/*',
  pdf: '.pdf',
};
