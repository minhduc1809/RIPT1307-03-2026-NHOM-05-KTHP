/* eslint-disable react-hooks/exhaustive-deps */
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type Props = {
  type: 'HKTT' | 'DCLH';
  disabled?: boolean;
  form: FormInstance<any>;
  hideTinh?: boolean;
  hideQuanHuyen?: boolean;
  hideXaPhuong?: boolean;
  hideDiaChiCuThe?: boolean;
  notRequiredTinh?: boolean;
  notRequiredQuanHuyen?: boolean;
  notRequiredXaPhuong?: boolean;
  notRequiredDiaChiCuThe?: boolean;
  fields: {
    tinh: string[];
    quanHuyen: string[];
    xaPhuong: string[];
    diaChiCuThe: string[];
  };
  initialValue?: DonViHanhChinh.Record;
  setTen?: {
    setTenTinh?: any;
    setTenQuanHuyen?: any;
    setTenXaPhuong?: any;
  };
};

const DiaChi = (props: Props) => {
  const modelDonViHanhChinh = useModel('donvihanhchinh');

  const {
    danhSachTinh,
    getDanhSachQuanHuyenModel,
    getDanhSachTinhModel,
    getDanhSachXaPhuongModel,
    loading,
    setDanhSachXaPhuongDiaChiLienHe,
    setDanhSachXaPhuongHoKhauThuongTru,
    danhSachQuanHuyenDiaChiLienHe,
    danhSachQuanHuyenHoKhauThuongTru,
    danhSachXaPhuongDiaChiLienHe,
    danhSachXaPhuongHoKhauThuongTru,
  } = modelDonViHanhChinh;
  const setDanhSachXaPhuong =
    props.type === 'HKTT' ? setDanhSachXaPhuongHoKhauThuongTru : setDanhSachXaPhuongDiaChiLienHe;
  const danhSachQuanHuyen =
    props.type === 'HKTT' ? danhSachQuanHuyenHoKhauThuongTru : danhSachQuanHuyenDiaChiLienHe;
  const danhSachXaPhuong =
    props.type === 'HKTT' ? danhSachXaPhuongHoKhauThuongTru : danhSachXaPhuongDiaChiLienHe;
  const [maQuanHuyen, setMaQuanHuyen] = useState<string>('');
  const [maTinh, setMaTinh] = useState<string>('');
  useEffect(() => {
    getDanhSachTinhModel();
    setMaTinh(props?.initialValue?.maTP ?? '');
    setMaQuanHuyen(props?.initialValue?.maQH ?? '');
  }, [props?.initialValue?.maTP]);

  useEffect(() => {
    if (maTinh) {
      getDanhSachQuanHuyenModel(maTinh, props.type);
    }
  }, [maTinh]);

  useEffect(() => {
    if (maQuanHuyen) {
      getDanhSachXaPhuongModel(maQuanHuyen, props.type);
    }
  }, [maQuanHuyen]);

  return (
    <Row gutter={[10, 0]}>
      {!props.hideTinh && (
        <Col
          xs={24}
          md={props.hideQuanHuyen && props.hideXaPhuong ? 12 : 24}
          lg={props.hideQuanHuyen && props.hideXaPhuong ? 24 : 8}
        >
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
            initialValue={props?.initialValue?.maTP}
            name={props?.fields?.tinh ?? []}
            rules={props.notRequiredTinh ? [] : [...rules.required]}
          >
            <Select
              disabled={props?.disabled}
              loading={loading}
              value={maTinh}
              onChange={(val: string) => {
                if (props?.setTen?.setTenTinh)
                  props.setTen?.setTenTinh(danhSachTinh?.find((item) => item.ma === val)?.tenDonVi);
                setMaTinh(val);
                setDanhSachXaPhuong([]);
                const newValue = {};
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maQH: undefined,
                  maXaPhuong: undefined,
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
                <Select.Option value={item.ma} key={item.ma}>
                  {item.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideQuanHuyen && (
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
            initialValue={props?.initialValue?.maQH}
            name={props?.fields?.quanHuyen ?? []}
            rules={props.notRequiredQuanHuyen ? [] : [...rules.required]}
          >
            <Select
              notFoundContent="Bạn chưa chọn Tỉnh"
              disabled={props?.disabled}
              loading={loading}
              onChange={(val: string) => {
                if (props?.setTen?.setTenQuanHuyen)
                  props.setTen?.setTenQuanHuyen(
                    danhSachQuanHuyen.find((item) => item.ma === val)?.tenDonVi,
                  );

                setMaQuanHuyen(val);
                const newValue = {};
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maXaPhuong: undefined,
                };
                props.form.setFieldsValue(newValue);
              }}
              showSearch
              allowClear
              placeholder="Quận/Huyện"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSachQuanHuyen?.map((item) => (
                <Select.Option value={item.ma} key={item.ma}>
                  {item.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideXaPhuong && (
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
            initialValue={props?.initialValue?.maXaPhuong}
            name={props?.fields?.xaPhuong ?? []}
            rules={props?.notRequiredXaPhuong ? [] : [...rules.required]}
          >
            <Select
              notFoundContent="Bạn chưa chọn Quận huyện"
              disabled={props?.disabled}
              loading={loading}
              onChange={(val: string) => {
                if (props?.setTen?.setTenXaPhuong)
                  props.setTen?.setTenXaPhuong(
                    danhSachXaPhuong.find((item) => item.ma === val)?.tenDonVi,
                  );
              }}
              showSearch
              allowClear
              placeholder="Xã/Phường"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSachXaPhuong?.map((item) => (
                <Select.Option value={item.ma} key={item.ma}>
                  {item.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideDiaChiCuThe && (
        <Col span={24}>
          <Form.Item
            initialValue={props?.initialValue?.diaChi}
            rules={
              props?.notRequiredDiaChiCuThe
                ? [...rules.text, ...rules.length(400)]
                : [...rules.required, ...rules.text, ...rules.length(400)]
            }
            name={props?.fields?.diaChiCuThe ?? []}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              disabled={props?.disabled}
              maxLength={400}
              placeholder="Địa chỉ cụ thể"
              style={{ marginTop: 0 }}
            />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default DiaChi;
