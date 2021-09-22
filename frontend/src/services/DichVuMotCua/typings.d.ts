declare module DichVuMotCua {
  export interface DonVi {}

  export interface QueQuan {
    maTinh: string;
    tenTinh: string;
    maQuanHuyen?: string;
    tenQuanHuyen?: string;
    maPhuongXa?: string;
    tenPhuongXa?: string;
    soNhaTenDuong?: string;
  }

  export interface Record {
    loaiPhongBan: string;
    donVi: DonVi;
    loaiDon: string;
    trangThai: string;
    _id: string;
    ghiChu: string;
    maChuyenVienXuLy: string;
    ghiChuChuyenVien: string;
    qrUrl: string;
    thoiGianDuyet: Date;
    thoiGianTiepNhan: Date;
    diaChiNhanDon: string;
    soDienThoai: string;
    queQuan: QueQuan | string;
    cmtCccd: string;
    ngayCapCmtCccd: Date;
    noiCap: string;
    sinhVienNam: number;
    heDaoTao: string;
    nienKhoa: string;
    namHocBatDau: string;
    namHocKetThuc: string;
    lyDo: string;
    xacNhanSV: boolean;
    tinhTrangHocTap: boolean;
    lyDoKhac: boolean;
    loaiPhongBan: string;
    userId: string;
    userCode: string;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    lop: string;
  }

  export interface ThuTuc {
    capDo: string;
    coQuanCoThamQuyen: string;
    donViThucHien: string;
    hoSo: string;
    ketQuaThucHien: string;
    linhVuc: string;
    loaiDon: string;
    luuY: string;
    maThuTuc: string;
    mauBieu: string;
    phamViPhucVu: string;
    quyTrinhThucHien: string;
    tenThuTuc: string;
    thoiHanGiaiQuyet: string;
    yeuCau: string;
    yeuCauTraPhi: string;
    _id: string;
  }
}
