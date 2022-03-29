declare module QuanLyTaiKhoan {
  export interface Record {
    _id: string;
    email: string;
    hoDem: string;
    ten: string;
    ngaySinh: string;
    soDienThoai: string;
    anhDaiDien: string;
    diaChi: string;
    cmtCccd: string;
    username: string;
    systemRole: string;
    gioiTinh: string;
    loaiNoiSinh: string;
    ngayCapCmtCccd: string;
    noiCapCmtCccd: string;
    systemRole: string;

    // hinhThucDaoTao: HinhThucDaoTao.Record;
  }
  export interface PostRecord {
    profile: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      phoneNumber: string;
      address: string;
      cmtCccd: string;
    };
    username: string;
    password: string;
    email: string;
    systemRole: string[];
    loaiNoiSinh: string;
    ngayCapCmtCccd: string;
    noiCapCmtCccd: string;
  }
}
