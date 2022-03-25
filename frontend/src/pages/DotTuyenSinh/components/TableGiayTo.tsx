import Table from '@/components/Table/Table';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormGiayTo from './FormGiayTo';

const TableGiayTo = (props: { fieldName: 'danhSachGiayToNopHoSo' | 'danhSachGiayToNopOnline' }) => {
  const modelDotTuyenSinh = useModel('dottuyensinh');
  const {
    setVisibleFormGiayToNopHoSo,
    setVisibleFormGiayToNopOnline,
    visibleFormGiayToNopHoSo,
    visibleFormGiayToNopOnline,
    setEditGiayTo,
    setRecordGiayTo,
  } = modelDotTuyenSinh;
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
      hide: props?.fieldName === 'danhSachGiayToNopOnline',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
      hide: props?.fieldName === 'danhSachGiayToNopOnline',
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 80,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
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
                if (props.fieldName === 'danhSachGiayToNopHoSo') setVisibleFormGiayToNopHoSo(true);
                else setVisibleFormGiayToNopOnline(true);
                setRecordGiayTo(record);
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
                const listGiayToTemp = [...modelDotTuyenSinh?.[props.fieldName]];
                listGiayToTemp.splice(record.index - 1, 1);
                modelDotTuyenSinh?.[`set${props.fieldName}`](listGiayToTemp);
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
      <Table
        otherProps={{
          pagination: false,
          size: 'small',
        }}
        data={modelDotTuyenSinh?.[props.fieldName]?.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns?.filter((item) => item.hide !== true)}
      >
        <Button
          style={{ marginBottom: 8 }}
          type="primary"
          onClick={() => {
            if (props.fieldName === 'danhSachGiayToNopHoSo') setVisibleFormGiayToNopHoSo(true);
            else setVisibleFormGiayToNopOnline(true);
            setEditGiayTo(false);
            setRecordGiayTo(undefined);
          }}
        >
          Thêm mới
        </Button>
      </Table>
      <Modal
        destroyOnClose
        visible={
          props.fieldName === 'danhSachGiayToNopHoSo'
            ? visibleFormGiayToNopHoSo
            : visibleFormGiayToNopOnline
        }
        onCancel={() => {
          if (props.fieldName === 'danhSachGiayToNopHoSo') setVisibleFormGiayToNopHoSo(false);
          else setVisibleFormGiayToNopOnline(false);
        }}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormGiayTo fieldName={props?.fieldName} />
      </Modal>
    </>
  );
};

export default TableGiayTo;
