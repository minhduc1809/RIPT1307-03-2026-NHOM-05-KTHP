import type { IColumn, TFilter } from './typing';

export const findFiltersInColumns = (columns: IColumn<unknown>[], filters?: TFilter<unknown>[]) => {
	if (!filters?.length) return [];
	return filters.filter((fil) => {
		const field = JSON.stringify(fil.field);
		return columns.some((col) => JSON.stringify(col.dataIndex) === field);
	});
};
