import type { EToHopXetTuyen } from '@/utils/constants';
import { ToHopXetTuyen } from '@/utils/constants';
import { MonToHop } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Descriptions, Table } from 'antd';
const { Item } = Descriptions;
import { useModel } from 'umi';
import _ from 'lodash';

const BlockDiemTBCCacMon = (props: {
  cauHinh: any;
  toHop: EToHopXetTuyen[];
  index?: number;
  arrLopHoc: {
    label: string;
    name: string[];
    show: boolean;
    field: 'truongLop10' | 'truongLop11' | 'truongLop12';
  }[];
  arrKyHoc: {
    label: string;
    name: string;
  }[];
}) => {
  const { recordHoSo } = useModel('hosoxettuyen');
  const arrMonHoc: string[] = [];
  props?.toHop?.map((toHopItem: string) => {
    ToHopXetTuyen[toHopItem]?.map((mon: string) => {
      if (arrMonHoc.indexOf(mon) < 0) {
        arrMonHoc.push(mon);
      }
    });
  });

  const renderLast = (val: any, record: any, lop: string[], ky: string) => {
    const fieldName = record?.mon === 'diemTBC' ? 'diemTBC' : 'diemToHop';
    const isYeuCau = _.get(
      props?.cauHinh?.danhSach,
      `${lop.join('.')}.${ky}.${fieldName}`,
      undefined,
    );
    return <div>{isYeuCau ? val : 'Không yêu cầu'}</div>;
  };

  arrMonHoc.push('Tổng kết');

  const columns: IColumn<any>[] = props?.arrLopHoc
    ?.filter((item) => item.show)
    ?.map((lop) => {
      const arrKyHocFinal = props?.arrKyHoc?.filter(
        (kyHoc) => props?.cauHinh?.danhSach?.thongTinHocTapTHPT?.[lop.field]?.[kyHoc.name],
      );
      return {
        title:
          arrKyHocFinal?.length > 1 ? lop?.label : `${arrKyHocFinal?.[0]?.label} ${lop?.label}`,
        align: 'center',
        width: 200,
        dataIndex: arrKyHocFinal?.length > 1 ? undefined : [...lop.name, arrKyHocFinal?.[0]?.name],
        render:
          arrKyHocFinal?.length > 1
            ? undefined
            : (val, record) => renderLast(val, record, lop.name, arrKyHocFinal?.[0]?.name),
        children:
          arrKyHocFinal?.length > 1
            ? arrKyHocFinal?.map((kyHoc) => ({
                title: kyHoc.label,
                align: 'center',
                width: 100,
                dataIndex: [...lop.name, kyHoc.name],
                render: (val: any, record: any) => renderLast(val, record, lop.name, kyHoc.name),
              }))
            : [],
      };
    });
  columns.splice(
    0,
    0,
    // {
    //   title: 'STT',
    //   dataIndex: 'index',
    //   align: 'center',
    //   width: 70,
    // },
    {
      title: 'Loại',
      dataIndex: 'tenMon',
      align: 'center',
      width: 100,
    },
  );
  return (
    <>
      <Descriptions>
        <Item
          span={3}
          label={
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {props?.index ? `${props?.index}.` : ''} Kết quả học tập THPT
            </span>
          }
        >
          {' '}
        </Item>
      </Descriptions>

      <Table
        columns={columns}
        dataSource={arrMonHoc?.map((item, index) => {
          return {
            index: index + 1,
            tenMon: item,
            mon: MonToHop?.[item],
            thongTinHocTapTHPT: {
              truongLop10: {
                kqhtHK1: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtHK1?.[MonToHop?.[item]],
                kqhtHK2: recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtHK2?.[MonToHop?.[item]],
                kqhtCaNam:
                  recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtCaNam?.[MonToHop?.[item]],
              },
              truongLop11: {
                kqhtHK1: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtHK1?.[MonToHop?.[item]],
                kqhtHK2: recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtHK2?.[MonToHop?.[item]],
                kqhtCaNam:
                  recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtCaNam?.[MonToHop?.[item]],
              },
              truongLop12: {
                kqhtHK1: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtHK1?.[MonToHop?.[item]],
                kqhtHK2: recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtHK2?.[MonToHop?.[item]],
                kqhtCaNam:
                  recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtCaNam?.[MonToHop?.[item]],
              },
            },
          };
        })}
        size="small"
        pagination={false}
      />
    </>
  );
};

export default BlockDiemTBCCacMon;
