/* eslint-disable no-underscore-dangle */
import { useModel } from 'umi';
import { DeleteOutlined, EditOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';
import Form from './FormFile';
import { useState } from 'react';
import { includes } from '@/utils/utils';
import type { IColumn } from '@/utils/interfaces';

const FileList = (props: { data: VanBanHuongDan.TepTin[] }) => {
  const vaiTro = localStorage.getItem('vaiTro');
  const {
    visibleFormFile,
    setVisibleFormFile,
    record,
    putThuMucModel,
    setRecordFile,
    setEditFile,
  } = useModel('vanbanhuongdan');
  const [data, setData] = useState<VanBanHuongDan.TepTin[]>(
    props.data?.map((item, index) => {
      return { ...item, index: index + 1 };
    }),
  );
  const delFile = (id: string) => {
    putThuMucModel({
      id: record._id,
      data: {
        ...record,
        danhSachTep: record?.danhSachTep?.filter((item) => item._id !== id),
      },
    });
  };

  const handleEdit = (recordFile: VanBanHuongDan.TepTin) => {
    setRecordFile(recordFile);
    setVisibleFormFile(true);
    setEditFile(true);
  };

  const handleAdd = () => {
    setRecordFile({} as VanBanHuongDan.TepTin);
    setVisibleFormFile(true);
    setEditFile(false);
  };

  const onSearch = (value: string) => {
    const newData = props?.data?.filter((item) => includes(item.ten, value));
    setData(
      newData?.map((item, index) => {
        return { ...item, index: index + 1 };
      }),
    );
  };

  const columns: IColumn<VanBanHuongDan.TepTin>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên văn bản',
      dataIndex: 'ten',
      align: 'center',
      width: 250,
    },
    {
      title: 'Tệp đính kèm',
      align: 'center',
      dataIndex: 'url',
      render: (val, recordFile) => (
        <a href={val} target="_blank">
          <PaperClipOutlined />
          {recordFile.ten}
        </a>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 300,
    },
  ];

  if (vaiTro === 'Admin')
    columns.push({
      title: 'Thao tác',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (recordFile: VanBanHuongDan.TepTin) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(recordFile)} type="default" shape="circle">
              <EditOutlined />
            </Button>
          </Tooltip>

          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => delFile(recordFile._id)}
              title="Bạn có chắc chắn muốn xóa văn bản này"
            >
              <Button type="primary" shape="circle">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    });

  return (
    <>
      <div style={{ display: 'flex' }}>
        {vaiTro === 'Admin' && (
          <Button type="primary" style={{ marginBottom: 8, marginRight: 8 }} onClick={handleAdd}>
            <PlusOutlined />
            Thêm mới
          </Button>
        )}
        <Input.Search
          style={{ width: 300, marginBottom: 8 }}
          placeholder="Tìm kiếm theo tên văn bản"
          onSearch={onSearch}
          enterButton
          allowClear
        />
      </div>

      <Table
        pagination={{
          total: data?.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
          showTotal: (tongSo: number) => {
            return <div>Tổng số: {tongSo}</div>;
          },
        }}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
      />
      <Modal
        maskClosable={false}
        destroyOnClose
        footer={false}
        onCancel={() => setVisibleFormFile(false)}
        bodyStyle={{ padding: 0 }}
        visible={visibleFormFile}
      >
        <Form />
      </Modal>
    </>
  );
};

export default FileList;
