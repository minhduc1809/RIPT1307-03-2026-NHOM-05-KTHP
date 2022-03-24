import { FormItem } from '@/components/FormItem';
import type { EToHopXetTuyen } from '@/utils/constants';
import { MonToHop, ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import { Col, Divider, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const BlockKetQuaHocTapTHPT = (props: {
  cauHinh: any;
  haveSelectToHop: boolean;
  toHop: EToHopXetTuyen[];
  arrLopHoc: {
    label: string;
    name: string[];
    show: boolean;
    field: string;
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
              return (
                <Row gutter={[10, 0]} key={item.label}>
                  <Divider plain>
                    <b>
                      Điểm TBC {arrKyHocFinal?.length > 1 ? '' : arrKyHocFinal[0]?.label}{' '}
                      {item.label}
                    </b>
                  </Divider>

                  {arrKyHocFinal?.map((kyHoc) => (
                    <>
                      {arrKyHocFinal?.length > 1 && <b>{kyHoc?.label}</b>}
                      <Col span={24}>
                        <Row gutter={[10, 0]}>
                          {arrMonHoc?.map((mon) => (
                            <Col key={mon} xs={12} sm={12} md={6} lg={6}>
                              <FormItem
                                initialValue={_.get(
                                  recordHoSo,
                                  `${item.name.join('.')}.${kyHoc.name}.${MonToHop?.[mon]}`,
                                  undefined,
                                )}
                                rules={[...rules.required]}
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
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <FormItem
                              rules={[...rules.required]}
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
                        </Row>
                      </Col>
                    </>
                  ))}
                </Row>
              );
            })}
        </>
      )}
    </>
  );
};

export default BlockKetQuaHocTapTHPT;
