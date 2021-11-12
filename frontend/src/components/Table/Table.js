import { SearchOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Input, Table, Drawer, Modal } from 'antd';
import React from 'react';

class App extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    visible: false,
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder="Nhập từ khóa"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Làm lại
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#CC0D00' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const Form = this.props?.Form;
    return (
      <>
        {this.props?.children}
        {this.props?.hascreate && (
          <Button
            onClick={() => {
              this.setState({ visible: true });
            }}
            icon={<PlusCircleFilled />}
            type="primary"
          >
            Thêm mới
          </Button>
        )}
        {this.props.hasTotal && (
          <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
            Tổng số:
            <Input
              style={{ width: '90px', fontWeight: 700, fontSize: 16, marginLeft: 10 }}
              value={this.props?.data?.length ?? 0}
              readOnly
              // ref={this.setTableBaseRef}
            />
          </h3>
        )}
        <Table
          {...this.props?.otherProps}
          title={this.props?.title ? () => this.props.title : false}
          columns={this.props.columns?.map((item) => {
            return item?.search === 'search'
              ? {
                  ...item,
                  ...this.getColumnSearchProps(item.dataIndex),
                }
              : { ...item };
          })}
          dataSource={this.props?.data ?? []}
        />
        {Form && (
          <>
            {this.props?.formType === 'Drawer' ? (
              <Drawer
                width={this.props?.widthDrawer}
                onClose={() => {
                  this.setState({ visible: false });
                }}
                destroyOnClose
                footer={false}
                // bodyStyle={{ padding: 0 }}
                visible={this.state.visible}
              >
                <Form
                  onCancel={() => {
                    this.setState({ visible: false });
                  }}
                />
              </Drawer>
            ) : (
              <Modal
                width={this.props?.widthDrawer}
                onCancel={() => {
                  this.setState({ visible: false });
                }}
                destroyOnClose
                footer={false}
                // bodyStyle={{ padding: 0 }}
                visible={this.state.visible}
              >
                <Form
                  onCancel={() => {
                    this.setState({ visible: false });
                  }}
                />
              </Modal>
            )}
          </>
        )}
      </>
    );
  }
}

export default App;
