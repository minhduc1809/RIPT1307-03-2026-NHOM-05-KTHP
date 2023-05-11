import {
  CloseOutlined,
  ExportOutlined,
  FilterOutlined,
  FilterTwoTone,
  ImportOutlined,
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
import { useModel } from 'umi';
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
    newName,
    pageable,
    scroll,
    destroyModal,
    addStt,
  } = props;
  let { columns } = props;
  const { visibleForm, setVisibleForm, setEdit, setRecord } = useModel(modelName);
  const model = useModel(modelName);

  const page = model?.[`page${newName ?? ''}`];
  const limit = model?.[`limit${newName ?? ''}`];
  const total = model?.[`total${newName ?? ''}`];
  const setPage = model?.[`setPage${newName ?? ''}`];
  const setLimit = model?.[`setLimit${newName ?? ''}`];
  const condition = model?.[`condition${newName ?? ''}`];
  const filters: TFilter<any>[] = model?.[`filters${newName ?? ''}`];
  // const setCondition = model?.[`setCondition${newName ?? ''}`];
  const setFilters = model?.[`setFilters${newName ?? ''}`];
  const sort = model?.[`sort${newName ?? ''}`];
  const setSort = model?.[`setSort${newName ?? ''}`];
  const loading = model?.[`loading${newName ?? ''}`];
  const getData = props.getData ?? model?.[`getModel${newName ?? ''}`];

  const [visibleFilter, setVisibleFilter] = useState(false);
  const hasFilter = columns?.filter((item) => item.filterType)?.length;
  const [visibleImport, setVisibleImport] = useState(false);

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
    ...(item.sortable ? getSort(item.dataIndex) : {}),
    ...(item.filterType === 'string'
      ? getColumnSearchProps(item.dataIndex, item.title)
      : undefined),
    ...(item.filterType === 'select'
      ? getFilterColumnProps(item.dataIndex, item.filterData)
      : undefined),
  }));

  const finalColumns = columns?.filter((item) => item?.hide !== true);
  if (addStt !== false)
    finalColumns.unshift({
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    });
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
          {buttonOptions?.export ? <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button> : null}

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
          dataSource={model?.[dataState || 'danhSach']?.map((item: any, index: number) => {
            return {
              ...item,
              index: index + 1 + (page - 1) * limit * (pageable === false ? 0 : 1),
              key: index,
            };
          })}
          columns={finalColumns as any[]}
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
              destroyOnClose={destroyModal}
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
              destroyOnClose={destroyModal}
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
    </>
  );
};

export default TableBase;
