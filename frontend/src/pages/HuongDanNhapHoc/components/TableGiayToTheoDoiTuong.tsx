import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Table, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormDoiTuongGiayTo from './FormGiayToTheoDoiTuong';

const TableDoiTuongGiayTo = () => {
  const {
    setEditDoiTuongGiayTo,
    setVisibleFormDoiTuongGiayTo,
    setRecordDoiTuongGiayTo,
    danhSachDoiTuongGiayTo,
    setDanhSachDoiTuongGiayTo,
    visibleFormDoiTuongGiayTo,
    setDanhSachGiayToTheoDoiTuong,
  } = useModel('huongdannhaphoc');

  const columns: IColumn<DotNhapHoc.GiayToTheoDoiTuong>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Đối tượng',
      dataIndex: 'loaiDoiTuong',
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      render: (record: DotNhapHoc.GiayToTheoDoiTuong) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditDoiTuongGiayTo(true);
                setVisibleFormDoiTuongGiayTo(true);
                setRecordDoiTuongGiayTo(record);
                setDanhSachGiayToTheoDoiTuong(record.danhSachGiayToCanNop);
              }}
              shape="circle"
              icon={<EditOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => {
                const listGiayToTemp = [...danhSachDoiTuongGiayTo];
                listGiayToTemp.splice(record.index - 1, 1);
                setDanhSachDoiTuongGiayTo(listGiayToTemp);
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        icon={<PlusCircleFilled />}
        style={{ marginBottom: 8 }}
        type="primary"
        onClick={() => {
          setVisibleFormDoiTuongGiayTo(true);
          setEditDoiTuongGiayTo(false);
          setRecordDoiTuongGiayTo(undefined);
          setDanhSachGiayToTheoDoiTuong([]);
        }}
      >
        Thêm mới
      </Button>
      <Table
        pagination={false}
        columns={columns}
        dataSource={danhSachDoiTuongGiayTo.map((item, index) => ({ ...item, index: index + 1 }))}
      />
      <Modal
        width={800}
        destroyOnClose
        visible={visibleFormDoiTuongGiayTo}
        onCancel={() => {
          setVisibleFormDoiTuongGiayTo(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormDoiTuongGiayTo />
      </Modal>
    </>
  );
};

export default TableDoiTuongGiayTo;
