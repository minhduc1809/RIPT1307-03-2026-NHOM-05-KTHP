declare module TinTuc {
  export interface Record {
    _id: string;
    tieuDe: string;
    idTopic: string;
    moTa: string;
    urlAnhDaiDien: string;
    noiDung: string;
    ngayDang: string;
    nguoiDang: {
      _id: string;
      fullname: string;
    };
  }
}
