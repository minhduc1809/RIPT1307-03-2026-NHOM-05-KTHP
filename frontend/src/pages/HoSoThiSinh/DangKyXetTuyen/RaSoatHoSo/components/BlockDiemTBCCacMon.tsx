import type { EToHopXetTuyen } from '@/utils/constants';
import { EThoiGianTotNghiep } from '@/utils/constants';
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
  const { record: recordDot } = useModel('dottuyensinh');
  const arrMonHoc: string[] = [];
  props?.toHop?.map((toHopItem: string) => {
    ToHopXetTuyen[toHopItem]?.map((mon: string) => {
      if (arrMonHoc.indexOf(mon) < 0) {
        arrMonHoc.push(mon);
      }
    });
  });

  const renderLast = (val: any, record: any, lop: string[], ky: string) => {
    let fieldName = 'diemToHop';
    if (record?.mon === 'diemTBC' || record?.mon === 'hanhKiem') {
      fieldName = record?.mon;
    }
    const isYeuCau = _.get(
      props?.cauHinh?.danhSach,
      `${lop.join('.')}.${ky}.${fieldName}`,
      undefined,
    );
    let isHienThiTheoNamTotNghiep = false;
    const thoiGianTotNghiep = _.get(
      props?.cauHinh?.danhSach,
      `${lop.join('.')}.${ky}.${fieldName}.hienThiTheoNamTotNghiep`,
      undefined,
    );
    const namTotNghiep = recordHoSo?.thongTinHocTapTHPT?.namTotNghiep;
    if (
      (thoiGianTotNghiep === EThoiGianTotNghiep.HIEN_TAI &&
        namTotNghiep &&
        namTotNghiep === recordDot?.namTuyenSinh) ||
      (thoiGianTotNghiep === EThoiGianTotNghiep.TRUOC_HIEN_TAI &&
        namTotNghiep &&
        namTotNghiep !== recordDot?.namTuyenSinh)
    ) {
      isHienThiTheoNamTotNghiep = true;
    }

    return (
      <div>
        {isHienThiTheoNamTotNghiep || (isYeuCau && !thoiGianTotNghiep) ? val : 'Không yêu cầu'}
      </div>
    );
  };

  arrMonHoc.push('Tổng kết', 'Hạnh kiểm');

  const columns: IColumn<any>[] = props?.arrLopHoc
    ?.filter((item) => item.show)
    ?.map((lop) => {
      const arrKyHocFinal = props?.arrKyHoc?.filter(
        (kyHoc) =>
          props?.cauHinh?.danhSach?.thongTinHocTapTHPT?.danhSach?.[lop.field]?.[kyHoc.name],
      );
      return {
        title:
          arrKyHocFinal?.length > 1
            ? lop?.label
            : `${
                recordDot?.choPhepHK1HoacCaNamLop12 && lop?.field === 'truongLop12'
                  ? `Học kỳ 1 hoặc ${arrKyHocFinal?.[0]?.label}`
                  : arrKyHocFinal?.[0]?.label
              } ${lop?.label}`,
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
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={arrMonHoc?.map((item, index) => {
          return {
            index: index + 1,
            tenMon: item,
            mon: MonToHop?.[item],
            thongTinHocTapTHPT: {
              danhSach: {
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
