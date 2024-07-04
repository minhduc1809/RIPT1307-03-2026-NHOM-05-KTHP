export enum EReceiverType {
	// Topic = 'Topic',
	User = 'User',
	All = 'All',
	KhoaSinhVien = 'KhoaSinhVien',
	Khoa = 'Khoa',
	Nganh = 'Nganh',
	LopHanhChinh = 'LopHanhChinh',
	LopHocPhan = 'LopHocPhan',
}

export const LoaiDoiTuongThongBao: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.User]: 'Người dùng cụ thể',
	[EReceiverType.All]: 'Toàn ' + APP_CONFIG_TIEN_TO_TRUONG,
	[EReceiverType.Khoa]: 'Khoa',
	[EReceiverType.KhoaSinhVien]: 'Khóa sinh viên',
	[EReceiverType.Nganh]: 'Ngành đào tạo',
	[EReceiverType.LopHanhChinh]: 'Lớp hành chính',
	[EReceiverType.LopHocPhan]: 'Lớp học phần',
};

export enum ESourceTypeNotification {
	SLINK = 'Slink',
	TAI_CHINH = 'Tài chính',
	QLDT = 'QLDT',
	VPS = 'Văn phòng số',
	CTSV = 'Công tác sinh viên',
	TCNS = 'TCNS',
	KHAO_THI = 'Khảo thí',
}

/** Danh mục tất cả các loại thông báo */
export enum ENotificationSource {
	LOP_HANH_CHINH = 'LOP_HANH_CHINH',
	LOP_HOC_PHAN = 'LOP_HOC_PHAN',
	THOI_KHOA_BIEU = 'THOI_KHOA_BIEU',
	DICH_VU_HANH_CHINH = 'DICH_VU_HANH_CHINH',
	KE_HOACH_NAM = 'KE_HOACH_NAM',
	KE_HOACH_HOAT_DONG = 'KE_HOACH_HOAT_DONG',
	TO_CHUC_CONG_VIEC = 'TO_CHUC_CONG_VIEC',
	DU_TOAN_KINH_PHI = 'DU_TOAN_KINH_PHI',
	PHAN_HOI = 'PHAN_HOI',
	KHAO_SAT = 'KHAO_SAT',
	DOT_KHAO_SAT = 'DOT_KHAO_SAT',
	LICH_TUAN = 'LICH_TUAN',
	LICH_TUAN_NHAP = 'LICH_TUAN_NHAP',
}

/** Những URL/Source chỉ sử dụng trong phân hệ hiện tại */
export const mapUrlNotifSource: Partial<Record<ENotificationSource, string>> = {
	[ENotificationSource.LOP_HANH_CHINH]: 'xxx',
};
