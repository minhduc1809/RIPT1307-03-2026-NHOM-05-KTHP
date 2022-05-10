import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Table, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormDoiTuongLePhi from './FormLePhiTheoDoiTuong';

const TableDoiTuongLePhi = () => {
  const {
    setEditDoiTuongLePhi,
    setVisibleFormDoiTuongLePhi,
    setRecordDoiTuongLePhi,
    danhSachDoiTuongLePhi,
    setDanhSachDoiTuongLePhi,
    visibleFormDoiTuongLePhi,
    setDanhSachLePhiTheoDoiTuong,
  } = useModel('huongdannhaphoc');

  const columns: IColumn<DotNhapHoc.LePhiTheoDoiTuong>[] = [
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
      render: (record: DotNhapHoc.LePhiTheoDoiTuong) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditDoiTuongLePhi(true);
                setVisibleFormDoiTuongLePhi(true);
                setRecordDoiTuongLePhi(record);
                setDanhSachLePhiTheoDoiTuong(record.danhSachLePhiCanNop);
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
                const listLePhiTemp = [...danhSachDoiTuongLePhi];
                listLePhiTemp.splice(record.index - 1, 1);
                setDanhSachDoiTuongLePhi(listLePhiTemp);
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
          setVisibleFormDoiTuongLePhi(true);
          setEditDoiTuongLePhi(false);
          setRecordDoiTuongLePhi(undefined);
        }}
      >
        Thêm mới
      </Button>
      <Table
        pagination={false}
        columns={columns}
        dataSource={danhSachDoiTuongLePhi.map((item, index) => ({ ...item, index: index + 1 }))}
      />
      <Modal
        width={1000}
        destroyOnClose
        visible={visibleFormDoiTuongLePhi}
        onCancel={() => {
          setVisibleFormDoiTuongLePhi(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormDoiTuongLePhi />
      </Modal>
    </>
  );
};

export default TableDoiTuongLePhi;
