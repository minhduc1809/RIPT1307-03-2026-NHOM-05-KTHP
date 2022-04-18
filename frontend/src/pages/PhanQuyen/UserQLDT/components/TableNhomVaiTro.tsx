import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Modal, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormUserQLDT from './Form';

const TableNhomChucNang = () => {
  const { recordUser, getDoiTuongPhanNhomByMucDoModel, putUserPhanNhomModel, vaiTro } =
    useModel('phanquyen');
  const [visible, setVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [record, setRecord] = useState<PhanQuyen.PhanNhom & { index: number }>(
    {} as PhanQuyen.PhanNhom & { index: number },
  );
  const [danhSachPhanNhom, setDanhSachPhanNhom] = useState<
    (PhanQuyen.PhanNhom & { index: number })[]
  >(
    recordUser?.phanNhom?.danhSachPhanNhom?.map((item, index) => ({ ...item, index: index + 1 })) ??
      [],
  );

  const columns: IColumn<PhanQuyen.PhanNhom>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Nhóm vai trò',
      dataIndex: 'nhomVaiTroId',
      align: 'center',
    },
    {
      title: 'Mức độ',
      dataIndex: 'mucDo',
      align: 'center',
      width: '150px',
    },
    {
      title: 'Id đối tượng',
      dataIndex: 'idDoiTuong',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'tenDoiTuong',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: '150px',
      render: (recordPhanNhom: PhanQuyen.PhanNhom & { index: number }) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord(recordPhanNhom);
                setEdit(true);
                setVisible(true);
                if (recordPhanNhom?.mucDo && recordPhanNhom?.mucDo !== 'Tất cả') {
                  getDoiTuongPhanNhomByMucDoModel(recordPhanNhom?.mucDo);
                }
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
                setDanhSachPhanNhom(
                  danhSachPhanNhom
                    ?.filter((item) => item.index !== recordPhanNhom?.index)
                    ?.map((item, index) => ({ ...item, index: index + 1 })),
                );
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
    <Card title="Danh sách phân nhóm">
      <Button
        icon={<PlusCircleOutlined />}
        type="primary"
        onClick={() => {
          setRecord({} as PhanQuyen.PhanNhom & { index: number });
          setVisible(true);
          setEdit(false);
        }}
      >
        Thêm nhóm vai trò
      </Button>

      <Table
        hasTotal
        otherProps={{ pagination: false }}
        columns={columns}
        data={danhSachPhanNhom}
      />
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Popconfirm
          onConfirm={() => {
            putUserPhanNhomModel({
              userId: recordUser?.user?.id?.toString() || '',
              danhSachPhanNhom,
              vaiTro,
              service: 'Odoo',
            });
          }}
          title="Bạn có chắc chắn muốn lưu?"
        >
          <Button icon={<SaveOutlined />}>Lưu</Button>
        </Popconfirm>
      </div>

      <Modal
        destroyOnClose
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
        bodyStyle={{ padding: 0 }}
      >
        <FormUserQLDT
          edit={edit}
          data={danhSachPhanNhom}
          setData={setDanhSachPhanNhom}
          record={record}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </Card>
  );
};

export default TableNhomChucNang;
