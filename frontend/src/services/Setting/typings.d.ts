declare module Setting {
  export interface Record {
    key?: string;
    value?: string;
    type?: string;
    name?: string;
    description?: string;
    public?: boolean;
  }
}
