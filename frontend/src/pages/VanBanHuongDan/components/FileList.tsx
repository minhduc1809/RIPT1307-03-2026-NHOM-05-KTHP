/* eslint-disable no-underscore-dangle */
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import Table from '@/components/Table/Table';
import { useAccess, useModel } from 'umi';
import Form from './FormFile';

const FileList = () => {
  const access = useAccess();
  const {
    visibleFormFile,
    setVisibleFormFile,
    record,
    putThuMucModel,
    setRecordFile,
    setEditFile,
  } = useModel('vanbanhuongdan');

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
      search: 'search',
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

  if (access.adminVaQuanTri)
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
      {access.adminVaQuanTri && (
        <Button type="primary" style={{ marginBottom: 8, marginRight: 8 }} onClick={handleAdd}>
          <PlusOutlined />
          Thêm mới
        </Button>
      )}

      <Table
        columns={columns}
        data={record?.danhSachTep?.reverse()?.map((item, index) => ({ ...item, index: index + 1 }))}
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
