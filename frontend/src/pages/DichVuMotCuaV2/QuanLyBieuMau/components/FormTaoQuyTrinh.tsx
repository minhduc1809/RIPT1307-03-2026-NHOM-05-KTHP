/* eslint-disable no-underscore-dangle */
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyTrinh from '../../components/FormQuyTrinh';
import styles from './block.css';
import Block from './BlockQuyTrinh';

const FormTaoQuyTrinh = () => {
  const [form] = Form.useForm();
  const {
    loading,
    record,
    edit,
    putBieuMauAdminModel,
    postBieuMauAdminModel,
    recordCauHinhBieuMau,
    recordThongTinChung,
    setCurrent,
  } = useModel('dichvumotcuav2');
  const { getAllDonViModel, danhSach } = useModel('donvi');
  const [visibleQuyTrinh, setVisibleQuyTrinh] = useState<boolean>(false);
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.QuyTrinh>();
  useEffect(() => {
    getAllDonViModel();
  }, []);

  const buildPostQuyTrinh = (values: { quyTrinh: DichVuMotCuaV2.QuyTrinh }) => {
    const quyTrinh: DichVuMotCuaV2.QuyTrinh = {
      danhSachBuoc: values?.quyTrinh?.danhSachBuoc?.map((buoc: DichVuMotCuaV2.BuocQuyTrinh) => {
        return {
          ...buoc,
          danhSachThaoTac: buoc?.danhSachThaoTac?.map(
            (thaoTac: DichVuMotCuaV2.ThaoTacQuyTrinh) => ({
              ...thaoTac,
              idDonVi: thaoTac?.idDonVi?.toString(),
              tenDonVi:
                danhSach?.find((item) => item.id.toString() === thaoTac.idDonVi)?.ten_don_vi ?? '',
            }),
          ),
        };
      }),
    };
    return quyTrinh;
  };

  return (
    <Card title={edit ? 'Chỉnh sửa quy trình' : 'Thêm mới quy trình'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const quyTrinh = buildPostQuyTrinh(values);
          if (edit) {
            putBieuMauAdminModel({
              data: { ...recordCauHinhBieuMau, ...recordThongTinChung, quyTrinh: { ...quyTrinh } },
              id: record?._id,
            });
          } else
            postBieuMauAdminModel({
              ...recordCauHinhBieuMau,
              ...recordThongTinChung,
              quyTrinh: { ...quyTrinh },
            });
        }}
        form={form}
      >
        <Form.List
          name={['quyTrinh', 'danhSachBuoc']}
          initialValue={record?.quyTrinh?.danhSachBuoc ?? []}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 bước'));
                }
                return '';
              },
            },
          ]}
        >
          {(fields, { add, remove, move }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Card
                      size="small"
                      headStyle={{ padding: '0px 24px' }}
                      bodyStyle={{ padding: '8px 24px' }}
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Bước {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right', marginLeft: 8 }}
                            onClick={() => remove(field.name)}
                          />
                          <ArrowUpOutlined
                            style={{ float: 'right', marginLeft: 8 }}
                            onClick={() => move(field.name, field.name - 1)}
                          />
                          <ArrowDownOutlined
                            style={{ float: 'right' }}
                            onClick={() => move(field.name, field.name + 1)}
                          />
                        </>
                      }
                    >
                      <Block step={index} field={{ ...field }} />
                    </Card>
                    <br />
                  </div>
                ))}
                <Form.Item style={{ marginBottom: 8 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm bước
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item style={{ marginBottom: 0, position: 'fixed', top: 14, right: 48 }}>
          <div style={{ display: 'flex' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              loading={loading}
              style={{ marginRight: 8 }}
              type="primary"
              onClick={() => setCurrent(1)}
            >
              Quay lại
            </Button>
            <Button
              icon={<EyeOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => {
                const valueView = form.getFieldsValue(true);
                setRecordView(buildPostQuyTrinh(valueView));
                setVisibleQuyTrinh(true);
              }}
            >
              Xem trước
            </Button>
            <Button
              icon={<SaveOutlined />}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Lưu
            </Button>
            {/* <Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
            Đóng
          </Button> */}
          </div>
        </Form.Item>
      </Form>
      <Modal
        destroyOnClose
        width="60%"
        footer={false}
        visible={visibleQuyTrinh}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisibleQuyTrinh(false);
        }}
      >
        <FormQuyTrinh type="view" record={recordView} />
      </Modal>
    </Card>
  );
};

export default FormTaoQuyTrinh;
