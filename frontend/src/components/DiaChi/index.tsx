import { useModel } from 'umi';
import { Col, Form, Input, Row, Select } from 'antd';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { useState } from 'react';
import { useEffect } from 'react';

type Props = {
  hideTinh?: boolean;
  hideQuanHuyen?: boolean;
  hideXaPhuong?: boolean;
  hideDiaChiCuThe?: boolean;
  fields: {
    tinh: string[];
    quanHuyen: string[];
    xaPhuong: string[];
    diaChiCuThe: string[];
  };
};

const DiaChi = (props: Props) => {
  const {
    danhSachQuanHuyen,
    danhSachTinh,
    danhSachXaPhuong,
    getDanhSachQuanHuyenModel,
    getDanhSachTinhModel,
    getDanhSachXaPhuongModel,
  } = useModel('donvihanhchinh');

  const [maQuanHuyen, setMaQuanHuyen] = useState<string>();
  const [maTinh, setMaTinh] = useState<string>();

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
          <Form.Item name={props?.fields?.tinh ?? []} rules={[...rules.required]}>
            <Select
              onChange={(val: string) => {
                setMaTinh(val);
              }}
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
          <Form.Item name={props?.fields?.quanHuyen ?? []} rules={[...rules.required]}>
            <Select
              onChange={(val: string) => {
                setMaQuanHuyen(val);
              }}
              showSearch
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
          <Form.Item name={props?.fields?.xaPhuong ?? []} rules={[...rules.required]}>
            <Select
              showSearch
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
            rules={[...rules.required]}
            name={props?.fields?.diaChiCuThe ?? []}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              maxLength={400}
              placeholder="Địa chỉ cụ thể"
              style={{ marginTop: 10 }}
            />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default DiaChi;
