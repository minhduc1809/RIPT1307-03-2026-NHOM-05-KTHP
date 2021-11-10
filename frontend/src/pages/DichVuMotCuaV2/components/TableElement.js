import { SearchOutlined, PlusCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Drawer, Modal, Tooltip, Divider, Popconfirm } from 'antd';
import React from 'react';
import moment from 'moment';

class App extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    data: this.props?.data?.map((item, index) => ({ ...item, index })) ?? [],
    visible: false,
    edit: false,
    record: this.props?.recordForm,
    dataCauHinh: [],
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

  handleData = (values) => {
    let valueFinal = values?.value ?? '';
    switch (values?.type) {
      case 'UPLOAD_SINGLE': {
        valueFinal = values?.value?.[0]?.url;
        break;
      }
      case 'UPLOAD_MULTI': {
        valueFinal = values?.value?.map((item) => item?.url);
        break;
      }
      case 'DATE_PICKER': {
        valueFinal = values?.value ? moment(values?.value)?.format('HH:mm DD/MM/YYYY') : undefined;
        break;
      }
      case 'DON_VI_HANH_CHINH': {
        valueFinal = [
          values?.value?.soNhaTenDuong,
          values?.value?.tenPhuongXa,
          values?.value?.tenQuanHuyen,
          values?.value?.tenTinh,
        ]
          ?.filter((item) => item !== undefined)
          ?.join(', ');
        break;
      }
      case 'CHECKLIST': {
        valueFinal = values?.value?.join(', ');
        break;
      }
      default: {
        break;
      }
    }
    return valueFinal;
  };

  render() {
    const Form = this.props?.Form;
    const columns = this.props.columns?.map((item) => {
      return item?.search === 'search'
        ? {
            ...item,
            ...this.getColumnSearchProps(item.dataIndex),
          }
        : { ...item };
    });
    if (!['view', 'handle'].includes(this.props?.type)) {
      columns.push({
        title: 'Thao tác',
        width: 120,
        align: 'center',
        fixed: 'right',
        render: (recordRow) => (
          <>
            <Tooltip title="Chỉnh sửa">
              <Button
                onClick={() => {
                  this.setState({
                    record: {
                      thongTinDichVu: this.state.dataCauHinh?.find(
                        (item) => item?.index === recordRow?.index,
                      ),
                      index: recordRow?.index,
                    },
                    edit: true,
                    visible: true,
                  });
                }}
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              />
            </Tooltip>{' '}
            <Divider type="vertical" />
            <Tooltip title="Xóa">
              <Popconfirm
                onConfirm={() => {
                  this.setState({
                    data: this.state.data?.filter((item) => item?.index !== recordRow?.index),
                  });
                }}
                title={'Bạn có chắc chắn muốn xóa?'}
              >
                <Button shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </>
        ),
      });
    }
    return (
      <>
        {this.props?.children}
        {this.props?.hascreate && !['view', 'handle']?.includes(this.props?.type) && (
          <Button
            onClick={() => {
              this.setState({ visible: true, record: this.props?.recordForm, edit: false });
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
              value={this.state?.data?.length ?? 0}
              readOnly
              // ref={this.setTableBaseRef}
            />
          </h3>
        )}
        <Table
          {...this.props?.otherProps}
          title={this.props?.title ? () => this.props.title : false}
          columns={columns}
          dataSource={this.state?.data ?? []}
        />
        {Form && (
          <>
            {this.props?.formType === 'Drawer' ? (
              <Drawer
                title={this.state.edit ? 'Chỉnh sửa' : 'Thêm mới'}
                width={this.props?.widthDrawer}
                onClose={() => {
                  this.setState({ visible: false });
                }}
                destroyOnClose
                footer={false}
                bodyStyle={{ padding: 0 }}
                visible={this.state.visible}
              >
                <Form
                  hideTitle
                  hideCamKet
                  edit={this.state.edit}
                  handleAdd={(values, valuesFinal) => {
                    const rowNew = {};
                    valuesFinal?.forEach((item) => {
                      rowNew[item?.label] = this.handleData(item);
                    });
                    const dataTemp = [rowNew, ...this.state.data];
                    const dataCauHinhTemp = [valuesFinal, ...this.state.dataCauHinh];
                    this.setState({
                      data: dataTemp?.map((item, index) => ({ ...item, index })),
                      visible: false,
                      dataCauHinh: dataCauHinhTemp?.map((item, index) => ({ ...item, index })),
                    });
                  }}
                  handleEdit={(values, valuesFinal, position) => {
                    const rowNew = {};
                    valuesFinal?.forEach((item) => {
                      rowNew[item?.label] = this.handleData(item);
                    });
                    const dataTemp = [...this.state.data];
                    dataTemp?.splice(position, 1, rowNew);
                    const dataCauHinhTemp = [...this.state.dataCauHinh];
                    dataCauHinhTemp?.splice(position, 1, {
                      cauHinhBieuMau: valuesFinal,
                    });

                    this.setState({
                      data: dataTemp?.map((item, index) => ({ ...item, index })),
                      visible: false,
                      dataCauHinh: dataCauHinhTemp?.map((item, index) => ({ ...item, index })),
                    });
                  }}
                  title={this.props?.title}
                  textSaveButton={this.props?.textSaveButton}
                  record={this.state.record}
                  onCancel={() => {
                    this.setState({ visible: false });
                  }}
                />
              </Drawer>
            ) : (
              <Modal
                title={this.state.edit ? 'Chỉnh sửa' : 'Thêm mới'}
                width={this.props?.widthDrawer}
                onCancel={() => {
                  this.setState({ visible: false });
                }}
                destroyOnClose
                footer={false}
                bodyStyle={{ padding: 0 }}
                visible={this.state.visible}
              >
                <Form
                  hideTitle
                  hideCamKet
                  edit={this.state.edit}
                  handleAdd={(values, valuesFinal) => {
                    const dataTable = this.props?.danhSachDataTable ?? {};
                    const rowNew = {};
                    valuesFinal?.forEach((item) => {
                      rowNew[item?.label] = this.handleData(item);
                    });
                    const dataTemp = [rowNew, ...this.state.data];
                    const dataCauHinhTemp = [
                      { cauHinhBieuMau: valuesFinal },
                      ...this.state.dataCauHinh,
                    ];
                    dataTable[this.props?.name] = dataCauHinhTemp;
                    this.props.setDanhSachDataTable(dataTable);
                    this.setState({
                      data: dataTemp?.map((item, index) => ({ ...item, index })),
                      visible: false,
                      dataCauHinh: dataCauHinhTemp?.map((item, index) => ({ ...item, index })),
                    });
                  }}
                  handleEdit={(values, valuesFinal, position) => {
                    const rowNew = {};
                    valuesFinal?.forEach((item) => {
                      rowNew[item?.label] = this.handleData(item);
                    });
                    const dataTemp = [...this.state.data];
                    dataTemp?.splice(position, 1, rowNew);
                    const dataCauHinhTemp = [...this.state.dataCauHinh];
                    dataCauHinhTemp?.splice(position, 1, {
                      cauHinhBieuMau: valuesFinal,
                    });
                    this.setState({
                      data: dataTemp?.map((item, index) => ({ ...item, index })),
                      visible: false,
                      dataCauHinh: dataCauHinhTemp?.map((item, index) => ({ ...item, index })),
                    });
                  }}
                  textSaveButton={this.props?.textSaveButton}
                  record={this.state.record}
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
