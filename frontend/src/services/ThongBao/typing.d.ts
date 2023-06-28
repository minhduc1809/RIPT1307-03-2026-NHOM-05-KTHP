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
    data?: any;
    receiverType: EReceiverType;
    topics?: string[];
    users?: string[];
    createdAt: string; // '2023-06-27T07:47:29.693Z';
    read: boolean;
  }

  export interface PostRecord {
    title: string;
    description: string;
    content?: string;
    htmlContent?: string;
    imageUrl?: string;
    hinhThucDaoTaoId?: number;
    loaiDoiTuong: string[];
    lopHanhChinhList?: number[];
    lopTinChiList?: number[];
    nganhList?: number[];
    donViList?: number[];
    khoaList?: number[];
    userIds?: string[];
    roles?: string[];
  }
}
