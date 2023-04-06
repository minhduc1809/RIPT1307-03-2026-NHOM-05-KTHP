/* eslint-disable @typescript-eslint/ban-types */
import type { ColumnType as ICol } from 'rc-table/lib/interface';
import { type EOperatorType } from './constant';

export interface IColumn<T> extends Omit<ICol<T>, 'dataIndex' | 'width'> {
  hide?: boolean;
  columnKey?: string;
  notRegex?: boolean;
  children?: IColumn[];
  sortable?: boolean;
  filterData?: string[] | TDataOption[];
  filterType?: 'string' | 'number' | 'date' | 'datetime' | 'select';
  dataIndex?: keyof T | 'index' | string[];
  width: number;
}

export type TDataOption = {
  label: string;
  value: string | number;
};

export type TableBaseProps = {
  modelName: any;
  Form?: React.FC;
  formType?: 'Modal' | 'Drawer';
  columns: IColumn<any>[];
  title?: React.ReactNode;
  widthDrawer?: string | number;
  getData?: Function;
  dependencies?: any[];
  loading?: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
  buttons?: {
    create?: boolean;
    import?: boolean;
    export?: boolean;
    filter?: boolean;
    reload?: boolean;
  };
  otherButtons?: React.FC[];
  dataState?: string;
  otherProps?: TableProps<any>;
  maskCloseableForm?: boolean;
  noCleanUp?: boolean;
  rowSelection?: boolean;
  detailRow?: any;
  newName?: string;
  hideTotal?: boolean;
  pageable?: boolean;
  hideCard?: boolean;
  emptyText?: string;
  scroll?: { x?: number; y?: number };
  formProps?: any;
  destroyModal?: boolean;
  addStt?: boolean;
};

export type TFilter<T> = {
  field: keyof T;
  operator?: EOperatorType;
  values: any[];
  active: boolean;
};
