import { FormItem } from '@/components/FormItem';
import type { EToHopXetTuyen } from '@/utils/constants';
import { EThoiGianTotNghiep } from '@/utils/constants';
import { hanhKiem } from '@/utils/constants';
import { MonToHop, ToHopXetTuyen } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import type { FormInstance } from 'antd';
import { Col, Form, InputNumber, Select, Table } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const BlockTableDiemTHPT = (props: {
  namTotNghiep?: number;
  form: FormInstance<any>;
  cauHinh: any;
  toHop: EToHopXetTuyen[];
  haveSelectToHop: boolean;
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
  const [toHop, setToHop] = useState<string[]>(props?.toHop ?? []);
  const [arrMonHoc, setArrMonHoc] = useState<string[]>([]);
  const { record: recordDot } = useModel('dottuyensinh');

  const onChangeToHop = (value: string[]) => {
    const arrMonHocTemp: string[] = [];
    value?.map((toHopItem: string) => {
      ToHopXetTuyen[toHopItem]?.map((mon: string) => {
        if (arrMonHocTemp.indexOf(mon) < 0) {
          arrMonHocTemp.push(mon);
        }
      });
    });
    setToHop(value);
    setArrMonHoc(arrMonHocTemp);
  };

  const checkIsNhapDiemToHop = () => {
    for (const lop of props?.arrLopHoc ?? []) {
      for (const ky of props?.arrKyHoc ?? []) {
        if (
          _.get(props?.cauHinh?.danhSach, `${lop?.name.join('.')}.${ky?.name}.diemToHop`, undefined)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    onChangeToHop(props?.toHop ?? []);
  }, []);

  const FormItemKyHoc = (lop: string[], kyHoc: string, fieldName: string, record: any) => (
    <Form.Item
      rules={
        _.get(props?.cauHinh?.danhSach, `${lop.join('.')}.${kyHoc}.${fieldName}.required`, false)
          ? [...rules.required]
          : []
      }
      initialValue={_.get(
        recordHoSo,
        `${lop?.filter((item) => item !== 'danhSach').join('.')}.${kyHoc}.${record?.mon}`,
        undefined,
      )}
      name={[...lop?.filter((item) => item !== 'danhSach'), kyHoc, record?.mon]}
      style={{ width: '100%', marginBottom: 0 }}
    >
      {fieldName === 'hanhKiem' ? (
        <Select
          style={{ maxWidth: 170 }}
          options={hanhKiem.map((item) => ({ label: item, value: item }))}
          placeholder="Hạnh kiểm"
        />
      ) : (
        <InputNumber placeholder="0.0" min={0} max={10} style={{ width: '100%', maxWidth: 100 }} />
      )}
    </Form.Item>
  );

  const renderLast = (val: any, record: any, lop: string[], ky: string) => {
    let fieldName = 'diemToHop';
    if (record?.mon === 'diemTBC' || record?.mon === 'hanhKiem') {
      fieldName = record?.mon;
    }
    const isNhap = _.get(
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
    const namTotNghiep = props?.namTotNghiep;
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

    return isHienThiTheoNamTotNghiep || (!thoiGianTotNghiep && isNhap) ? (
      FormItemKyHoc(lop || [], ky || '', fieldName, record)
    ) : (
      <div>Không yêu cầu</div>
    );
  };

  const columns: IColumn<any>[] = props?.arrLopHoc
    ?.filter((item) => item.show)
    ?.map((lop) => {
      const arrKyHocFinal = props?.arrKyHoc?.filter(
        (kyHoc) =>
          props?.cauHinh?.danhSach?.thongTinHocTapTHPT?.danhSach?.[lop.field]?.[kyHoc.name],
      );

      const dataIndex =
        arrKyHocFinal?.length > 1 ? undefined : [...lop.name, arrKyHocFinal?.[0]?.name];

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
        dataIndex,
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
  columns.splice(0, 0, {
    title: 'Loại',
    dataIndex: 'tenMon',
    align: 'center',
    width: 100,
    fixed: 'left',
  });

  const isNhapDiemToHop = checkIsNhapDiemToHop();

  return (
    <>
      {props?.haveSelectToHop && isNhapDiemToHop && (
        <Col style={{ marginBottom: 20 }} xs={24}>
          <FormItem
            rules={[...rules.required]}
            name="toHopMongMuon"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            label="Tổ hợp xét tuyển mong muốn"
            style={{ width: '100%', marginBottom: '0' }}
            initialValue={props?.toHop ?? []}
          >
            <Select
              mode="multiple"
              onChange={onChangeToHop}
              value={toHop}
              placeholder="Chọn tổ hợp"
              options={recordDot?.danhSachToHopLuaChon?.map((item) => ({
                value: item,
                label: `${item} (${ToHopXetTuyen[item]})`,
              }))}
            />
          </FormItem>
        </Col>
      )}
      <Table
        scroll={{ x: 1000 }}
        size="small"
        style={{ width: '100%' }}
        columns={columns}
        dataSource={[...(isNhapDiemToHop ? arrMonHoc : []), 'Tổng kết', 'Hạnh kiểm']?.map(
          (item, index) => {
            return {
              index: index + 1,
              tenMon: item,
              mon: MonToHop[item],
              thongTinHocTapTHPT: {
                danhSach: {
                  truongLop10: {
                    kqhtHK1:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtHK1?.[MonToHop?.[item]],
                    kqhtHK2:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtHK2?.[MonToHop?.[item]],
                    kqhtCaNam:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop10?.kqhtCaNam?.[MonToHop?.[item]],
                  },
                  truongLop11: {
                    kqhtHK1:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtHK1?.[MonToHop?.[item]],
                    kqhtHK2:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtHK2?.[MonToHop?.[item]],
                    kqhtCaNam:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop11?.kqhtCaNam?.[MonToHop?.[item]],
                  },
                  truongLop12: {
                    kqhtHK1:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtHK1?.[MonToHop?.[item]],
                    kqhtHK2:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtHK2?.[MonToHop?.[item]],
                    kqhtCaNam:
                      recordHoSo?.thongTinHocTapTHPT?.truongLop12?.kqhtCaNam?.[MonToHop?.[item]],
                  },
                },
              },
            };
          },
        )}
        pagination={false}
      />
    </>
  );
};

export default BlockTableDiemTHPT;
