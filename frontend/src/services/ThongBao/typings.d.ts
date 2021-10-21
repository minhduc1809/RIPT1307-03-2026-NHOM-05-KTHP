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
    unread: boolean;
    createdAt: string;
    updatedAt: string;
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
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
