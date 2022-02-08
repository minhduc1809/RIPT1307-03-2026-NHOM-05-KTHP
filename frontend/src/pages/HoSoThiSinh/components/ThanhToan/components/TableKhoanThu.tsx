import Table from '@/components/Table/Table';
import ThanhToan from '@/components/ThanhToan';
import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useState } from 'react';

const TableKhoanThu = (props: { type: 'dathanhtoan' | 'chuathanhtoan' }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const columns: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Khoản thu',
      dataIndex: 'khoanThu',
      width: 200,
      align: 'center',
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      width: 200,
      align: 'center',
      render: (val) => <div>{currencyFormat(val)}</div>,
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'ngayThanhToan',
      width: 200,
      align: 'center',
      hide: props.type === 'chuathanhtoan',
    },
    {
      title: 'Chi tiết',
      width: 100,
      align: 'center',
      render: () => (
        <Button
          onClick={() => {
            setVisible(true);
          }}
          shape="circle"
          type="primary"
          icon={<EyeOutlined />}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={[
          {
            index: 1,
            khoanThu: 'Lệ phí xét tuyển đợt 1',
            soTien: 50000,
            ngayThanhToan: '22/01/2022',
            trangThaiThanhToan: 'Thanh toán đủ',
          },
        ]}
      />
      <Modal
        title="Chi tiết khoản thu"
        width={800}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <ThanhToan />
      </Modal>
    </>
  );
};

export default TableKhoanThu;
