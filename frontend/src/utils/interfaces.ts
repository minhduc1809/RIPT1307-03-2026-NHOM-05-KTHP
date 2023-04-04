import type { ColumnType as ICol } from 'rc-table/lib/interface';

export interface IColumn<T> extends Omit<ICol<T>, 'dataIndex' | 'width'> {
  hide?: boolean;
  search?: 'search' | 'filter' | 'sort' | 'filterTF' | 'filterString';
  columnKey?: string;
  notRegex?: boolean;
  typeFilter?: 'query' | 'condition';
  children?: any[];
  typeDataSearch?: 'number';
  dataFilter?: string[] | { text: string; value: string }[];
  dataIndex?: keyof T | 'index' | string[];
  width: number;
}
