/* eslint-disable no-underscore-dangle */
import { Table } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import type { ColumnProps } from 'antd/lib/table';

const GridChoice = (props: {
  hang: { _id: string; noiDung: string }[];
  cot: { _id: string; noiDung: string }[];
  dapAn?: BieuMau.LuaChonBangRecord[];
}) => {
  const columns: ColumnProps<any>[] = [
    {
      title: '',
      dataIndex: 'tieuChi',
      width: 300,
      fixed: 'left',
    },
  ];

  const data = props?.hang?.map((hang) => {
    const record = {
      tieuChi: hang.noiDung,
    };
    props?.cot?.forEach((cot) => {
      record[cot._id] = props.dapAn?.find(
        (dapAn) => dapAn.idCot === cot._id && dapAn.idHang === hang._id,
      )?.idCot
        ? true
        : false;
    });
    return record;
  });

  props?.cot?.forEach((item) => {
    columns.push({
      key: item._id,
      title: item.noiDung,
      dataIndex: item._id,
      align: 'center',
      render: (val) => {
        return <Checkbox checked={val} />;
      },
    });
  });

  return <Table pagination={false} scroll={{ x: 700 }} dataSource={data} columns={columns} />;
};

export default GridChoice;
