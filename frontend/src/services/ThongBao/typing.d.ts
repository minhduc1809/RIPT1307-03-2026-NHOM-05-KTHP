import { type EVaiTroBieuMau } from '../TienIch/constant';
import { type EReceiverType } from './constant';

declare module ThongBao {
  export interface IRecord {
    _id: string;
    title: string;
    senderName: string;
    sender?: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    filter?: {
      roles: EVaiTroBieuMau[];
      idKhoaSinhVien: string;
      idKhoa: string;
      idNganh: string;
      idLopHanhChinh: string;
      idLopTinChi: string;
    };
    receiverType: EReceiverType;
    topics?: string[];
    users?: string[];
    data?: any;
    createdAt: string; // '2023-06-27T07:47:29.693Z';
    read: boolean;
  }

  export interface IUser {
    code: string;
    firstname: string;
    lastname: string;
    vaiTro?: EVaiTroBieuMau;
  }
}
