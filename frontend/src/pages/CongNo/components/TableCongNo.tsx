import TableBase from '@/components/Table';
import ThanhToan from '@/components/ThanhToan';
import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Tabs, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';
import Form from './Form';
import TableKetQuaImport from './TableKetQuaImport';

const TableCongNo = (props: { type?: 'chưa nộp' | 'đã nộp' }) => {
  const access = useAccess();
  const {
    loading,
    page,
    limit,
    condition,
    getMyInvoiceModel,
    getInvoiceModel,
    setInvoice,
    invoice,
    thongKeMyInvoiceModel,
    recordThongKeInvoice,
    visibleResponseImport,
    responseImportInvoice,
    setVisibleResponseImport,
  } = useModel('thanhtoan');

  const [visible, setVisible] = useState<boolean>(false);

  const onCell = (record: ThanhToan.Invoice) => ({
    onClick: () => {
      setInvoice(record);
      setVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ThanhToan.Invoice>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Thông tin sinh viên',
      dataIndex: 'customerInfo',
      hide: access?.thiSinh || false,
      align: 'center',
      render: (val) => <div>{val?.name ?? ''}</div>,
      onCell,
    },
    {
      title: 'Dịch vụ',
      dataIndex: ['items'],
      align: 'center',
      // width: 200,
      render: (val: ThanhToan.Item[]) => <div>{val?.[0]?.productName ?? ''}</div>,
      onCell,
    },
    {
      title: 'Trạng thái',
      dataIndex: ['status'],
      align: 'center',
      width: 140,
      hide: access.thiSinh || false,
      search: 'filterString',
      notRegex: true,
      key: 'status',
      render: (val) => (
        <Tag color={val === 'open' ? 'red' : 'green'}>
          {data?.status?.find((item: { value: string }) => item.value === val)?.text ??
            'Đã thanh toán'}
        </Tag>
      ),
      onCell,
    },

    {
      title: 'Số tiền phải nộp',
      dataIndex: 'amountDue',
      align: 'center',
      width: access.thiSinh ? 140 : 120,
      render: (val) => <div>{currencyFormat(val)}đ</div>,
      onCell,
    },
    {
      title: 'Số tiền đã nộp',
      dataIndex: 'amountPaid',
      align: 'center',
      width: access.thiSinh ? 140 : 120,
      render: (val) => <div>{currencyFormat(val)}đ</div>,
      onCell,
    },
    {
      title: 'Số tiền còn lại phải nộp',
      dataIndex: 'amountRemaining',
      align: 'center',
      width: access.thiSinh ? 140 : 120,
      render: (val) => <div>{currencyFormat(val)}đ</div>,
      onCell,
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: ThanhToan.Invoice) => (
        <>
          <Tooltip title="Chi tiết">
            <Button
              onClick={() => {
                setInvoice(record);
                setVisible(true);
              }}
              type="primary"
              shape="circle"
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      getData={
        access.thiSinh
          ? () => {
              thongKeMyInvoiceModel();
              getMyInvoiceModel();
            }
          : getInvoiceModel
      }
      loading={loading}
      dependencies={[page, limit, condition]}
      modelName="thanhtoan"
      Form={Form}
    >
      {access.thiSinh && (
        <h4 style={{ display: 'inline-block' }}>
          {`Tổng ${props?.type ?? ''}:`}
          <Input
            style={{ width: '130px', fontWeight: 600, fontSize: 14, marginLeft: 10 }}
            value={`${currencyFormat(
              props?.type === 'chưa nộp'
                ? recordThongKeInvoice?.totalRemaining ?? 0
                : recordThongKeInvoice?.totalPaid ?? 0,
            )}đ`}
            readOnly
            // ref={this.setTableBaseRef}
          />
        </h4>
      )}

      <Modal
        destroyOnClose
        width="850px"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            Đóng
          </Button>
        }
        visible={visible}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Tabs>
          {invoice?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan record={{ identityCode: invoice?.identityCode }} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
      <Modal
        destroyOnClose
        width="850px"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleResponseImport(false);
            }}
          >
            Đóng
          </Button>
        }
        visible={visibleResponseImport}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisibleResponseImport(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Hợp lệ" key={1}>
            <TableKetQuaImport data={responseImportInvoice?.listHopLe ?? []} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Không hợp lệ" key={2}>
            <TableKetQuaImport data={responseImportInvoice?.listKhongHopLe ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </TableBase>
  );
};

export default TableCongNo;
