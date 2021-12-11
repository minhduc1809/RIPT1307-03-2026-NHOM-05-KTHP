/* eslint-disable no-underscore-dangle */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, List, Modal, Popconfirm, Select, Tooltip, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';
import FileList from './components/FileList';

const VanBanHuongDan = () => {
  const access = useAccess();
  const {
    getThuMucModel,
    loading,
    danhSach,
    page,
    limit,
    visibleForm,
    setEdit,
    setRecord,
    setVisibleForm,
    record,
    total,
    setPage,
    setLimit,
    delThuMucModel,
    visibleFileList,
    setVisibleFileList,
    condition,
    setCondition,
    getThuMucUserModel,
  } = useModel('vanbanhuongdan');

  const { danhSachHinhThucDaoTao, getAllHinhThucDaoTaoModel } = useModel('lophanhchinh');

  const handleEdit = (thuMuc: VanBanHuongDan.ThuMuc) => {
    setEdit(true);
    setRecord(thuMuc);
    setVisibleForm(true);
  };

  const handleAdd = () => {
    setEdit(false);
    setVisibleForm(true);
    setRecord({} as VanBanHuongDan.ThuMuc);
  };

  const handleOnMouseOver = (e: any) => {
    if (!e) return;
    const listItemClasses = 'ant-list-item';
    if (e.classList.contains(listItemClasses)) {
      const par = e.parentElement.children;
      for (let i = 0; i < par.length; i += 1) {
        par[i].style.backgroundColor = '#fff';
        par[i].style.cursor = 'default';
      }
      e.style.cursor = 'pointer';
      e.style.backgroundColor = '#f0eee9';
    } else {
      handleOnMouseOver(e.parentElement);
    }
  };

  const handleOnMouseOut = (e: any) => {
    if (!e) return;
    const listItemClasses = 'ant-list-item';
    if (e.classList.contains(listItemClasses)) {
      e.style.cursor = 'default';
      e.style.backgroundColor = '#fff';
    } else {
      handleOnMouseOver(e.parentElement);
    }
  };

  const handleListChange = (pageNumber: number, pageSize?: number) => {
    setPage(pageNumber || 1);
    setLimit(pageSize || 10);
  };

  const handleDel = (id: string) => {
    delThuMucModel({ id });
  };

  const showFileList = (thuMuc: VanBanHuongDan.ThuMuc) => {
    setVisibleFileList(true);
    setRecord(thuMuc);
  };

  useEffect(() => {
    if (access.adminVaQuanTri) getAllHinhThucDaoTaoModel();
  }, []);

  useEffect(() => {
    if (access.adminVaQuanTri) getThuMucModel();
    else getThuMucUserModel();
  }, [page, limit, condition]);

  return (
    <>
      <Card title="Văn bản hướng dẫn">
        {access.admin && (
          <Select
            value={condition?.hinhThucDaoTaoId ?? -1}
            onChange={(val: number) => {
              setPage(1);
              setCondition({ ...condition, hinhThucDaoTaoId: val });
            }}
            style={{ marginBottom: 8, width: 250, marginRight: 8 }}
          >
            <Select.Option value={-1} key={-1}>
              Tất cả hình thức đào tạo
            </Select.Option>
            {danhSachHinhThucDaoTao?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.ten_hinh_thuc_dao_tao}
              </Select.Option>
            ))}
          </Select>
        )}
        {access.adminVaQuanTri && (
          <Button onClick={handleAdd} style={{ marginBottom: 8 }} type="primary">
            <PlusOutlined /> Thêm mới
          </Button>
        )}
        <List
          loading={loading}
          split
          bordered
          pagination={{
            onChange: (pageNumber: number, pageSize?: number) => {
              handleListChange(pageNumber, pageSize);
            },
            current: page,
            pageSize: limit,
            position: 'bottom',
            total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50', '100'],
            showTotal: (tongSo: number) => {
              return <div>Tổng số: {tongSo}</div>;
            },
          }}
          itemLayout="horizontal"
          dataSource={danhSach}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              onMouseOut={(e) => handleOnMouseOut(e.target)}
              onMouseOver={(e) => handleOnMouseOver(e.target)}
              actions={
                access.adminVaQuanTri
                  ? [
                      <Tooltip title="Chỉnh sửa">
                        <Button
                          shape="circle"
                          icon={<EditOutlined />}
                          title="Sửa"
                          onClick={() => handleEdit(item)}
                        />
                      </Tooltip>,
                      <Tooltip title="Xóa">
                        <Popconfirm
                          title="Bạn có chắc muốn xóa?"
                          // eslint-disable-next-line no-underscore-dangle
                          onConfirm={() => handleDel(item._id)}
                        >
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            title="Xóa"
                          />
                        </Popconfirm>
                      </Tooltip>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={
                  <div onClick={() => showFileList(item)}>
                    {' '}
                    <Avatar
                      shape="square"
                      src="data:image/jpeg;base64,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"
                    />
                  </div>
                }
                title={
                  <div onClick={() => showFileList(item)} style={{ display: 'flex' }}>
                    <Typography.Text strong>{`${item.ten || 'CHƯA ĐẶT TÊN'}`}</Typography.Text>
                  </div>
                }
                description={
                  <div onClick={() => showFileList(item)}>
                    <div>Mô tả: {item.moTa || ''}</div>
                    <div>Số lượng văn bản: {item?.danhSachTep?.length ?? 0}</div>
                    <div>
                      Hình thức đào tạo:{' '}
                      {danhSachHinhThucDaoTao?.find(
                        (hinhThuc) => hinhThuc.id === item.hinhThucDaoTaoId,
                      )?.display_name ?? ''}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
      <Modal
        destroyOnClose
        footer={false}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisibleForm(false);
        }}
        visible={visibleForm}
      >
        <Form />
      </Modal>
      <Modal
        title={record.ten}
        destroyOnClose
        footer={
          <Button type="primary" onClick={() => setVisibleFileList(false)}>
            OK
          </Button>
        }
        width="80%"
        style={{ maxWidth: '1200px' }}
        onCancel={() => setVisibleFileList(false)}
        visible={visibleFileList}
      >
        <FileList />
      </Modal>
    </>
  );
};

export default VanBanHuongDan;
