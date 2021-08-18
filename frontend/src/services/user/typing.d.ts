declare module User {
  export interface ListChucVuCapUy {
    _id: string;
    idCoSoDang: string;
    vaiTro: string;
    nhom: string;
  }

  export interface Profile {
    _id: string;
    firstname: string;
    lastname: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    address: string;
  }

  export interface Result {
    _id: string;
    username: string;
    email: string;
    systemRole: string;
    idCoSoDangGoc: string;
    listChucVuCapUy: ListChucVuCapUy[];
    profile: Profile;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
