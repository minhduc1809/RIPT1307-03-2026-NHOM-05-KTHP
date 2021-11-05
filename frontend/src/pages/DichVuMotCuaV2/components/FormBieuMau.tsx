/* eslint-disable no-underscore-dangle */
import DiaChi from '@/components/DiaChi';
import Upload from '@/components/Upload/UploadMultiFile';
import { uploadFile } from '@/services/uploadFile';
import { accessFileUpload } from '@/utils/constants';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormCoCauToChuc = (props: { record?: DichVuMotCuaV2.Don; type?: string; onCancel?: any }) => {
  const [form] = Form.useForm();
  const { loading, setVisibleFormBieuMau, postDonSinhVienModel, record } =
    useModel('dichvumotcuav2');
  const [valuesForm, setValuesForm] = useState<any>({});

  useEffect(() => {
    const valuesTemp = {};
    props?.record?.thongTinDichVu?.cauHinhBieuMau?.forEach((cauHinh) => {
      valuesTemp[cauHinh.label] = cauHinh?.value;
      cauHinh?.dataSource?.forEach((data) => {
        data?.relatedElement?.forEach((item) => {
          valuesTemp[item.label] = item?.value;
        });
      });
    });
    setValuesForm(valuesTemp);
  }, []);

  const buildForm = (item: DichVuMotCuaV2.CauHinhBieuMau) => {
    let element = <Input placeholder={item.label} />;
    let initialValue = item?.value;
    switch (item.type) {
      case 'TEXT_AREA': {
        element = <Input.TextArea rows={3} placeholder={item.label} />;
        break;
      }
      case 'INPUT_NUMBER': {
        initialValue = Number(item?.value);
        element = (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={item.label}
            min={item.min}
            max={item.max}
          />
        );
        break;
      }
      case 'DATE_PICKER': {
        initialValue = item?.value ? moment(item?.value) : undefined;
        element = (
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        );
        break;
      }

      case 'UPLOAD_SINGLE': {
        initialValue = renderFileList(item?.value);
        element = (
          <Upload
            otherProps={{
              maxCount: 1,
              accept: item?.fileType?.map((type) => accessFileUpload?.[type])?.join(','),
              multiple: false,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        );
        break;
      }
      case 'UPLOAD_MULTI': {
        initialValue = renderFileList(item?.value);
        element = (
          <Upload
            otherProps={{
              maxCount: 5,
              accept: item?.fileType?.map((type) => accessFileUpload?.[type])?.join(','),
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
            limit={5}
          />
        );
        break;
      }
      case 'DROP_LIST_SINGLE': {
        initialValue = item?.value;
        element = (
          <Select placeholder={item.label}>
            {item.dataSource?.map((datasource) => (
              <Select.Option key={datasource.choice} value={datasource?.choice}>
                {datasource?.choice}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DROP_LIST_MULTI': {
        initialValue = item?.value;
        element = (
          <Select mode="multiple" placeholder={item.label}>
            {item.dataSource?.map((datasource) => (
              <Select.Option key={datasource.choice} value={datasource?.choice}>
                {datasource?.choice}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DON_VI_HANH_CHINH': {
        initialValue = item?.value;
        element = (
          <DiaChi
            hideDiaChiCuThe={item.level !== 4}
            hideQuanHuyen={item.level === 1}
            hideXaPhuong={[1, 2].includes(item.level)}
            // disabled={props.type === 'view'}
            initialValue={item?.value}
            form={form}
            fields={{
              tinh: [item.label, 'maTinh'],
              quanHuyen: [item.label, 'maQuanHuyen'],
              xaPhuong: [item.label, 'maPhuongXa'],
              diaChiCuThe: [item.label, 'soNhaTenDuong'],
            }}
          />
        );
        break;
      }
      case 'RADIO_BUTTON': {
        initialValue = item?.value;
        element = (
          <Radio.Group>
            {item.dataSource?.map((datasource) => (
              <Radio key={datasource.choice} value={datasource?.choice}>
                {datasource?.choice}
              </Radio>
            ))}
          </Radio.Group>
        );
        break;
      }

      case 'CHECKLIST': {
        initialValue = item?.value;
        element = (
          <Checkbox.Group>
            {item.dataSource?.map((datasource) => (
              <Checkbox key={datasource.choice} value={datasource?.choice}>
                {datasource?.choice}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
        break;
      }
      default:
        break;
    }

    const formItemElement = (
      <Form.Item
        key={item.label}
        extra={item?.note ? <i>{item.note}</i> : false}
        label={
          <div
            title={item.label}
            style={{
              marginLeft: item.isRequired ? 0 : 10,
              whiteSpace: 'nowrap',
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.label}
          </div>
        }
        name={item.label}
        rules={item.isRequired && item.type !== 'DON_VI_HANH_CHINH' ? [...rules.required] : []}
        initialValue={initialValue}
      >
        {element}
      </Form.Item>
    );
    return (
      <div>
        {formItemElement}
        {item?.dataSource?.map((data) => {
          return valuesForm?.[item.label] === data.choice ? (
            data?.relatedElement?.map((ele) => {
              return buildForm(ele);
            })
          ) : (
            <div></div>
          );
        })}
      </div>
    );
  };

  const { tenTinh, tenPhuongXa, tenQuanHuyen } = useModel('donvihanhchinh');

  const buildPostData = (values: any, arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[]): any => {
    return (
      arrCauHinh?.map((item) => ({
        ...item,
        dataSource: item?.dataSource?.map((data) => ({
          ...data,
          relatedElement: buildPostData(values, data?.relatedElement),
        })),
        value:
          item.type !== 'DON_VI_HANH_CHINH'
            ? values?.[item.label]
            : { ...values?.[item.label], tenTinh, tenQuanHuyen, tenPhuongXa },
      })) ?? []
    );
  };

  return (
    <Card bodyStyle={{ padding: 50 }}>
      <div style={{ fontWeight: 500, fontSize: '26px', textAlign: 'center' }}>
        {props.record?.thongTinDichVu?.ten ?? ''}
      </div>
      <br />
      <Form
        onValuesChange={(changeValues, allValues) => {
          setValuesForm(allValues);
        }}
        labelAlign="left"
        labelCol={{ xs: 24, lg: 6, xl: 6 }}
        onFinish={async (values) => {
          const objectFileUpload = {};
          // eslint-disable-next-line no-restricted-syntax
          for (const item of Object.keys(values)) {
            let arrUpload = [];
            if (values[item]?.fileList) {
              arrUpload = values[item]?.fileList?.map(async (file: { originFileObj: any }) => {
                const response = await uploadFile({
                  file: file?.originFileObj,
                  filename: 'fileName',
                  public: true,
                });
                return response?.data?.data?.url;
              });
              // eslint-disable-next-line no-await-in-loop
              objectFileUpload[item] = await Promise.all(arrUpload);
            }
          }
          const valuesFinal = { ...values, ...objectFileUpload };
          const duLieuBieuMau = buildPostData(valuesFinal, record?.cauHinhBieuMau ?? []);
          postDonSinhVienModel({
            duLieuBieuMau,
            dichVuId: record?._id ?? '',
          });
        }}
        form={form}
      >
        {props.record?.thongTinDichVu?.cauHinhBieuMau?.map((item) => buildForm(item))}
        {props.record?.thongTinDichVu?.cauHinhBieuMau?.forEach((cauHinh) => {
          cauHinh?.dataSource?.forEach((data) => {
            data?.relatedElement?.map((item) => buildForm(item));
          });
        })}
        <div>
          <b>{props.record?.thongTinDichVu?.ghiChu}</b>
        </div>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {props.type !== 'view' && (
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Gửi đơn
            </Button>
          )}
          <Button
            onClick={() => (props?.onCancel ? props?.onCancel() : setVisibleFormBieuMau(false))}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormCoCauToChuc;
