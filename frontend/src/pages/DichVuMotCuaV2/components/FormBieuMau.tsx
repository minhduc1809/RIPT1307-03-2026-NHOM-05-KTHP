/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import DiaChi from '@/components/DiaChi';
import Upload from '@/components/Upload/UploadMultiFile';
import { uploadFile } from '@/services/uploadFile';
import { accessFileUpload } from '@/utils/constants';
import rules from '@/utils/rules';
import { renderFileList } from '@/utils/utils';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
} from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDieuPhoi from '../QuanLyDon/components/FormDieuPhoi';
import FormXuLyDon from '../QuanLyDon/components/FormXuLyDon';
import Table from './TableElement';
import ThongTinNguoiTaoDon from './ThongTinNguoiTaoDon';
import TieuDeBieuMau from './TieuDeBieuMau';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormBieuMau = (props: {
  infoNguoiTaoDon?: Login.Profile;
  record?: DichVuMotCuaV2.Don & { index?: number };
  type?: string;
  onCancel?: any;
  textSaveButton?: string;
  title?: string;
  handleAdd?: any;
  handleDel?: any;
  handleEdit?: any;
  edit?: boolean;
  hideTitle?: boolean;
  hideCamKet?: boolean;
}) => {
  const [form] = Form.useForm();
  const {
    loading,
    setVisibleFormBieuMau,
    danhSachDataTable,
    setDanhSachDataTable,
    postDonSinhVienModel,
    record,
    recordDonThaoTac,
  } = useModel('dichvumotcuav2');
  const [valuesForm, setValuesForm] = useState<any>({});
  const [visibleFormDieuPhoi, setVisibleFormDieuPhoi] = useState<boolean>(false);
  const [visibleFormXuLy, setVisibleFormXuLy] = useState<boolean>(false);
  const [typeXuLy, setTypeXuLy] = useState<string>('ok');
  const buildValuesForm = (
    valuesInit: any,
    name: string,
    arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[],
  ) => {
    arrCauHinh?.forEach((cauHinh, indexCauHinh) => {
      valuesInit[`${name}[${indexCauHinh}].${cauHinh?.label}`] = cauHinh?.value;
      cauHinh?.dataSource?.forEach((data, indexDataSource) => {
        data?.relatedElement?.forEach((item, indexElement) => {
          buildValuesForm(
            valuesInit,
            `${name}[${indexCauHinh}].dataSource[${indexDataSource}].relatedElement[${indexElement}]`,
            data?.relatedElement ?? [],
          );
        });
      });
      buildValuesForm(valuesInit, `${name}[${indexCauHinh}]`, cauHinh?.relatedElement ?? []);
    });
  };
  useEffect(() => {
    const valuesTemp = {};
    buildValuesForm(
      valuesTemp,
      'cauHinhBieuMau',
      props?.record?.thongTinDichVu?.cauHinhBieuMau ?? [],
    );
    setValuesForm(valuesTemp);
  }, []);

  const buildForm = (name: string, item: DichVuMotCuaV2.CauHinhBieuMau) => {
    let element = <Input placeholder="Nhập nội dung" />;
    let ruleElement: any[] = [...rules.required];
    let initialValue = item?.value;
    if (!item?.type) return <div />;
    switch (item?.type) {
      case 'TEXT_AREA': {
        element = <Input.TextArea rows={3} placeholder={item?.label ?? ''} />;
        break;
      }
      case 'INPUT_NUMBER': {
        initialValue = Number(item?.value);
        element = (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={item?.label ?? ''}
            min={item?.min ?? 0}
            max={item?.max ?? 10000}
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
        ruleElement = [...rules.fileRequired];
        initialValue = renderFileList(
          item?.value?.map((file: { url: string; type: string }) => file?.url),
        );
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
        ruleElement = [...rules.fileRequired];
        initialValue = renderFileList(
          item?.value?.map((file: { url: string; type: string }) => file?.url),
        );
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
          <Select placeholder={item?.label ?? ''}>
            {item?.dataSource?.map((datasource) => (
              <Select.Option key={datasource?.label} value={datasource?.label}>
                {datasource?.label}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DROP_LIST_MULTI': {
        initialValue = item?.value;
        element = (
          <Select mode="multiple" placeholder={item?.label ?? ''}>
            {item?.dataSource?.map((datasource) => (
              <Select.Option key={datasource.label} value={datasource?.label}>
                {datasource?.label}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DON_VI_HANH_CHINH': {
        initialValue = item?.value;
        ruleElement = [];
        element = (
          <DiaChi
            hideDiaChiCuThe={item?.level !== 4}
            hideQuanHuyen={item?.level === 1}
            hideXaPhuong={[1, 2].includes(item?.level)}
            notRequiredDiaChiCuThe={!item?.isRequired}
            notRequiredQuanHuyen={!item?.isRequired}
            notRequiredTinh={!item?.isRequired}
            notRequiredXaPhuong={!item?.isRequired}
            initialValue={item?.value}
            form={form}
            fields={{
              tinh: [`${name}.${item?.label ?? ''}`, 'maTinh'],
              quanHuyen: [`${name}.${item?.label ?? ''}`, 'maQuanHuyen'],
              xaPhuong: [`${name}.${item?.label ?? ''}`, 'maPhuongXa'],
              diaChiCuThe: [`${name}.${item?.label ?? ''}`, 'soNhaTenDuong'],
            }}
          />
        );
        break;
      }
      case 'RADIO_BUTTON': {
        initialValue = item?.value;
        element = (
          <Radio.Group>
            {item?.dataSource?.map((datasource) => (
              <Radio key={datasource?.label} value={datasource?.label}>
                {datasource?.label}
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
            {item?.dataSource?.map((datasource) => (
              <Checkbox key={datasource?.label} value={datasource?.label ?? ''}>
                {datasource?.label ?? ''}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
        break;
      }
      case 'TABLE': {
        ruleElement = [
          {
            validator: (__: { field: string | number }, value: any, callback: any) => {
              if (!danhSachDataTable || !danhSachDataTable?.[__?.field]?.length) callback('');
              callback();
            },
            message: `Bắt buộc`,
            required: true,
          },
        ];
        const data = item?.value?.map((recordRow: DichVuMotCuaV2.CauHinhBieuMau[]) => {
          const row = {};
          recordRow?.forEach((cell: DichVuMotCuaV2.CauHinhBieuMau) => {
            row[cell?.label] =
              typeof cell?.value === 'object' ? cell?.value?.join(', ') : cell?.value;
          });
          return row;
        });
        element = (
          <Table
            type={props?.type}
            name={`${name}.${item?.label}`}
            danhSachDataTable={danhSachDataTable}
            setDanhSachDataTable={(
              dataTable: SetStateAction<
                Record<string, { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }>[] | undefined
              >,
            ) => {
              setDanhSachDataTable(dataTable);
            }}
            data={data}
            recordForm={
              {
                thongTinDichVu: { cauHinhBieuMau: item?.relatedElement ?? [] },
              } as DichVuMotCuaV2.Don
            }
            textSaveButton="Lưu"
            hascreate
            // hasTotal
            widthDrawer="55%"
            Form={FormBieuMau}
            otherProps={{
              scroll: { x: 500 },
              pagination: false,
            }}
            columns={item?.relatedElement?.map((column) => {
              return {
                title: column?.label ?? '',
                dataIndex: `${column?.label}`,
                align: 'center',
                width: 200,
                render: (val: any) =>
                  column?.type === 'DATE_PICKER' ? (
                    <div>{val ? moment(val)?.format('DD/MM/YYYY') : val}</div>
                  ) : (
                    <div>{val}</div>
                  ),
              };
            })}
          />
        );
        break;
      }
      case 'TEXT_BLOCK': {
        element = <p>{item?.label ?? ''}</p>;
        break;
      }
      default:
        break;
    }

    const formItemElement =
      item?.type === 'TEXT_BLOCK' ? (
        <div>{element}</div>
      ) : (
        <Form.Item
          key={item?.label}
          extra={item?.note ? <i>{item?.note}</i> : false}
          label={
            <div
              title={item?.label ?? 'Chưa có tiêu đề'}
              style={{
                marginLeft: item?.isRequired && item?.type !== 'TABLE' ? 0 : 10,
                whiteSpace: 'nowrap',
                maxWidth: 140,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.type === 'DON_VI_HANH_CHINH' && item.isRequired && (
                <span style={{ color: '#ff4d4f', fontSize: 14, fontFamily: 'SimSun, sans-serif' }}>
                  *
                </span>
              )}{' '}
              {item?.label ?? 'Chưa có tiêu đề'}
            </div>
          }
          name={item.type === 'DON_VI_HANH_CHINH' ? undefined : `${name}.${item?.label}`}
          rules={item?.isRequired ? ruleElement : []}
          initialValue={initialValue}
        >
          {element}
        </Form.Item>
      );
    return (
      <div>
        {formItemElement}
        {item?.dataSource?.map((data, indexDataSource) => {
          return valuesForm?.[`${name}.${item?.label}`] === data?.label ||
            valuesForm?.[`${name}.${item?.label}`]?.includes(data?.label) ? (
            data?.relatedElement?.map((ele, indexEle) => {
              return buildForm(
                `${name}.dataSource[${indexDataSource}].relatedElement[${indexEle}]`,
                ele,
              );
            })
          ) : (
            <div />
          );
        })}
      </div>
    );
  };

  const { tenTinh, tenPhuongXa, tenQuanHuyen } = useModel('donvihanhchinh');

  const buildTableData = (values: { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }) => {
    const arrData: { label: string; value: string }[] = [];
    values?.cauHinhBieuMau?.forEach((cauHinh) => {
      arrData.push({ label: cauHinh?.label ?? '', value: cauHinh?.value ?? '' });
    });
    return arrData;
  };

  const buildPostData = (
    name: string,
    values: any,
    arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[],
  ): any => {
    return (
      arrCauHinh?.map((item, index) => {
        let value = values?.[`${name}[${index}].${item?.label}`];
        if (item?.type === 'DON_VI_HANH_CHINH') {
          value = {
            ...values?.[`${name}[${index}].${item?.label}`],
            tenTinh,
            tenQuanHuyen,
            tenPhuongXa,
          };
        } else if (item?.type === 'TABLE') {
          value = danhSachDataTable?.[`${name}[${index}].${item?.label}`]?.map(
            (row: { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }) => buildTableData(row),
          );
        }
        return {
          ...item,
          dataSource: item?.dataSource?.map((data, indexData) => ({
            ...data,
            relatedElement: buildPostData(
              `cauHinhBieuMau[${index}].dataSource[${indexData}].relatedElement`,
              values,
              data?.relatedElement,
            ),
          })),
          value,
        };
      }) ?? []
    );
  };
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const [check, setCheck] = useState<boolean>(false);
  return (
    <Card
      title={props?.title}
      bodyStyle={{ padding: window.screen.width > 600 ? '30px 50px' : 12 }}
    >
      {!props.hideTitle && <TieuDeBieuMau title={props?.record?.thongTinDichVu?.ten ?? ''} />}

      <br />
      {!props.hideTitle && (
        <>
          <h3 style={{ fontWeight: 'bold' }}>Thông tin người tạo đơn</h3>
          <ThongTinNguoiTaoDon record={props?.infoNguoiTaoDon} />
          <Divider />
        </>
      )}
      <h3 style={{ fontWeight: 'bold' }}>Thông tin đơn</h3>
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
              arrUpload = values[item]?.fileList?.map(
                async (file: { originFileObj: any; type: string }) => {
                  const response = await uploadFile({
                    file: file?.originFileObj,
                    filename: 'fileName',
                    public: true,
                  });
                  return {
                    url: response?.data?.data?.url,
                    type: file.type,
                  };
                },
              );
              // eslint-disable-next-line no-await-in-loop
              objectFileUpload[item] = await Promise.all(arrUpload);
            }
          }
          const valuesFinal = { ...values, ...objectFileUpload };
          const duLieuBieuMau = buildPostData(
            'cauHinhBieuMau',
            valuesFinal,
            props?.handleAdd
              ? props?.record?.thongTinDichVu?.cauHinhBieuMau ?? []
              : record?.cauHinhBieuMau ?? [],
          );
          if (props?.edit !== null && props?.edit !== undefined) {
            if (props?.edit === false && props?.handleAdd)
              props.handleAdd(valuesFinal, duLieuBieuMau);
            else props.handleEdit(valuesFinal, duLieuBieuMau, props.record?.index);
          } else {
            postDonSinhVienModel({
              soLuongThanhToan: values?.soLuongThanhToan,
              duLieuBieuMau,
              dichVuId: record?._id ?? '',
            });
          }
        }}
        form={form}
      >
        {props?.record?.thongTinDichVu?.cauHinhBieuMau?.length ?? 0 ? (
          <>
            {props.record?.thongTinDichVu?.cauHinhBieuMau?.map((item, index) =>
              buildForm(`cauHinhBieuMau[${index}]`, item),
            )}
            {((record?.thongTinThuTuc?.yeuCauTraPhi &&
              record?.thongTinThuTuc?.tinhTienTheoSoLuong) ||
              props?.record?.trangThaiThanhToan) &&
              !(props?.edit !== null && props?.edit !== undefined) && (
                <Form.Item
                  initialValue={props?.record?.soLuongThanhToan}
                  rules={[...rules.required]}
                  label="Số lượng"
                  name="soLuongThanhToan"
                >
                  <InputNumber min={1} max={100} placeholder="Số lượng" />
                </Form.Item>
              )}
          </>
        ) : (
          <>
            <div>Chưa tạo thông tin đơn.</div>
            <br />
          </>
        )}
        <div>
          <b>{props.record?.thongTinDichVu?.ghiChu}</b>
        </div>
        {!['handle'].includes(props?.type ?? '') && !props.hideCamKet && (
          <Checkbox
            style={{ marginBottom: 8 }}
            onChange={(e) => {
              setCheck(e.target.checked);
            }}
          >
            Tôi xin cam đoan những thông tin trên là hoàn toàn chính xác, nếu sai sự thật tôi sẽ
            chịu mọi hình thức kỷ luật.
          </Checkbox>
        )}

        {(recordDonThaoTac?.urlFileDinhKem?.length || recordDonThaoTac?.info?.ghiChuXuLy) && (
          <>
            <Divider />
            <h3 style={{ fontWeight: 'bold' }}>Thông tin xử lý đơn</h3>
            {recordDonThaoTac?.urlFileDinhKem?.length !== 0 && (
              <Form.Item label="Kết quả xử lý">
                {recordDonThaoTac?.urlFileDinhKem?.map((item, index) => (
                  <>
                    <a href={item} target="_blank">
                      File đính kèm {index + 1}
                    </a>
                    <br />
                  </>
                ))}
              </Form.Item>
            )}
            {recordDonThaoTac?.info?.ghiChuXuLy && (
              <Form.Item label="Ghi chú xử lý">
                {recordDonThaoTac?.info?.ghiChuXuLy ?? ''}
              </Form.Item>
            )}
          </>
        )}

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!['view', 'handle'].includes(props?.type ?? '') && (
            <Button
              disabled={props?.hideCamKet ? false : !check}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              {props?.textSaveButton || 'Gửi đơn'}
            </Button>
          )}
          {['handle'].includes(props?.type ?? '') && (
            <>
              <Button
                onClick={() => {
                  setVisibleFormXuLy(true);
                  setTypeXuLy('ok');
                }}
                style={{
                  marginRight: 8,
                  backgroundColor: '#007F3E',
                  border: '1px solid #007F3E',
                  color: 'white',
                }}
              >
                Duyệt
              </Button>

              <Button
                onClick={() => {
                  setVisibleFormXuLy(true);
                  setTypeXuLy('not-ok');
                }}
                type="primary"
                style={{
                  marginRight: 8,
                  backgroundColor: '#CC0D00',
                  border: '1px solid #CC0D00',
                  color: 'white',
                }}
              >
                Không duyệt
              </Button>

              {arrPathName?.includes('quanlydondieuphoi') && (
                <Button
                  style={{
                    marginRight: 8,
                    backgroundColor: '#1890ff',
                    border: '1px solid #1890ff',
                    color: 'white',
                  }}
                  onClick={() => {
                    setVisibleFormDieuPhoi(true);
                  }}
                >
                  Điều phối
                </Button>
              )}
            </>
          )}
          <Button
            onClick={() => (props?.onCancel ? props?.onCancel() : setVisibleFormBieuMau(false))}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
      <Modal
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visibleFormDieuPhoi}
        onCancel={() => {
          setVisibleFormDieuPhoi(false);
        }}
      >
        <FormDieuPhoi
          onCancel={() => {
            setVisibleFormDieuPhoi(false);
          }}
        />
      </Modal>
      <Modal
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visibleFormXuLy}
        onCancel={() => {
          setVisibleFormXuLy(false);
        }}
      >
        <FormXuLyDon
          type={typeXuLy}
          onCancel={() => {
            setVisibleFormXuLy(false);
          }}
        />
      </Modal>
    </Card>
  );
};

export default FormBieuMau;
