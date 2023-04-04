declare module Setting {
  export interface Record {
    key?: string;
    value?: any;
    type?: string;
    name?: string;
    description?: string;
    public?: boolean;
  }
}
