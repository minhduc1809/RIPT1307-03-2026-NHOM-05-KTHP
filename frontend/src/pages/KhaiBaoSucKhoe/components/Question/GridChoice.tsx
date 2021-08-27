/* eslint-disable no-underscore-dangle */
import { Table } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import type { ColumnProps } from 'antd/lib/table';

const GridChoice = (props: {
  hang: { _id: string; noiDung: string }[];
  cot: { _id: string; noiDung: string }[];
  dapAn: KhaiBaoSucKhoe.LuaChonBangRecord[];
}) => {
  const columns: ColumnProps<any>[] = [
    {
      title: '',
      dataIndex: 'tieuChi',
      width: 300,
      fixed: 'left',
    },
  ];

  const data = props?.hang?.map((item) => {
    const record = {
      tieuChi: item.noiDung,
    };
    props?.dapAn?.forEach((luaChon) => {
      if (luaChon.idHang === item._id) {
        props?.cot?.forEach((cot) => {
          record[cot._id] = luaChon.idCot === cot._id;
        });
      }
    });
    return record;
  });

  props?.cot?.forEach((item) => {
    columns.push({
      key: item._id,
      title: item.noiDung,
      dataIndex: item._id,
      align: 'center',
      render: (val) => <Checkbox checked={val} />,
    });
  });

  return <Table pagination={false} scroll={{ x: 700 }} dataSource={data} columns={columns} />;
};

export default GridChoice;
