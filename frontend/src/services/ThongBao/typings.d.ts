declare module ThongBao {
  export interface Record {
    roles: string[];
    donViIds: number[];
    userIds: string[];
    _id: string;
    senderId: string;
    senderName: string;
    title: string;
    description: string;
    content: string;
    htmlContent: string;
    imageUrl: string;
    notifType: string;
    info: {
      idLopHanhChinh?: number;
      idLopTinChi?: number;
    };
  }

  export interface PostRecord {
    donViIds?: number[];
    roles?: string[];
    title: string;
    description: string;
    htmlContent: string;
    content: string;
    imageUrl: string;
  }
}
