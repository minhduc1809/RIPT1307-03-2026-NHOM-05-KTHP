/* eslint-disable no-underscore-dangle */
import { Checkbox, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';

const GridChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
  listLuaChonBang: { idHang: string; idCot: string }[];
  setListLuaChonBang: any;
}) => {
  const columns: ColumnProps<any>[] = [
    {
      title: '',
      dataIndex: 'tieuChi',
      width: 300,
      fixed: 'left',
    },
  ];

  const onChange = (e: any, idHang: string, idCot: string) => {
    const listTemp = props.listLuaChonBang?.[`${props.indexKhoi}||${props.indexCauHoi}`] ?? [];
    const check = e.target.checked;
    const record = { ...props.listLuaChonBang };
    if (check) {
      listTemp.push({ idHang, idCot });
      record[`${props.indexKhoi}||${props.indexCauHoi}`] = listTemp;
      props.setListLuaChonBang(record);
    } else {
      props.setListLuaChonBang(
        (record[`${props.indexKhoi}||${props.indexCauHoi}`] = listTemp?.filter(
          (item: { idCot: string; idHang: string }) =>
            item.idCot !== idCot && item.idHang !== idHang,
        )),
      );
    }
  };

  const data = props?.question?.luaChonHang?.map((hang) => {
    const record = {
      tieuChi: hang.noiDung,
      idHang: hang._id,
    };

    // props?.dapAn?.forEach((luaChon) => {
    //   if (luaChon.idHang === item._id) {
    //     props?.cot?.forEach((cot) => {
    //       record[cot._id] = luaChon.idCot === cot._id;
    //     });
    //   }
    // });
    return record;
  });
  props?.question?.luaChonCot?.forEach((item) => {
    columns.push({
      key: item._id,
      title: item.noiDung,
      dataIndex: 'idHang',
      align: 'center',
      render: (val: string) => <Checkbox onChange={(e) => onChange(e, val, item._id)} />,
    });
  });

  return <Table pagination={false} scroll={{ x: 700 }} dataSource={data} columns={columns} />;
};

export default GridChoice;
