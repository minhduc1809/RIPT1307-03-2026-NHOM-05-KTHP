/* eslint-disable no-underscore-dangle */
import { useModel } from 'umi';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Table, Tooltip } from 'antd';
import Form from './FormFile';

const FileList = (props: { data: VanBanHuongDan.TepTin[] }) => {
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

  return (
    <>
      <Button type="primary" style={{ marginBottom: 8 }} onClick={handleAdd}>
        <PlusOutlined />
        Thêm mới
      </Button>
      <Table
        scroll={{ x: 1000 }}
        columns={[
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
            render: (val) => (
              <a href={val} target="_blank">
                {val?.split('-')?.pop()}
              </a>
            ),
          },
          {
            title: 'Mô tả',
            dataIndex: 'moTa',
            align: 'center',
            width: 300,
          },
          {
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
          },
        ]}
        dataSource={props.data?.map((item, index) => {
          return { ...item, index: index + 1 };
        })}
      />
      <Modal
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
