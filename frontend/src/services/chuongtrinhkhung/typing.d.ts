declare module ChuongTrinhKhung {
  export interface IHocPhanRecord {
    id: string;
    name: string;
    so_tin_chi: number;
    hoc_phan_truoc: IHocPhanRecord[];
    hoc_phan_tien_quyet: IHocPhanRecord[];
  }

  export interface IKyHocRecord {
    tongSoTinChi: number;
    id: string;
    ten_ky_hoc: string;
    danh_sach_hoc_phan: { hoc_phan: IHocPhanRecord }[];
  }

  export interface KetQuaHocTap {
    id: number;
    diem_chu: string;
    diem_hoc_phan: number;
    diem_thang_4: number;
    hoc_phan_id: (string | number)[];
    trang_thai: string;
  }

  export interface MonHocDieuKien {
    id: number;
    hoc_phan_id: number[];
    ma_hoc_phan_moi: string;
    hoc_ky: number;
    loai_hoc_phan: string;
    tinh_chat: string;
    ten_hoc_phan: string;
    ketQuaHocTap: KetQuaHocTap;
    so_tin_chi: number;
  }

  export interface IChuongTrinhKhungRecord {
    id: string;
    ten_chuong_trinh_khung: string;
    nganh: Nganh.INganhRecord;
    chuyenNganh: any;
    danh_sach_ky_hoc: IKyHocRecord[];
    khoa_nganh_ids: number[];
    nganh_id: string;
    chuyen_nganh_id: string;
    mon_hoc_dieu_kien_ids: MonHocDieuKien[];
    is_nganh: boolean;
    hinh_thuc_dao_tao_id: number[];
  }

  export interface RootObject {
    data: IChuongTrinhKhungRecord[];
    count: number;
  }
}
