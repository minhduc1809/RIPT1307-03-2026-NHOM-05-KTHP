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
}
