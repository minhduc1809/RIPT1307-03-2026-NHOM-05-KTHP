import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Drawer, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { type TableStaticProps } from './typing';
import './style.less';
import _ from '@umijs/deps/compiled/lodash';

const TableStaticData = (props: TableStaticProps) => {
  const { Form, showEdit, setShowEdit, addStt, data, children, hasCreate, hasTotal } = props;
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState<number>();

  useEffect(() => {
    setTotal(data?.length);
    setPage(1);
    setSearchText('');
    setSearchedColumn(undefined);
  }, [data?.length]);

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn(undefined);
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div className="column-search-box" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder="Nhập từ khóa"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          style={{ width: 90 }}
        >
          Tìm
        </Button>
        <Button
          onClick={() => {
            handleReset(clearFilters);
            handleSearch(selectedKeys, confirm, dataIndex);
            setSearchText('');
          }}
          style={{ width: 90 }}
        >
          Xóa
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined className={filtered ? 'text-primary' : undefined} />
    ),
    onFilter: (value: any, record: any) =>
      typeof dataIndex === 'string'
        ? record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
        : typeof dataIndex === 'object'
        ? record[dataIndex[0]][dataIndex?.[1]]
            ?.toString()
            ?.toLowerCase()
            ?.includes(value.toLowerCase())
        : '',

    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = props.columns
    ?.filter((item: any) => !item.hide)
    ?.map((item: any) => ({
      ...item,
      ...(item?.search === 'search'
        ? getColumnSearchProps(item.dataIndex)
        : item?.search === 'sort'
        ? { sorter: (a: any, b: any) => a[item.dataIndex] - b[item.dataIndex] }
        : {}),
    }));

  if (addStt)
    columns.unshift({
      title: 'STT',
      render: (s: any, r: any, index: any) => index + 1 + (page - 1) * limit,
      align: 'center',
      width: 60,
    });

  return (
    <div className="table-base">
      <div className="header">
        {children}
        <div className="action">
          {hasCreate && (
            <Button
              onClick={() => {
                if (setShowEdit) setShowEdit(true);
              }}
              icon={<PlusOutlined />}
              type="primary"
              style={{ marginBottom: 8 }}
              size={props?.size ?? 'middle'}
            >
              Thêm mới
            </Button>
          )}
        </div>

        <div className="extra">
          {hasTotal ? (
            <div className="total">
              Tổng số:
              <span>{total || props.data?.length || 0}</span>
            </div>
          ) : null}
        </div>
      </div>

      <Table
        rowKey={(rec) => rec._id}
        title={props?.title ? () => props.title : false}
        columns={columns}
        dataSource={props?.data ?? []}
        onChange={(pagination, filters, sorter, extra) => {
          setTotal(extra.currentDataSource.length ?? pagination.total);
          setPage(pagination.current ?? 1);
          setLimit(pagination.pageSize ?? 999);
        }}
        loading={props?.loading}
        size={props.size}
        scroll={scroll ?? { x: _.sum(columns.map((item) => item.width ?? 80)) }}
        {...props?.otherProps}
      />
      {Form && (
        <>
          {props?.formType === 'Drawer' ? (
            <Drawer
              width={props?.widthDrawer}
              onClose={() => {
                if (setShowEdit) setShowEdit(false);
              }}
              destroyOnClose
              footer={false}
              visible={showEdit}
            >
              <Form
                onCancel={() => {
                  if (setShowEdit) setShowEdit(false);
                }}
              />
            </Drawer>
          ) : (
            <Modal
              width={props?.widthDrawer}
              onCancel={() => {
                if (setShowEdit) setShowEdit(false);
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={showEdit}
            >
              <Form
                onCancel={() => {
                  if (setShowEdit) setShowEdit(false);
                }}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default TableStaticData;
