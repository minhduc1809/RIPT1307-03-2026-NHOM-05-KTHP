/* eslint-disable @typescript-eslint/ban-types */
import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { toRegex } from '@/utils/utils';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  getData: Function;
  dependencies?: any[];
  loading: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
  scroll?: { x?: number; y?: number };
  hascreate?: boolean;
  dataState?: string;
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
    scroll,
    hascreate,
    widthDrawer,
    dataState,
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
  } = useModel(modelName);
  const model = useModel(modelName);

  useEffect(() => {
    getData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // return () => {
    //   setCondition({});
    //   setFilterInfo({});
    // };
  }, [...dependencies]);

  let searchInput: Input | null = null;

  const getCondValue = (dataIndex: string) => filterInfo?.[dataIndex] ?? [];

  // kiểm tra xem dataIndex có vừa được search hay ko
  const haveCond = (dataIndex: string) => getCondValue(dataIndex).length > 0;

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
          color: filtered || haveCond(dataIndex) ? '#1890ff' : undefined,
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

  const getFilterS = (dataIndex: any, columnKey: any) => ({
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
  });

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
      const notRegex = columns?.find(
        (item) => item.dataIndex === key || item.key === key,
      )?.notRegex;
      const value = filters?.[key]?.[0];
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
      <Table
        scroll={scroll || { x: 1000 }}
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
        columns={columns}
      ></Table>
      {Form && (
        <>
          {formType === 'Drawer' ? (
            <Drawer
              width={widthDrawer}
              onClose={() => {
                setVisibleForm(false);
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleForm}
            >
              <Form />
            </Drawer>
          ) : (
            <Modal
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
