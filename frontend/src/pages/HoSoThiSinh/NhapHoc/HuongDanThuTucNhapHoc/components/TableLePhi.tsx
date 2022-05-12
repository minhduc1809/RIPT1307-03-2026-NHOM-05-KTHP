import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { HuongDanNhapHoc } from '@/services/HuongDanNhapHoc/typings';
import type { IColumn } from '@/utils/interfaces';
import { currencyFormat } from '@/utils/utils';
import { Checkbox, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TableLePhi = (props: { mode: 'view' | 'handle' }) => {
  const { record, setRecord } = useModel('huongdannhaphoc');
  const { getModel, danhSach: danhSachLePhi } = useModel('price');
  const { record: recordKetQua } = useModel('ketquaxettuyen');

  const getPrice = async () => {
    if (record?.danhSachLePhiCanNop?.length) {
      await getModel(
        { _id: { $in: record.danhSachLePhiCanNop.map((item) => item.maLePhi) } },
        'pageable',
        1,
        100,
      );
    }
  };

  useEffect(() => {
    getPrice();
  }, [record?._id]);

  useEffect(() => {
    setRecord({
      ...record,
      danhSachLePhiCanNop: record?.danhSachLePhiCanNop?.map((item) => ({
        ...item,
        accept: recordKetQua?.danhSachLePhiNop?.includes(item.maLePhi),
      })),
    } as HuongDanNhapHoc.Record);
  }, [record?._id, recordKetQua?._id]);

  const columns: IColumn<DotNhapHoc.LePhi>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
      render: (val) => <div>{val + 1}</div>,
    },
    {
      title: 'Tên lệ phí',
      width: 200,
      align: 'center',
      render: (recordPrice) => (
        <div>{danhSachLePhi?.find((item) => item._id === recordPrice.maLePhi)?.product?.name}</div>
      ),
    },
    {
      title: 'Mức giá',
      width: 200,
      align: 'center',
      render: (recordPrice) => {
        const populateLePhi = danhSachLePhi?.find((item) => item._id === recordPrice.maLePhi);
        return (
          <div>
            {currencyFormat(populateLePhi?.unitAmount)} {populateLePhi?.currency}
          </div>
        );
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 200,
      align: 'center',
      render: (val) => <div>{val ? 'Có' : 'Không'}</div>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      width: 200,
      align: 'center',
    },
    {
      title: 'Đồng ý',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (recordLePhi: DotNhapHoc.LePhi) => (
        <Checkbox
          onChange={(e) => {
            const { checked } = e.target;
            setRecord({
              ...record,
              danhSachLePhiCanNop: record?.danhSachLePhiCanNop?.map((item) => {
                if (item.maLePhi === recordLePhi.maLePhi) {
                  return { ...item, accept: checked };
                }
                return item;
              }),
            } as HuongDanNhapHoc.Record);
          }}
          disabled={recordLePhi.required || props.mode === 'view'}
          checked={recordLePhi.required || recordLePhi.accept}
        />
      ),
    },
  ];

  return (
    <Table
      scroll={{ x: 1300 }}
      size="small"
      pagination={false}
      columns={columns?.filter((item) => item?.hide !== true)}
      dataSource={record?.danhSachLePhiCanNop?.map((item, index: number) => ({
        ...item,
        index,
      }))}
    />
  );
};

export default TableLePhi;
