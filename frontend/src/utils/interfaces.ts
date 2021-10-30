import type { ColumnType as ICol } from 'rc-table/lib/interface';

export interface IColumn<T> extends ICol<T> {
  search?: 'search' | 'filter' | 'sort' | 'filterTF' | 'filterString';
  columnKey?: string;
  notRegex?: boolean;
  typeFilter?: 'query' | 'condition';
}
