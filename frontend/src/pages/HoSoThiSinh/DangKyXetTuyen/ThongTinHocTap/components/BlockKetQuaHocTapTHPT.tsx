import { FormItem } from '@/components/FormItem';
import { MonToHop, ToHopXetTuyen } from '@/utils/constants';
import rules from '@/utils/rules';
import { useEffect } from 'react';
import { Col, Divider, InputNumber, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import _ from 'lodash';

const BlockKetQuaHocTapTHPT = (props: {
  haveSelectToHop: boolean;
  toHop: string[];
  arrLopHoc: {
    label: string;
    name: string[];
  }[];
}) => {
  const { recordHoSo } = useModel('hosoxettuyen');
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
            >
              {Object.keys(ToHopXetTuyen)?.map((item) => (
                <Select.Option key={item} value={item}>
                  {item} (
                  {ToHopXetTuyen[item]?.map(
                    (mon: string, index: number) => `${mon}${index < 2 ? ', ' : ''}`,
                  )}
                  )
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      )}
      {toHop?.length > 0 && (
        <>
          {props?.arrLopHoc.map((item) => (
            <Row gutter={[10, 0]} key={item.label}>
              <Divider plain>
                <b>Điểm TBC {item.label}</b>
              </Divider>

              {arrMonHoc?.map((mon) => (
                <Col key={mon} xs={12} sm={12} md={8}>
                  <FormItem
                    initialValue={_.get(
                      recordHoSo,
                      `${item.name.join('.')}.${MonToHop?.[mon]}`,
                      undefined,
                    )}
                    rules={[...rules.required]}
                    name={[...item.name, MonToHop?.[mon]]}
                    label={mon}
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
              ))}
              <Col xs={12} sm={12} md={8}>
                <FormItem
                  rules={[...rules.required]}
                  initialValue={_.get(recordHoSo, `${item.name.join('.')}.diemTBC`, undefined)}
                  name={[...item.name, 'diemTBC']}
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
          ))}
        </>
      )}
    </>
  );
};

export default BlockKetQuaHocTapTHPT;
