/* eslint-disable react-hooks/exhaustive-deps */
import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type Props = {
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
  initialValue?: IRecordTinh.DonViHanhChinhRecord;
  setTen?: {
    setTenTinh?: any;
    setTenQuanHuyen?: any;
    setTenXaPhuong?: any;
  };
};

const TruongTHPT = (props: Props) => {
  const {
    danhSachQuanHuyen,
    danhSachTinh,
    danhSachXaPhuong,
    setDanhSachXaPhuong,
    getDanhSachQuanHuyenModel,
    getDanhSachTinhModel,
    getDanhSachXaPhuongModel,
    setTenTinh,
    setTenXaPhuong,
    setTenQuanHuyen,
    loading,
  } = useModel('donvihanhchinh');

  const [maQuanHuyen, setMaQuanHuyen] = useState<string>(props?.initialValue?.maQuanHuyen ?? '');
  const [maTinh, setMaTinh] = useState<string>(props?.initialValue?.maTinh ?? '');

  useEffect(() => {
    getDanhSachTinhModel();
  }, []);

  useEffect(() => {
    if (maTinh) {
      getDanhSachQuanHuyenModel(maTinh);
    }
  }, [maTinh]);

  useEffect(() => {
    if (maQuanHuyen) {
      getDanhSachXaPhuongModel(maQuanHuyen);
    }
  }, [maQuanHuyen]);

  return (
    <Row gutter={[20, 0]}>
      {!props.hideTinh && (
        <Col
          xs={24}
          md={props.hideQuanHuyen && props.hideXaPhuong ? 12 : 24}
          lg={props.hideQuanHuyen && props.hideXaPhuong ? 24 : 8}
        >
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
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
                setTenTinh(danhSachTinh?.find((item) => item.ma === val)?.tenDonVi);
                props.setTen?.setTenTinh(danhSachTinh?.find((item) => item.ma === val)?.tenDonVi);
                setMaTinh(val);
                setDanhSachXaPhuong([]);
                props.form.resetFields([props.fields.quanHuyen, props.fields.xaPhuong]);
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
            initialValue={props?.initialValue?.maQuanHuyen}
            name={props?.fields?.quanHuyen ?? []}
            rules={props.notRequiredQuanHuyen ? [] : [...rules.required]}
            label="Chọn quận/huyện"
          >
            <Select
              notFoundContent="Bạn chưa chọn Tỉnh"
              disabled={props?.disabled}
              loading={loading}
              onChange={(val: string) => {
                props.setTen?.setTenQuanHuyen(
                  danhSachQuanHuyen.find((item) => item.ma === val)?.tenDonVi,
                );
                setTenQuanHuyen(danhSachQuanHuyen.find((item) => item.ma === val)?.tenDonVi);
                setMaQuanHuyen(val);
                props.form.resetFields([props.fields.xaPhuong]);
              }}
              onMouseEnter={async () => {
                const maTinhCurrent = props.form.getFieldValue(props.fields.tinh);
                if (maTinhCurrent) getDanhSachQuanHuyenModel(maTinhCurrent);
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
            initialValue={props?.initialValue?.maPhuongXa}
            name={props?.fields?.xaPhuong ?? []}
            rules={props?.notRequiredXaPhuong ? [] : [...rules.required]}
            label="Tên trường"
          >
            <Select
              notFoundContent="Bạn chưa chọn Quận huyện"
              disabled={props?.disabled}
              onMouseEnter={async () => {
                const maQuanHuyenCurrent = props.form.getFieldValue(props.fields.quanHuyen);
                if (maQuanHuyenCurrent) getDanhSachXaPhuongModel(maQuanHuyenCurrent);
              }}
              loading={loading}
              onChange={(val: string) => {
                props.setTen?.setTenXaPhuong(
                  danhSachXaPhuong.find((item) => item.ma === val)?.tenDonVi,
                );
                setTenXaPhuong(danhSachXaPhuong.find((item) => item.ma === val)?.tenDonVi);
              }}
              showSearch
              allowClear
              placeholder="Tên trường"
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
      <Col xs={24} lg={12}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Mã tỉnh"
          style={{ width: '100%', marginBottom: '0' }}
        >
          <Input placeholder="Chưa chọn tỉnh" disabled style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Mã trường"
          style={{
            width: '100%',
            marginBottom: '0',
          }}
        >
          <Input placeholder="Chưa chọn trường" style={{ width: '100%' }} disabled />
        </Form.Item>
      </Col>
      {/* {!props.hideDiaChiCuThe && (
        <Col span={24}>
          <Form.Item
            initialValue={props?.initialValue?.soNhaTenDuong}
            rules={props?.notRequiredDiaChiCuThe ? [] : [...rules.required]}
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
      )} */}
    </Row>
  );
};

export default TruongTHPT;
