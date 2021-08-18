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

  export interface IChuongTrinhKhungRecord {
    id: string;
    ten_chuong_trinh_khung: string;
    nganh: Nganh.INganhRecord;
    chuyenNganh: any;
    danh_sach_ky_hoc: IKyHocRecord[];
  }

  export interface RootObject {
    data: IChuongTrinhKhungRecord[];
    count: number;
  }
}
