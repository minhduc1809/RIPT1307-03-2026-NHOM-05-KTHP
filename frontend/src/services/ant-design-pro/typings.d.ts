declare module Login {
  export interface User {
    uid: number;
    partner_id: 27381;
    ho_ten: string;
    ma_dinh_danh: string;
    email: string;
    gioi_tinh: string;
    vai_tro: string;
  }

  export interface Profile {
    createdAt: string;
    email: string;
    gioiTinh: string;
    hoDem: string;
    ngaySinh: string;
    systemRole: string;
    ten: string;
    updatedAt: string;
    username: string;
    __v: 0;
    _id: string;
  }

  export interface ProfileAdmin {
    _id: string;
    username: string;
    systemRole: string;
    hoDem: string;
    ten: string;
    gioiTinh: string;
    email: string;
  }

  export interface Record {
    user: User;
    accessTokens: { vai_tro: string; token: string }[];
  }
}
