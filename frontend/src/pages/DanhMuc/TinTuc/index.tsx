/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Select } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewTinTuc from './components/ViewTinTuc';

const TinTuc = () => {
  const {
    loading,
    chuDe,
    getTinTucModel,
    setEdit,
    setVisibleForm,
    delTinTucModel,
    setRecord,
    page,
    limit,
    setChuDe,
  } = useModel('tintuc');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [recordTT, setRecordTT] = useState<TinTuc.Record>({} as TinTuc.Record);
  const { getAllChuDeModel, danhSach } = useModel('chude');

  const handleEdit = (record: TinTuc.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: ColumnProps<TinTuc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'idTopic',
      align: 'center',
      width: 200,
    },
    {
      title: 'Người đăng',
      dataIndex: ['nguoiDang', 'fullname'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'ngayDang',
      render: (val) => <div>{moment(val).format('DD/MM/YYYY')}</div>,
      align: 'center',
      width: 100,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 180,
      fixed: 'right',
      render: (record) => (
        <>
          <Button
            onClick={() => {
              setVisibleModal(true);
              setRecordTT(record);
            }}
            type="default"
            shape="circle"
          >
            <EyeOutlined />
          </Button>
          <Divider type="vertical" />
          <Button onClick={() => handleEdit(record)} type="default" shape="circle">
            <EditOutlined />
          </Button>
          <Divider type="vertical" />

          <Popconfirm
            onConfirm={() => delTinTucModel({ id: record._id })}
            title="Bạn có chắc chắn muốn xóa chủ đề này"
          >
            <Button type="primary" shape="circle">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    getAllChuDeModel();
  }, []);

  const onChangeLoaiTinTuc = (value: string) => {
    setChuDe(value);
  };

  return (
    <TableBase
      columns={columns}
      getData={getTinTucModel}
      loading={loading}
      dependencies={[chuDe, page, limit]}
      modelName="tintuc"
      title="Quản lý tin tức"
      Form={Form}
      hascreate
    >
      <Select
        onChange={onChangeLoaiTinTuc}
        value={chuDe}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        <Select.Option value="Tất cả">Tất cả</Select.Option>
        {danhSach?.map((item: ChuDe.Record) => (
          <Select.Option key={item._id} value={item._id}>
            {item?.name}
          </Select.Option>
        ))}
      </Select>
      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button onClick={() => setVisibleModal(false)} type="primary">
            Đóng
          </Button>
        }
        visible={visibleModal}
      >
        <ViewTinTuc record={recordTT} />
      </Modal>
    </TableBase>
  );
};

export default TinTuc;
