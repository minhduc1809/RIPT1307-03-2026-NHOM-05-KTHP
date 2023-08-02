import {
  CloseOutlined,
  ExportOutlined,
  FilterOutlined,
  FilterTwoTone,
  ImportOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, ConfigProvider, Drawer, Empty, Input, Modal, Table } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';
import Tooltip from 'antd/es/tooltip';
import type { FilterValue } from 'antd/lib/table/interface';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import type { SortEnd, SortableContainerProps } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useModel } from 'umi';
import ModalExport from './Export';
import ModalImport from './Import';
import ModalCustomFilter from './ModalCustomFilter';
import { EOperatorType } from './constant';
import './style.less';
import type { TDataOption, TFilter, TableBaseProps } from './typing';

const TableBase = (props: TableBaseProps) => {
  const {
    modelName,
    Form,
    title,
    dependencies = [],
    formType,
    children,
    params,
    border,
    buttons: buttonOptions,
    widthDrawer,
    dataState,
    otherProps,
    maskCloseableForm,
    hideCard,
    noCleanUp,
    pageable,
    scroll,
    destroyModal,
    addStt,
    rowSortable,
  } = props;
  let { columns } = props;
  const model = useModel(modelName);
  const { visibleForm, setVisibleForm, setEdit, setRecord, setIsView } = model;

  const page = model?.page;
  const limit = model?.limit;
  const total = model?.total;
  const setPage = model?.setPage;
  const setLimit = model?.setLimit;
  const condition = model?.condition;
  // const setCondition = model?.['setCondition'];
  const filters: TFilter<any>[] = model?.filters;
  const setFilters = model?.setFilters;
  const sort = model?.sort;
  const setSort = model?.setSort;
  const loading = model?.loading;
  const getData = props.getData ?? model?.getModel;

  const hasFilter = columns?.filter((item) => item.filterType)?.length;
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [visibleImport, setVisibleImport] = useState(false);
  const [visibleExport, setVisibleExport] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filters ?? [])]);

  useEffect(() => {
    getData(params);
  }, [...dependencies, filters, condition, sort]);

  useEffect(() => {
    return () => {
      if (noCleanUp !== true) {
        // setCondition(undefined);
        setFilters(undefined);
        // setSort(undefined);
      }
    };
  }, []);

  /**
   * Get current filter rule in column
   * @date 2023-04-13
   */
  const getFilterColumn = (fieldName: any, operator?: EOperatorType, active?: boolean) =>
    filters?.find(
      (item) =>
        item.field === fieldName &&
        (operator === undefined || item.operator === operator) &&
        (active === undefined || item.active === active),
    );

  //#region Get Sort Column Props
  const getCondValue = (dataIndex: any) => {
    const type = typeof dataIndex;
    return _.get(sort, type === 'string' ? dataIndex : dataIndex?.join('.'), []);
  };

  const getSortValue = (dataIndex: any) => {
    const value = getCondValue(dataIndex);
    return value === 1 ? 'ascend' : value === -1 ? 'descend' : false;
  };

  const getSort = (dataIndex: any) => ({
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    sortOrder: getSortValue(dataIndex),
  });
  //#endregion

  //#region Get Search Column Props
  const handleSearch = (dataIndex: any, value: string) => {
    if (!value) {
      // Remove filter of this column
      const tempFilters = filters?.filter((item) => item.field !== dataIndex);
      setFilters(tempFilters);
    } else {
      const filter = getFilterColumn(dataIndex);
      let tempFilters: TFilter<any>[] = [...(filters ?? [])];
      if (filter)
        // Udpate current filter
        tempFilters = tempFilters.map((item) =>
          item.field === dataIndex
            ? { ...item, active: true, operator: EOperatorType.CONTAIN, values: [value] }
            : item,
        );
      // Add new filter rule for this column
      else
        tempFilters.push({
          active: true,
          field: dataIndex,
          operator: EOperatorType.CONTAIN,
          values: [value],
        });
      setFilters(tempFilters);
    }
  };

  const getColumnSearchProps = (dataIndex: any, columnTitle: any) => {
    const filterColumn = getFilterColumn(dataIndex, EOperatorType.CONTAIN, true);
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div className="column-search-box" onKeyDown={(e) => e.stopPropagation()}>
          <Input.Search
            placeholder={`Tìm ${columnTitle}`}
            allowClear
            enterButton
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onSearch={(value) => handleSearch(dataIndex, value)}
          />
        </div>
      ),
      filteredValue: filterColumn?.values ?? [],
      filterIcon: () => {
        const values = getFilterColumn(dataIndex, undefined, true)?.values;
        const filtered = values && values[0];
        return <SearchOutlined className={filtered ? 'text-primary' : undefined} />;
      },
    };
  };
  //#endregion

  //#region Get Filter Column Props

  const handleFilter = (dataIndex: any, values: string[]) => {
    if (!values || !values.length) {
      // Remove filter of this column
      const tempFilters = filters?.filter((item) => item.field !== dataIndex);
      setFilters(tempFilters);
    } else {
      const filter = getFilterColumn(dataIndex);
      let tempFilters: TFilter<any>[] = [...(filters ?? [])];
      if (filter)
        // Udpate current filter
        tempFilters = tempFilters.map((item) =>
          item.field === dataIndex
            ? { ...item, active: true, operator: EOperatorType.INCLUDE, values }
            : item,
        );
      // Add new filter rule for this column
      else
        tempFilters.push({
          active: true,
          field: dataIndex,
          operator: EOperatorType.INCLUDE,
          values,
        });
      setFilters(tempFilters);
    }
  };

  const getFilterColumnProps = (dataIndex: any, filterData?: any[]) => {
    const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
    return {
      filters: filterData?.map((item: string | TDataOption) =>
        typeof item === 'string'
          ? { key: item, value: item, text: item }
          : { key: item.value, value: item.value, text: item.label },
      ),
      filteredValue: filterColumn?.values ?? [],
    };
  };
  //#endregion

  //#region Get Table Columns
  columns = columns.map((item) => ({
    ...item,
    ...(item.sortable && getSort(item.dataIndex)),
    ...(item.filterType === 'string'
      ? getColumnSearchProps(item.dataIndex, item.title)
      : item.filterType === 'select'
      ? getFilterColumnProps(item.dataIndex, item.filterData)
      : undefined),
    children: item.children?.map((child) => ({
      ...child,
      ...(child.sortable && getSort(child.dataIndex)),
      ...(child.filterType === 'string'
        ? getColumnSearchProps(child.dataIndex, child.title)
        : child.filterType === 'select'
        ? getFilterColumnProps(child.dataIndex, child.filterData)
        : undefined),
    })),
  }));

  const finalColumns = columns?.filter((item) => item?.hide !== true);
  if (addStt !== false)
    finalColumns.unshift({
      title: 'TT',
      dataIndex: 'index',
      align: 'center',
      width: 40,
    });

  //#region Get Drag Sortable column
  const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));

  const SortableItem = SortableElement((props1: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props1} />
  ));
  const SortableBody = SortableContainer(
    (props1: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props1} />,
  );

  if (rowSortable)
    finalColumns.unshift({
      title: '',
      width: 30,
      align: 'center',
      render: () => <DragHandle />,
    });

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const record = model?.[dataState || 'danhSach']?.[oldIndex];
      if (props.onSortEnd) props.onSortEnd(record, newIndex);
    }
  };

  const DraggableContainer = (props1: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props1}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = restProps['data-row-key'];
    return <SortableItem index={index ?? 0} {...restProps} />;
  };
  //#endregion

  //#endregion

  /**
   * On Table Changed
   * @date 2023-04-13
   */
  const onChange = (
    pagination: PaginationProps,
    fil: Record<string, FilterValue | null>,
    sorter: any,
  ) => {
    // Handle Filter in columns
    Object.entries(fil).map(([field, values]) => {
      const col = columns.find((item) => item.dataIndex === field);
      if (col?.filterType === 'select') handleFilter(field, values as any);
      else if (col?.filterType === 'string') handleSearch(field, values?.[0] as any);
    });

    const { order, field } = sorter;
    const orderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : undefined;
    if (sorter && setSort) setSort({ [field]: orderValue });

    // thay đổi từ phân trang || filter
    const { current, pageSize } = pagination;
    setPage(current);
    setLimit(pageSize);
  };

  const mainContent = (
    <div className="table-base">
      {children}

      <div className="header">
        <div className="action">
          {buttonOptions?.create !== false ? (
            <Tooltip title="Thêm mới dữ liệu">
              <Button
                size={props?.otherProps?.size}
                onClick={() => {
                  setRecord({});
                  setEdit(false);
                  setIsView(false);
                  setVisibleForm(true);
                }}
                icon={<PlusCircleOutlined />}
                type="primary"
              >
                Thêm mới
              </Button>
            </Tooltip>
          ) : null}

          {buttonOptions?.import ? (
            <Button icon={<ImportOutlined />} onClick={() => setVisibleImport(true)}>
              Nhập dữ liệu
            </Button>
          ) : null}
          {buttonOptions?.export ? (
            <Button icon={<ExportOutlined />} onClick={() => setVisibleExport(true)}>
              Xuất dữ liệu
            </Button>
          ) : null}

          {props.otherButtons}
        </div>

        <div className="extra">
          {buttonOptions?.reload !== false ? (
            <Tooltip title="Tải lại dữ liệu">
              <Button icon={<ReloadOutlined />} onClick={() => getData(params)} loading={loading}>
                <span className="extend">Tải lại</span>
              </Button>
            </Tooltip>
          ) : null}

          {buttonOptions?.filter !== false && hasFilter ? (
            <Tooltip title="Áp dụng bộ lọc tùy chỉnh">
              <Button
                icon={filters?.length ? <FilterTwoTone /> : <FilterOutlined />}
                onClick={() => setVisibleFilter(true)}
              >
                <span className="extend">Bộ lọc tùy chỉnh</span>
              </Button>
            </Tooltip>
          ) : null}

          {!props?.hideTotal ? (
            <Tooltip title="Tổng số dữ liệu">
              <div className="total">
                Tổng số:
                <span>{total || 0}</span>
              </div>
            </Tooltip>
          ) : null}
        </div>
      </div>

      <ConfigProvider
        renderEmpty={() => (
          <Empty
            style={{ marginTop: 32, marginBottom: 32 }}
            description={props.emptyText ?? 'Không có dữ liệu'}
          />
        )}
      >
        <Table
          scroll={scroll ?? { x: _.sum(finalColumns.map((item) => item.width ?? 80)) }}
          rowSelection={
            props?.rowSelection
              ? {
                  type: 'checkbox',
                  ...props?.detailRow,
                }
              : undefined
          }
          loading={loading}
          bordered={border || true}
          pagination={{
            current: page,
            pageSize: limit,
            position: ['bottomRight'],
            total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '25', '50', '100'],
            showTotal: (tongSo: number) => {
              return <div>Tổng số: {tongSo}</div>;
            },
          }}
          onChange={onChange}
          dataSource={model?.[dataState || 'danhSach']?.map((item: any, index: number) => ({
            ...item,
            index: index + 1 + (page - 1) * limit * (pageable === false ? 0 : 1),
            key: index,
            children:
              !props.hideChildrenRows &&
              item?.children &&
              Array.isArray(item.children) &&
              item.children.length
                ? item.children
                : undefined,
          }))}
          columns={finalColumns as any[]}
          components={
            rowSortable
              ? {
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                  },
                }
              : undefined
          }
          {...otherProps}
        />
      </ConfigProvider>
    </div>
  );

  return (
    <>
      {hideCard ? (
        mainContent
      ) : (
        <Card title={title || false} bordered={border || false}>
          {mainContent}
        </Card>
      )}

      {Form && (
        <>
          {formType === 'Drawer' ? (
            <Drawer
              className={widthDrawer === 'full' ? 'drawer-full' : ''}
              maskClosable={maskCloseableForm || false}
              width={widthDrawer !== 'full' ? widthDrawer : undefined}
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
              destroyOnClose={destroyModal || false}
            >
              <Form title={title ?? ''} {...props.formProps} />
              <CloseOutlined
                onClick={() => setVisibleForm(false)}
                style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }}
              />
            </Drawer>
          ) : (
            <Modal
              className={widthDrawer === 'full' ? 'modal-full' : ''}
              maskClosable={maskCloseableForm || false}
              width={widthDrawer !== 'full' ? widthDrawer : undefined}
              onCancel={() => setVisibleForm(false)}
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
              destroyOnClose={destroyModal || false}
            >
              <Form title={title ?? ''} {...props.formProps} />
            </Modal>
          )}
        </>
      )}

      {buttonOptions?.filter !== false && hasFilter ? (
        <ModalCustomFilter
          visible={visibleFilter}
          setVisible={setVisibleFilter}
          columns={finalColumns}
          filters={filters}
          setFilters={setFilters}
        />
      ) : null}

      {buttonOptions?.import ? (
        <ModalImport
          visible={visibleImport}
          modelName={modelName}
          onCancel={() => setVisibleImport(false)}
          onOk={() => {
            getData(params);
            setVisibleImport(false);
          }}
        />
      ) : null}

      {buttonOptions?.export ? (
        <ModalExport
          visible={visibleExport}
          modelName={modelName}
          onCancel={() => setVisibleExport(false)}
          fileName={`Danh sách ${title ?? 'dữ liệu'}.xlsx`}
        />
      ) : null}
    </>
  );
};

export default TableBase;
