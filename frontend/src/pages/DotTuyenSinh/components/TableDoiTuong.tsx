import Table from '@/components/Table/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormDoiTuong from './FormDoiTuong';

const TableDoiTuong = (props: { hinhThucDaoTao: string }) => {
  const {
    visibleFormDoiTuong,
    setVisibleFormDoiTuong,
    danhSachDoiTuong,
    setDanhSachDoiTuong,
    setRecordDoiTuong,
    setEditGiayTo,
  } = useModel('dottuyensinh');

  const { danhSach } = useModel('doituongtuyensinh');

  const columns: IColumn<DotTuyenSinh.DoiTuongTuyenSinh>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Mã đối tượng',
      dataIndex: 'maDoiTuong',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'thongTinDoiTuong',
      width: 150,
      align: 'center',
      render: (val: DoiTuongTuyenSinh.Record, record) => (
        <div>
          {val?.tenDoiTuong
            ? val.tenDoiTuong
            : danhSach?.find((item) => item.maDoiTuong === record?.maDoiTuong)?.tenDoiTuong}
        </div>
      ),
    },
    {
      title: 'Yêu cầu lựa chọn tổ hợp',
      dataIndex: 'yeuCauLuaChonToHop',
      width: 100,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record: DotTuyenSinh.DoiTuongTuyenSinh) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditGiayTo(true);
                setVisibleFormDoiTuong(true);
                setRecordDoiTuong(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Button
              onClick={() => {
                const listDoiTuongTemp = [...danhSachDoiTuong];
                listDoiTuongTemp.splice(record.index - 1, 1);
                setDanhSachDoiTuong(listDoiTuongTemp);
              }}
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        otherProps={{
          pagination: false,
          size: 'small',
        }}
        data={danhSachDoiTuong?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisibleFormDoiTuong(true);
            setEditGiayTo(false);
            setRecordDoiTuong(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        width={800}
        destroyOnClose
        visible={visibleFormDoiTuong}
        onCancel={() => {
          setVisibleFormDoiTuong(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormDoiTuong hinhThucDaoTao={props?.hinhThucDaoTao} />
      </Modal>
    </>
  );
};

export default TableDoiTuong;
