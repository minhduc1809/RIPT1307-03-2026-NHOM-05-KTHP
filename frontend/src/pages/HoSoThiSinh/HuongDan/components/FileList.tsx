/* eslint-disable no-underscore-dangle */
import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './FormFile';

const FileList = (props: { type: 'Admin' | 'User' }) => {
  const {
    visibleFormFile,
    setVisibleFormFile,
    record,
    putThuMucModel,
    setRecordFile,
    setEditFile,
  } = useModel('vanbanhuongdan');

  const canCreate = useCheckAccess('thu-muc-van-ban:create-file');
  const canUpdate = useCheckAccess('thu-muc-van-ban:update-file');
  const canDelete = useCheckAccess('thu-muc-van-ban:delete-file');

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
        <>
          <PaperClipOutlined />{' '}
          <a href={val} target="_blank" rel="noreferrer">
            {recordFile.ten}
          </a>
        </>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 300,
    },
  ];

  if (props.type === 'Admin')
    columns.push({
      title: 'Thao tác',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (recordFile: VanBanHuongDan.TepTin) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              disabled={!canUpdate}
              onClick={() => handleEdit(recordFile)}
              type="default"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              disabled={!canDelete}
              onConfirm={() => delFile(recordFile._id)}
              title="Bạn có chắc chắn muốn xóa văn bản này"
            >
              <Button disabled={!canDelete} type="primary" shape="circle">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    });

  return (
    <>
      {props.type === 'Admin' && (
        <Button
          disabled={!canCreate}
          type="primary"
          style={{ marginBottom: 8, marginRight: 8 }}
          onClick={handleAdd}
        >
          <PlusOutlined />
          Thêm mới
        </Button>
      )}

      <Table
        otherProps={{
          pagination: false,
        }}
        columns={columns}
        data={record?.danhSachTep?.map((item, index) => ({ ...item, index: index + 1 }))}
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
