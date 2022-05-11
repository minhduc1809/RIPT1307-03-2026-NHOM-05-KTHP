import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import type { IColumn } from '@/utils/interfaces';
import Table from '@/components/Table/Table';
import { useModel } from 'umi';
import FormThongTinGiaDinh from './FormThongTinGiaDinh';
import { Button, Divider, message, Modal, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const TableThongTinGiaDinh = (props: { mode: 'view' | 'handle' }) => {
  const { record, setRecord, setRecordGiaDinh, setEdit } = useModel('ketquaxettuyen');
  const [visible, setVisible] = useState<boolean>(false);

  const onCancelForm = () => {
    setVisible(false);
  };

  const handleCreate = () => {
    setVisible(true);
    setEdit(false);
    setRecordGiaDinh(undefined);
  };

  const columns: IColumn<KetQuaXetTuyen.ThanhVienGiaDinh>[] = [
    {
      title: 'Quan hệ',
      dataIndex: 'loaiThanhVien',
      width: 100,
      align: 'center',
    },
    {
      title: 'Họ đệm',
      dataIndex: 'hoDem',
      width: 200,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: 100,
      align: 'center',
    },
    {
      title: 'Năm sinh',
      dataIndex: 'namSinh',
      width: 100,
      align: 'center',
    },
    {
      title: 'Nghề nghiệp',
      dataIndex: 'ngheNghiep',
      width: 200,
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      width: 150,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      align: 'center',
    },
    {
      title: 'Cơ quan công tác',
      dataIndex: 'coQuanCongTac',
      width: 200,
      align: 'center',
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'quocTich',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tôn giáo',
      dataIndex: 'tonGiao',
      width: 150,
      align: 'center',
    },
    {
      title: 'Dân tộc',
      dataIndex: 'danToc',
      width: 150,
      align: 'center',
    },
    {
      title: 'Địa chỉ hiện nay',
      dataIndex: 'diaChiHienNay',
      width: 200,
      align: 'center',
      render: (val: DonViHanhChinh.Record) => (
        <div>
          {[val.diaChi, val.tenXaPhuong, val.tenQH, val.tenTP]
            .filter((item) => item !== undefined && item !== '')
            ?.join(', ')}
        </div>
      ),
    },
    {
      title: 'Hộ khẩu thường trú',
      dataIndex: 'hoKhauThuongTru',
      width: 200,
      align: 'center',
      render: (val: DonViHanhChinh.Record) => (
        <div>
          {[val.diaChi, val.tenXaPhuong, val.tenQH, val.tenTP]
            .filter((item) => item !== undefined && item !== '')
            ?.join(', ')}
        </div>
      ),
    },
    {
      title: 'Hoạt động chính trị xã hội',
      dataIndex: 'hoatDongChinhTriXaHoi',
      width: 200,
      align: 'center',
    },
    {
      title: 'Thao tác',
      width: 120,
      align: 'center',
      fixed: 'right',
      hide: props.mode === 'view',
      render: (val: KetQuaXetTuyen.ThanhVienGiaDinh) => (
        <>
          <Button
            onClick={() => {
              setVisible(true);
              setEdit(true);
              setRecordGiaDinh(val);
            }}
            shape="circle"
            icon={<EditOutlined />}
          />
          <Divider type="vertical" />
          <Popconfirm
            onConfirm={() => {
              setRecord({
                ...record,
                thongTinGiaDinh:
                  record?.thongTinGiaDinh
                    ?.map((item, index) => ({ ...item, index }))
                    ?.filter((item) => item.index !== val.index) ?? [],
              } as KetQuaXetTuyen.Record);
              message.success('Xóa thành công');
            }}
            title="Bạn có chắc chắn xóa?"
          >
            <Button shape="circle" type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {props.mode === 'handle' && (
        <Button
          onClick={handleCreate}
          style={{ marginBottom: 8 }}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
          Thêm mới
        </Button>
      )}
      <Table
        widthDrawer={800}
        otherProps={{ scroll: { x: 2000 }, pagination: false }}
        data={record?.thongTinGiaDinh ?? []}
        columns={columns}
      />
      <Modal
        destroyOnClose
        footer={false}
        bodyStyle={{ padding: 0 }}
        width={800}
        visible={visible}
        onCancel={onCancelForm}
      >
        <FormThongTinGiaDinh onCancel={onCancelForm} />
      </Modal>
    </>
  );
};

export default TableThongTinGiaDinh;
