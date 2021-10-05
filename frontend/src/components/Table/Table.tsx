/* eslint-disable @typescript-eslint/ban-types */
import type { IColumn } from '@/utils/interfaces';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Button, Input, Table } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';
import type { FilterValue } from 'antd/lib/table/interface';

type Props = {
  columns: IColumn<any>[];
  title?: React.ReactNode;
  data: any[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  children?: React.ReactNode;
  border?: boolean;
  scroll?: { x?: number; y?: number };
};

const TableBase = (props: Props) => {
  const { title, data, border } = props;
  const [dataFinal, setDataFinal] = useState<any[]>(data);
  let { columns } = props;

  let searchInput: Input | null = null;

  // const getCondValue = (dataIndex: string) => filterInfo?.[dataIndex] ?? [];

  // kiểm tra xem dataIndex có vừa được search hay ko
  // const haveCond = (dataIndex: string) => getCondValue(dataIndex).length > 0;

  const getSearch = () => {
    return {
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
      // filteredValue: getCondValue(dataIndex),
      onFilter: () => true,
      filterIcon: (filtered: any) => (
        <SearchOutlined
          // style={{
          //   color: filtered || haveCond(dataIndex) ? '#1890ff' : undefined,
          // }}
          title="Tìm kiếm"
        />
      ),
    };
  };

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
      // filteredValue: getCondValue(newDataIndex),
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
    // filteredValue: getCondValue(dataIndex),
    filterMultiple: false,
    // render: (item: string | number) => item ?? 'Chưa xác định',
  });

  const getSortValue = (dataIndex: any) => {
    // if (getCondValue('sort') !== dataIndex) {
    //   return false;
    // }
    // const value = getCondValue('order');
    // if (value === 1) {
    //   return 'ascend';
    // }
    // if (value === -1) {
    //   return 'descend';
    // }
    // return false;
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
      return { ...item, ...getSearch() };
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
    Object.keys(filters)?.map((item) => {});
    // const { current, pageSize } = pagination;
    // const { columnKey, order } = sorter;
    // let orderValue;
    // if (order === 'ascend') orderValue = 1;
    // else if (order === 'descend') orderValue = -1;
    //  giữ lại thông tin của cond.
    // const tmpCond = _.clone(condition);
    // setFilterInfo({ ...filterInfo, ...filters, sort: columnKey, order: orderValue });
    // Object.keys(filters).forEach((key) => {
    //   const notRegex = columns?.find(
    //     (item) => item.dataIndex === key || item.key === key,
    //   )?.notRegex;
    //   const value = filters?.[key]?.[0];
    //   const isSearch = typeof value === 'string';
    //   tmpCond[key] = isSearch && notRegex !== true ? toRegex(value) : value;
    //   // return 0;
    // });
  };

  return (
    <Table
      title={() => <div>{title}</div>}
      // scroll={scroll || { x: 1000 }}
      bordered={border || false}
      pagination={{
        position: ['bottomRight'],
        total: data.length,
        showSizeChanger: true,
        pageSizeOptions: ['10', '25', '50', '100'],
        showTotal: (tongSo: number) => {
          return <div>Tổng số: {tongSo - 1}</div>;
        },
      }}
      // onChange={handleTableChange}
      onChange={onChange}
      dataSource={data}
      columns={columns}
    />
  );
};

export default TableBase;
