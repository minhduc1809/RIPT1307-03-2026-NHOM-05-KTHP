const DEFAULT_LABELS: Record<string, string> = {
	approved: 'Đã phê duyệt',
	rejected: 'Từ chối',
	returned: 'Trả lại chỉnh sửa',
	da_duyet: 'Đã phê duyệt',
	tu_choi: 'Từ chối',
	tra_lai: 'Trả lại chỉnh sửa',
	CHO_HANH_CHINH: 'Chờ Hành Chính',
	CHO_DUYET: 'Chờ Duyệt',
	CHO_QUAN_LY: 'Chờ Quản Lý',
	CHO_NHAN_SU: 'Chờ Nhân Sự',
	CHO_NHAN_SU_XAC_NHAN: 'Chờ Nhân Sự Xác Nhận',
	CHO_TRUONG_PHONG: 'Chờ Trưởng Phòng',
	CHO_GIAM_DOC: 'Chờ Giám Đốc',
};

export function getStateLabel(state: string, stateLabels?: Record<string, string> | null): string {
	if (stateLabels?.[state]) return stateLabels[state];
	if (DEFAULT_LABELS[state]) return DEFAULT_LABELS[state];

	// Auto-convert slug to readable: cho_truong_phong → Chờ trưởng phòng
	return state.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
