import { FormItem } from '@/components/FormItem';
import type { EToHopXetTuyen } from '@/utils/constants';
import { MonToHop, ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import { Col, Divider, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

// to do : neu trong cau hinh ko yeu cau nhap diem tung mon theo to hop, chi yeu cau nhap diem tong ket thi giao dien bi xau
const BlockKetQuaHocTapTHPT = (props: {
  cauHinh: any;
  haveSelectToHop: boolean;
  toHop: EToHopXetTuyen[];
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
  const { record } = useModel('dottuyensinh');
  const [toHop, setToHop] = useState<string[]>(props?.toHop ?? []);
  const [arrMonHoc, setArrMonHoc] = useState<string[]>([]);

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

  useEffect(() => {
    onChangeToHop(props?.toHop ?? []);
  }, []);
  return (
    <>
      {props?.haveSelectToHop && (
        <Col xs={24}>
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
              options={record?.danhSachToHopLuaChon?.map((item) => ({
                value: item,
                label: `${item} (${ToHopXetTuyen[item]})`,
              }))}
            />
          </FormItem>
        </Col>
      )}
      {toHop?.length > 0 && (
        <>
          {props?.arrLopHoc
            ?.filter((item) => item.show)
            .map((item) => {
              const arrKyHocFinal = props?.arrKyHoc?.filter(
                (kyHoc) => props?.cauHinh?.danhSach?.thongTinHocTapTHPT?.[item.field]?.[kyHoc.name],
              );
              let label = arrKyHocFinal[0]?.label ?? '';
              if (item.field === 'truongLop12' && record?.choPhepHK1HoacCaNamLop12) {
                label = `${arrKyHocFinal[0].label} hoặc Học kỳ 1`;
              }
              return (
                <Row gutter={[10, 0]} key={item.label}>
                  <Divider plain>
                    <b>
                      Điểm TBC {arrKyHocFinal?.length > 1 ? '' : label} {item.label}
                    </b>
                  </Divider>

                  {arrKyHocFinal?.map((kyHoc) => {
                    const cauHinhKyHoc =
                      props?.cauHinh?.danhSach?.thongTinHocTapTHPT?.[item.field]?.[kyHoc.name];
                    return (
                      <>
                        {arrKyHocFinal?.length > 1 && (
                          <b>
                            {item.field === 'truongLop12' && record?.choPhepHK1HoacCaNamLop12
                              ? `${kyHoc?.label} hoặc Học kỳ 1`
                              : kyHoc?.label}
                          </b>
                        )}
                        <Col span={24}>
                          <Row gutter={[10, 0]}>
                            {cauHinhKyHoc?.diemToHop &&
                              arrMonHoc?.map((mon) => (
                                <Col key={mon} xs={12} sm={12} md={6} lg={6} xxl={4}>
                                  <FormItem
                                    initialValue={_.get(
                                      recordHoSo,
                                      `${item.name.join('.')}.${kyHoc.name}.${MonToHop?.[mon]}`,
                                      undefined,
                                    )}
                                    rules={
                                      cauHinhKyHoc?.diemToHop?.required ? [...rules.required] : []
                                    }
                                    name={[...item.name, kyHoc.name, MonToHop?.[mon]]}
                                    label={mon}
                                    style={{ width: '100%' }}
                                  >
                                    <InputNumber
                                      step={0.1}
                                      placeholder="Số thập phân dạng 0.0"
                                      min={0}
                                      max={10}
                                      style={{ width: '100%' }}
                                    />
                                  </FormItem>
                                </Col>
                              ))}
                            {cauHinhKyHoc?.diemTBC && (
                              <Col xs={12} sm={12} md={6} lg={6} xxl={4}>
                                <FormItem
                                  rules={cauHinhKyHoc?.diemTBC?.required ? [...rules.required] : []}
                                  initialValue={_.get(
                                    recordHoSo,
                                    `${item.name.join('.')}.${kyHoc.name}.diemTBC`,
                                    undefined,
                                  )}
                                  name={[...item.name, kyHoc.name, 'diemTBC']}
                                  label="Tổng kết"
                                  style={{ width: '100%' }}
                                >
                                  <InputNumber
                                    placeholder="Số thập phân dạng 0.0"
                                    min={0}
                                    max={10}
                                    style={{ width: '100%' }}
                                  />
                                </FormItem>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </>
                    );
                  })}
                </Row>
              );
            })}
        </>
      )}
    </>
  );
};

export default BlockKetQuaHocTapTHPT;
