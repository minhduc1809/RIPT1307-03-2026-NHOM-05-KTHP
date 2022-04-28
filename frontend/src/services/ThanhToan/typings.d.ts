declare module ThanhToan {
  export interface Price {
    currency: string;
    active: boolean;
    _id: string;
    name: string;
    product: string;
    unitAmount: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface Product {
    prices: Price[];
    active: boolean;
    _id: string;
    code: string;
    name: string;
    metaData: {
      source: string;
    };
    unitLabel: string;
    createdAt: string;
    updatedAt: string;
    currentPrice: Price;
  }

  export interface Item {
    _id: string;
    priceId: string;
    quantity: number;
    productCode: string;
    productId: string;
    productName: string;
    unitAmount: number;
    unitLabel: string;
  }

  export interface PaidHistory {
    amountPaid: number;
    nguoiThucHien: {
      hoTen: string;
      userId: string;
      username: string;
      _id: string;
    };
    paymentType: string;
    transactionDate: string;
    transactionId: string;
    type: string;
    _id: string;
  }

  export interface Invoice {
    transactionDate: string;
    status: string;
    _id: string;
    code: string;
    amountPaid: number;
    createdAt: string;
    customerInfo: {
      _id: string;
      name: string;
      customerId: string;
      cmtCccd: string;
      address: string;
    };
    identityCode: string;
    items: Item[];
    paidHistory: any[];
    updatedAt: string;
    amountDue: number;
    amountRemaining: number;
    amountRefund: number;
    metadata: {
      loai: string;
      mocThoiGian?: string;
      thongTinChiTiet?: any[];
      [x: string]: string;
    };
    paidHistory: [];
  }

  export interface PostInvoice {
    loaiThanhToan: string;
    mocThoiGian?: string;
    maSinhVien: string;
    soTienPhaiThu: number;
    thongTinChiTiet: any[];
    hinhThucDaoTaoId: string;
    phamVi: string;
  }

  export interface ThongKeInvoice {
    totalDue: number;
    totalRemaining: number;
    totalPaid: number;
    totalRefund: number;
  }

  export interface RecordResponseImport {
    maSinhVien: string;
    ghiChu: string;
  }

  export interface ResponseImportInvoice {
    listKhongHopLe: RecordResponseImport[];
    listHopLe: RecordResponseImport[];
  }
}
