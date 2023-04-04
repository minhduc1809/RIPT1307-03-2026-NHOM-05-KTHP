import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Drawer, Modal } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';

const TableBaseStatic = (props) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState();
  const { Form, showEdit, setShowEdit, addStt, data } = props;
  const refTotal = useRef(null);
  useEffect(() => {
    if (showEdit !== undefined) setVisible(showEdit);
  }, [showEdit]);

  useEffect(() => {
    setTotal(data?.length);
    setPage(1);
    setSearchText('');
    setSearchedColumn('');
  }, [data?.length]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          // ref={(node) => {
          //   setSearchInput(node);
          // }}
          placeholder="Nhập từ khóa"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
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
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#007EB9' : undefined }} />
    ),
    onFilter: (value, record) =>
      typeof dataIndex === 'string'
        ? record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
        : typeof dataIndex === 'object'
        ? record[dataIndex[0]][dataIndex?.[1]]
            ?.toString()
            ?.toLowerCase()
            ?.includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      // if (visible) {
      //   setTimeout(() => searchInput?.select(), 100);
      // }
    },
    render: (text) =>
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
  };

  let columns = props.columns
    ?.filter((item) => !item.hide)
    ?.map((item) => ({
      ...item,
      ...(item?.search === 'search'
        ? getColumnSearchProps(item.dataIndex)
        : item?.search === 'sort'
        ? { sorter: (a, b) => a[item.dataIndex] - b[item.dataIndex] }
        : {}),
    }));

  if (addStt)
    columns.unshift({
      title: 'STT',
      render: (s, r, index) => index + 1 + (page - 1) * limit,
      align: 'center',
      width: 60,
    });

  return (
    <>
      {props?.children}
      {props?.hascreate && (
        <Button
          onClick={() => {
            setVisible(true);
          }}
          icon={<PlusOutlined />}
          type="primary"
          style={{ marginBottom: 8 }}
          size={props?.createSmall ? 'small' : 'middle'}
        >
          Thêm mới
        </Button>
      )}
      {props.hasTotal && (
        <h4 style={{ display: 'inline-block', margin: '0 0px 8px 50px', float: 'right' }}>
          Tổng số:
          <Input
            ref={refTotal}
            style={{
              width: '90px',
              fontWeight: 700,
              fontSize: 16,
              marginLeft: 10,
              color: '#007EB9',
            }}
            value={total ?? props?.data?.length ?? 0}
            readOnly
            // ref={setTableBaseRef}
          />
        </h4>
      )}
      <Table
        rowKey={(rec) => rec['id']}
        {...props?.otherProps}
        title={props?.title ? () => props.title : false}
        columns={columns}
        dataSource={props?.data ?? []}
        onChange={(pagination, filters, sorter, extra) => {
          setTotal(extra.currentDataSource.length ?? pagination.total);
          setPage(pagination.current ?? 1);
          setLimit(pagination.pageSize ?? 999);
          refTotal.current.focus();
        }}
        loading={props?.loading}
      />
      {Form && (
        <>
          {props?.formType === 'Drawer' ? (
            <Drawer
              width={props?.widthDrawer}
              onClose={() => {
                setVisible(false);
                setShowEdit && setShowEdit();
              }}
              destroyOnClose
              footer={false}
              // bodyStyle={{ padding: 0 }}
              visible={visible}
            >
              <Form
                onCancel={() => {
                  setVisible(false);
                  setShowEdit && setShowEdit();
                }}
              />
            </Drawer>
          ) : (
            <Modal
              width={props?.widthDrawer}
              onCancel={() => {
                setVisible(false);
                setShowEdit && setShowEdit();
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visible}
            >
              <Form
                onCancel={() => {
                  setVisible(false);
                  setShowEdit && setShowEdit();
                }}
              />
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default TableBaseStatic;
