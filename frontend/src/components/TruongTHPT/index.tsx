/* eslint-disable react-hooks/exhaustive-deps */
import { EKhuVucUuTien, EMonHoc } from '@/utils/constants';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type Props = {
  type: '10' | '11' | '12';
  disabled?: boolean;
  form: FormInstance<any>;
  hideTinh?: boolean;
  hideQuanHuyen?: boolean;
  hideTruongTHPT?: boolean;
  notRequiredTinh?: boolean;
  notRequiredQuanHuyen?: boolean;
  notRequiredTruongTHPT?: boolean;

  fields: {
    tinh: string[];
    quanHuyen: string[];
    truongTHPT: string[];
    // tenLop: string[];
    monChuyen: string[];
  };
  initialValue?: {
    maTinh?: string;
    maQuanHuyen?: string;
    maTruong?: string;
    // tenLop?: string;
    monChuyen?: string;
  };
  setTen?: {
    setTenTinh?: any;
    setTenQuanHuyen?: any;
  };
};

const TruongTHPT = (props: Props) => {
  const modelTruongTHPT = useModel('truongthpt');
  const modelHoSoXetTuyen = useModel('hosoxettuyen');

  const { danhSachTinh, loading, getTinhTPModel, getQuanHuyenModel, getTruongTHPTModel } =
    modelTruongTHPT;

  const [maQuanHuyen, setMaQuanHuyen] = useState<string>(props?.initialValue?.maQuanHuyen ?? '');
  const [maTinh, setMaTinh] = useState<string>(props?.initialValue?.maTinh ?? '');
  const [maTruong, setMaTruong] = useState<string>(props?.initialValue?.maTruong ?? '');

  useEffect(() => {
    getTinhTPModel();
  }, []);

  useEffect(() => {
    if (maTinh) {
      getQuanHuyenModel(maTinh, props.type);
    }
  }, [maTinh]);

  useEffect(() => {
    if (maQuanHuyen) {
      getTruongTHPTModel(maTinh, maQuanHuyen, props.type);
    }
  }, [maTinh, maQuanHuyen]);

  return (
    <Row gutter={[20, 0]}>
      {!props.hideTinh && (
        <Col
          xs={24}
          md={props.hideQuanHuyen && props.hideTruongTHPT ? 12 : 24}
          lg={props.hideQuanHuyen && props.hideTruongTHPT ? 24 : 8}
        >
          <Form.Item
            style={{ marginBottom: 8 }}
            initialValue={props?.initialValue?.maTinh}
            name={props?.fields?.tinh ?? []}
            rules={props.notRequiredTinh ? [] : [...rules.required]}
            label="Chọn tỉnh/TP"
          >
            <Select
              disabled={props?.disabled}
              loading={loading}
              value={maTinh}
              onChange={(val: string) => {
                props.setTen?.setTenTinh(
                  danhSachTinh?.find((item) => item.maTinh === val)?.tenTinhTP,
                );
                setMaTinh(val);
                modelTruongTHPT?.[`setDanhSachTruongTHPT${props.type}`]([]);
                const newValue = {};
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maQuanHuyen: undefined,
                  maTruong: undefined,
                };
                props.form.setFieldsValue(newValue);
              }}
              allowClear
              showSearch
              placeholder="Thành phố/Tỉnh"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSachTinh?.map((item) => (
                <Select.Option value={item.maTinh} key={item.maTinh}>
                  {item.tenTinhTP}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideQuanHuyen && (
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            style={{ marginBottom: 8 }}
            initialValue={props?.initialValue?.maQuanHuyen}
            name={props?.fields?.quanHuyen ?? []}
            rules={props.notRequiredQuanHuyen ? [] : [...rules.required]}
            label="Chọn quận/huyện"
          >
            <Select
              disabled={props?.disabled}
              loading={loading}
              onChange={(val: string) => {
                props.setTen?.setTenQuanHuyen(
                  modelTruongTHPT?.[`danhSachQuanHuyen${props.type}`].find(
                    (item) => item.maQH === val,
                  )?.tenQH,
                );
                setMaQuanHuyen(val);
                const newValue = {};
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maTruong: undefined,
                };
                props.form.setFieldsValue(newValue);
              }}
              showSearch
              allowClear
              placeholder="Quận/Huyện"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {modelTruongTHPT?.[`danhSachQuanHuyen${props.type}`]?.map((item) => (
                <Select.Option value={item.maQH} key={item.maQH}>
                  {item.tenQH}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideTruongTHPT && (
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            style={{ marginBottom: 8 }}
            initialValue={props?.initialValue?.maTruong}
            name={props?.fields?.truongTHPT ?? []}
            rules={props?.notRequiredTruongTHPT ? [] : [...rules.required]}
            label="Tên trường"
          >
            <Select
              disabled={props?.disabled}
              loading={loading}
              onChange={(val: string, options: any) => {
                const khuVuc = EKhuVucUuTien[options?.key?.split('||')?.[1]];
                const isTruongChuyen = options?.key?.split('||')?.[2] === 'true';
                modelHoSoXetTuyen?.[`setKhuVucUuTienLop${props.type}`](khuVuc);
                modelHoSoXetTuyen?.[`setIsTruongChuyenLop${props.type}`](isTruongChuyen);
                modelTruongTHPT?.[`setTenTruong${props.type}`](
                  modelTruongTHPT?.[`danhSachTruongTHPT${props.type}`].find(
                    (item) => item.maTruong === val,
                  )?.tenTruong,
                );
                setMaTruong(val);
              }}
              showSearch
              allowClear
              placeholder="Tên trường"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {modelTruongTHPT?.[`danhSachTruongTHPT${props.type}`]?.map((item) => (
                <Select.Option
                  value={item.maTruong}
                  key={`${item.maTruong}||${item.khuVuc}||${item?.truongChuyen ?? false}`}
                >
                  {item.tenTruong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}

      <Col xs={24} lg={8}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Mã tỉnh"
          initialValue={props?.initialValue?.maTinh}
          style={{ width: '100%', marginBottom: '0' }}
        >
          <Input value={maTinh} placeholder="Chưa chọn tỉnh" disabled style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} lg={8}>
        <Form.Item
          initialValue={props?.initialValue?.maTruong}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Mã trường"
          style={{
            width: '100%',
            marginBottom: '0',
          }}
        >
          <Input
            value={maTruong}
            placeholder="Chưa chọn trường"
            style={{ width: '100%' }}
            disabled
          />
        </Form.Item>
      </Col>
      {/* <Col xs={24} lg={8}>
        <Form.Item
          rules={[...rules.required]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Tên lớp"
          initialValue={props?.initialValue?.tenLop}
          name={props?.fields?.tenLop ?? []}
          style={{ width: '100%', marginBottom: '0' }}
        >
          <Input placeholder="Tên lớp" style={{ width: '100%' }} />
        </Form.Item>
      </Col> */}
      {modelHoSoXetTuyen?.[`isTruongChuyenLop${props.type}`] && (
        <Col xs={24} lg={8}>
          <Form.Item
            rules={[...rules.required]}
            initialValue={props?.initialValue?.monChuyen}
            label="Môn chuyên"
            name={props.fields.monChuyen}
          >
            <Select
              showSearch
              allowClear
              placeholder="Chọn môn chuyên"
              options={Object.values(EMonHoc)
                .filter((mon) => mon !== '')
                .map((mon) => ({ value: mon, label: mon }))}
            />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default TruongTHPT;
