import Table from '@/components/Table/Table';
import type { BuoiHoc } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { Radio } from 'antd';
import { useModel } from 'umi';

const DanhSachSinhVien = (props: { data: BuoiHoc.SinhVienDiemDanh[]; setData: any }) => {
  const { loading } = useModel('diemdanh');

  const columns: IColumn<BuoiHoc.SinhVienDiemDanh & { index: number }>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      align: 'center',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'sinh_vien_id',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
      align: 'center',
      search: 'search',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'ten_sinh_vien',
      align: 'center',
      search: 'search',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      align: 'center',
      render: (val, record) => (
        <Radio.Group
          onChange={(e) => {
            const dataTemp = [...props.data];
            dataTemp?.splice(record?.index - 1, 1, {
              ...props.data[record.index - 1],
              trang_thai: e.target.value,
            });
            props.setData(dataTemp);
          }}
          value={val}
        >
          <Radio value="Có mặt">Có mặt</Radio>
          <Radio value="Vắng">Vắng</Radio>
        </Radio.Group>
      ),
    },
  ];
  return (
    <Table
      otherProps={{
        loading,
      }}
      columns={columns}
      data={props.data?.map((item, index) => ({ ...item, index: index + 1 }))}
    />
  );
};

export default DanhSachSinhVien;
