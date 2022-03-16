import Table from '@/components/Table/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormNganh from './FormNganh';

const TableNganh = () => {
  const {
    visibleFormNganh,
    danhSachNganh,
    setDanhSachNganh,
    setRecordNganh,
    setEditGiayTo,
    setVisibleFormNganh,
  } = useModel('dottuyensinh');

  const columns: IColumn<DotTuyenSinh.NganhTuyenSinh>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên ngành',
      dataIndex: 'nganh',
      width: 150,
      align: 'center',
      render: (val: NganhChuyenNganh.Record) => <div>{val?.ten}</div>,
    },
    {
      title: 'Tổ hợp',
      dataIndex: 'danhSachToHop',
      width: 120,
      align: 'center',
      render: (val: string[]) => <div>{val?.join(', ')}</div>,
    },
    {
      title: 'Cơ sở đào tạo',
      dataIndex: 'danhSachCoSoDaoTao',
      align: 'center',
      width: 200,
      render: (val: CoSoDaoTao.Record[]) => (
        <>
          {val?.map((item) => (
            <Tag key={item._id}>{item?.ten}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record: DotTuyenSinh.NganhTuyenSinh) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditGiayTo(true);
                setVisibleFormNganh(true);
                setRecordNganh(record);
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
                const listNganhTemp = [...danhSachNganh];
                listNganhTemp.splice(record.index - 1, 1);
                setDanhSachNganh(listNganhTemp);
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
        data={danhSachNganh?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisibleFormNganh(true);
            setEditGiayTo(false);
            setRecordNganh(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        destroyOnClose
        visible={visibleFormNganh}
        onCancel={() => {
          setVisibleFormNganh(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormNganh />
      </Modal>
    </>
  );
};

export default TableNganh;
