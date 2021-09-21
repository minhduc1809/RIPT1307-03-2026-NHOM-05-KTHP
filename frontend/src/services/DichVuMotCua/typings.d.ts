declare module DichVuMotCua {
  export interface QueQuan {
    _id: string;
    maTinh: string;
    tenTinh: string;
    maQuanHuyen: string;
    tenQuanHuyen: string;
    maPhuongXa: string;
    tenPhuongXa: string;
    soNhaTenDuong: string;
  }

  export interface Record {
    loaiDon: string;
    trangThai: string;
    _id: string;
    ghiChu: string;
    maChuyenVienXuLy: string;
    ghiChuChuyenVien: string;
    diaChiNhanDon: string;
    queQuan: QueQuan;
    cmtCccd: string;
    ngayCapCmtCccd: string;
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
