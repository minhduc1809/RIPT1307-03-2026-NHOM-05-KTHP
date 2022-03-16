import Table from '@/components/Table/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormGiayTo from './FormGiayTo';

const TableGiayTo = (props: { fieldName: 'danhSachGiayToNopHoSo' | 'danhSachGiayToNopOnline' }) => {
  const modelDotTuyenSinh = useModel('dottuyensinh');
  const { setVisibleFormGiayTo, visibleFormGiayTo, setEditGiayTo, setRecordGiayTo } =
    modelDotTuyenSinh;
  const columns: IColumn<DotTuyenSinh.GiayTo>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 200,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 80,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (record: DotTuyenSinh.GiayTo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setEditGiayTo(true);
                setVisibleFormGiayTo(true);
                setRecordGiayTo(record);
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
                const listGiayToTemp = [...modelDotTuyenSinh?.[props.fieldName]];
                listGiayToTemp.splice(record.index - 1, 1);
                modelDotTuyenSinh?.[`set${props.fieldName}`](listGiayToTemp);
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
        data={modelDotTuyenSinh?.[props.fieldName]?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisibleFormGiayTo(true);
            setEditGiayTo(false);
            setRecordGiayTo(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        destroyOnClose
        visible={visibleFormGiayTo}
        onCancel={() => {
          setVisibleFormGiayTo(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormGiayTo fieldName="danhSachGiayToNopHoSo" />
      </Modal>
    </>
  );
};

export default TableGiayTo;
