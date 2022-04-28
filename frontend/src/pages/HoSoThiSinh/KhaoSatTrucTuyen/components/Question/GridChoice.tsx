import type { BieuMau } from '@/services/BieuMau/typings';
import { Checkbox, Form, Table } from 'antd';
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
      width: 250,
      fixed: 'left',
    },
  ];

  const onChange = (e: any, idHang: string, idCot: string) => {
    const listTemp =
      props?.question?.loai === 'GridSingleChoice'
        ? props.listLuaChonBang?.[`${props.indexKhoi}||${props.indexCauHoi}`]?.filter(
            (item: { idHang: string; idCot: string }) => item?.idHang !== idHang,
          ) ?? []
        : props.listLuaChonBang?.[`${props.indexKhoi}||${props.indexCauHoi}`] ?? [];
    const check = e.target.checked;
    const record = { ...props.listLuaChonBang };
    if (check) {
      listTemp.push({ idHang, idCot });
      record[`${props.indexKhoi}||${props.indexCauHoi}`] = listTemp;
      props.setListLuaChonBang(record);
    } else {
      record[`${props.indexKhoi}||${props.indexCauHoi}`] =
        props?.question?.loai === 'GridSingleChoice'
          ? listTemp
          : listTemp?.filter(
              (item: { idCot: string; idHang: string }) =>
                item.idCot !== idCot && item.idHang !== idHang,
            );

      props.setListLuaChonBang(record);
    }
  };
  const data = props?.question?.luaChonHang?.map((hang) => {
    const record = {
      tieuChi: hang.noiDung,
      idHang: hang._id,
    };

    return record;
  });
  props?.question?.luaChonCot?.forEach((item) => {
    columns.push({
      key: item._id,
      title: item.noiDung,
      dataIndex: 'idHang',
      align: 'center',
      render: (val: string) => {
        const luaChon = props?.listLuaChonBang?.[`${props.indexKhoi}||${props.indexCauHoi}`]?.find(
          (ele: { idHang: string; idCot: string }) => ele.idHang === val && ele.idCot === item._id,
        );
        return props?.question?.loai === 'GridSingleChoice' ? (
          <Checkbox checked={luaChon?.idHang} onChange={(e) => onChange(e, val, item._id)} />
        ) : (
          <Checkbox onChange={(e) => onChange(e, val, item._id)} />
        );
      },
    });
  });

  return (
    <Form.Item
      rules={
        props.question.batBuoc
          ? [
              {
                validator: (_: any, value, callback) => {
                  if (!props.listLuaChonBang?.[_.field]) callback('');
                  callback();
                },
                message: 'Bắt buộc',
              },
            ]
          : []
      }
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Table pagination={false} scroll={{ x: 700 }} dataSource={data} columns={columns} />
    </Form.Item>
  );
};

export default GridChoice;
