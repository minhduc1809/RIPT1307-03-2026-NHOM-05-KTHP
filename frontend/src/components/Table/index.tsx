/* eslint-disable @typescript-eslint/ban-types */
import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { toRegex } from '@/utils/utils';
import { CloseOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Card, Drawer, Input, Modal, Table } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';
import type { FilterValue } from 'antd/lib/table/interface';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

type Props = {
  modelName: any;
  Form?: React.FC;
  formType?: 'Modal' | 'Drawer';
  columns: IColumn<any>[];
  title?: React.ReactNode;
  widthDrawer?: string | number;
  getData: Function;
  dependencies?: any[];
  loading: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
  hascreate?: boolean;
  dataState?: string;
  otherProps?: TableProps<any>;
  maskCloseableForm?: boolean;
  noCleanUp?: boolean;
};

const TableBase = (props: Props) => {
  const {
    modelName,
    Form,
    title,
    getData,
    dependencies = [],
    formType,
    loading,
    children,
    params,
    border,
    hascreate,
    widthDrawer,
    dataState,
    otherProps,
    maskCloseableForm,
    noCleanUp,
  } = props;
  let { columns } = props;
  const {
    visibleForm,
    setVisibleForm,
    total,
    page,
    limit,
    setPage,
    setLimit,
    setEdit,
    setRecord,
    filterInfo,
    condition,
    setFilterInfo,
    setCondition,
    query,
    setQuery,
  } = useModel(modelName);
  const model = useModel(modelName);

  useEffect(() => {
    getData(params);
  }, [...dependencies]);

  useEffect(() => {
    return () => {
      if (noCleanUp !== true) {
        setCondition({});
        setFilterInfo({});
      }
    };
  }, []);

  let searchInput: Input | null = null;

  const getCondValue = (dataIndex: any) => {
    const type = typeof dataIndex;
    return _.get(filterInfo, type === 'string' ? dataIndex : dataIndex?.join('.'), []);
  };

  // kiểm tra xem dataIndex có vừa được search hay ko
  const haveCond = (dataIndex: string) => getCondValue(dataIndex)?.length > 0;

  const getSearch = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: Function;
      selectedKeys: string[];
      confirm: Function;
      clearFilters: Function;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder="Tìm kiếm"
          value={selectedKeys[0]} //  || selectedKeys[0]
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{
            width: 188,
            marginBottom: 8,
            display: 'block',
            outlineColor: 'red',
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Tìm
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            const type = typeof dataIndex;
            const filter = { ...filterInfo };
            const cond = { ...condition };
            filter[type === 'string' ? dataIndex : dataIndex?.join('.')] = [];
            cond[type === 'string' ? dataIndex : dataIndex?.join('.')] = undefined;
            setFilterInfo(filter);
            setCondition(cond);
          }}
          size="small"
          style={{ width: 90 }}
        >
          Xóa
        </Button>
      </div>
    ),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select());
      }
    },
    filteredValue: getCondValue(dataIndex),
    onFilter: () => true,
    filterIcon: (filtered: any) => (
      <SearchOutlined
        style={{
          color: filtered || haveCond(dataIndex) ? '#CC0D00' : undefined,
        }}
        title="Tìm kiếm"
      />
    ),
  });

  const getFilter = (dataIndex: any, columnKey?: string) => {
    const newDataIndex = dataIndex?.join('.');
    const arrValueByDataIndex: any[] = data?.[`${columnKey || newDataIndex}`] ?? [];
    return {
      // cần đảm bảo trong file data.js đã có dữ liệu
      filters: arrValueByDataIndex.map((item, index) => {
        const type = typeof item;
        return {
          text: type === 'string' ? item : item?.text ?? '',
          value: type === 'string' ? index : item?.value,
        };
      }),
      onFilter: () => true,
      // đồng bộ với cond đang search
      filteredValue: getCondValue(newDataIndex),
      filterMultiple: false,
      // render: (item: string | number) => {
      //   return data?.[`${columnKey || newDataIndex}`]?.[`${+item}`] ?? 'Chưa xác định';
      // },
    };
  };

  const getFilterS = (dataIndex: any, columnKey: any) => {
    return {
      // cần đảm bảo trong file data.js đã có dữ liệu
      // trangThaiDon  = [ 'Đang xử lý', 'Đã xử lý']
      // dataIndex : 'trangThaiHienThi'
      // columnKey :'trangThaiDon'
      filters: (data?.[columnKey || dataIndex] ?? []).map((item: any) => {
        const type = typeof item;
        return {
          text: type === 'string' ? item : item?.text ?? '', // cai hien thi ở ô lọc
          value: type === 'string' ? item : item?.value,
        };
      }),

      onFilter: () => true,
      // đồng bộ với cond đang search
      filteredValue: getCondValue(dataIndex),
      filterMultiple: false,
      // render: (item: string | number) => item ?? 'Chưa xác định',
    };
  };

  const getSortValue = (dataIndex: any) => {
    if (getCondValue('sort') !== dataIndex) {
      return false;
    }
    const value = getCondValue('order');
    if (value === 1) {
      return 'ascend';
    }
    if (value === -1) {
      return 'descend';
    }
    return false;
  };

  const getSort = (dataIndex: any) => ({
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    sortOrder: getSortValue(dataIndex),
  });

  columns = columns.map((item) => {
    // nếu data trả về có dangj 0,1 / true,false
    if (item.search === 'filter') {
      return {
        ...item,
        ...getFilter(item.dataIndex, item?.columnKey),
      };
    }
    // nếu data trả về có dạng string
    if (item.search === 'filterString') {
      return {
        ...item,
        ...getFilterS(item.dataIndex, item?.columnKey),
      };
    }
    if (item.search === 'search') {
      return { ...item, ...getSearch(item.dataIndex) };
    }
    if (item.search === 'sort') {
      return { ...item, ...getSort(item.dataIndex) };
    }
    return item;
  });

  // const handleTableChange = (pagination: PaginationProps) => {
  //   setPage(pagination?.current ?? 1);
  //   setLimit(pagination?.pageSize ?? 10);
  // };

  const onChange = (
    pagination: PaginationProps,
    filters: Record<string, FilterValue | null>,
    sorter: any,
  ) => {
    // console.log('this.tableBaseRef :>> ', this.tableBaseRef);
    // this.tableBaseRef.current.focus();
    // this.focusTableBase();
    // thay đổi từ phân trang || filter
    const { current, pageSize } = pagination;
    const { columnKey, order } = sorter;
    let orderValue;
    if (order === 'ascend') orderValue = 1;
    else if (order === 'descend') orderValue = -1;

    //  giữ lại thông tin của cond.

    const tmpCond = _.clone(condition);
    setFilterInfo({ ...filterInfo, ...filters, sort: columnKey, order: orderValue });
    Object.keys(filters).forEach((key) => {
      // if (!filters?.[key]?.length) {
      //   return;
      // }
      const type = columns?.find((item) => item.dataIndex === key || item.key === key)?.typeFilter;
      const value = filters?.[key]?.[0];
      if (type === 'query') {
        const tmpQuery = _.clone(query);
        tmpQuery[key] = value;
        setQuery(tmpQuery);
        return;
      }

      const notRegex = columns?.find(
        (item) => item.dataIndex === key || item.key === key,
      )?.notRegex;

      const isSearch = typeof value === 'string';
      tmpCond[key] = isSearch && notRegex !== true ? toRegex(value) : value;
      // return 0;
    });

    setPage(current);
    setLimit(pageSize);
    setCondition(tmpCond);
  };

  return (
    <Card title={title || false}>
      {children}
      {hascreate && (
        <Button
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({});
          }}
          icon={<PlusCircleFilled />}
          type="primary"
        >
          Thêm mới
        </Button>
      )}
      <h4 style={{ display: 'inline-block', margin: '0 0px 8px 50px', float: 'right' }}>
        Tổng số:
        <Input
          style={{ width: '90px', fontWeight: 600, fontSize: 14, marginLeft: 10 }}
          value={total}
          readOnly
          // ref={this.setTableBaseRef}
        />
      </h4>
      <Table
        scroll={{ x: 1000 }}
        loading={loading}
        bordered={border || false}
        pagination={{
          current: page,
          pageSize: limit,
          position: ['bottomRight'],
          total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
          showTotal: (tongSo: number) => {
            return <div>Tổng số: {tongSo}</div>;
          },
        }}
        // onChange={handleTableChange}
        onChange={onChange}
        dataSource={model?.[dataState || 'danhSach']?.map((item: any, index: number) => {
          return { ...item, index: index + 1 + (page - 1) * limit, key: index };
        })}
        columns={columns?.filter((item) => item?.hide !== true)}
        {...otherProps}
      />
      {Form && (
        <>
          {formType === 'Drawer' ? (
            <Drawer
              closeIcon={false}
              maskClosable={maskCloseableForm || false}
              width={widthDrawer}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
            >
              <Form />
              <CloseOutlined
                onClick={() => {
                  setVisibleForm(false);
                }}
                style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }}
              />
            </Drawer>
          ) : (
            <Modal
              maskClosable={maskCloseableForm || false}
              width={widthDrawer}
              onCancel={() => {
                setVisibleForm(false);
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
            >
              <Form />
            </Modal>
          )}
        </>
      )}
    </Card>
  );
};

export default TableBase;
