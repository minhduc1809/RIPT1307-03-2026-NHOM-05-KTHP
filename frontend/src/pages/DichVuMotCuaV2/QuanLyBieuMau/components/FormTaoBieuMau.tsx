/* eslint-disable no-underscore-dangle */
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import Block from './BlockBieuMau';
import { nanoid } from 'nanoid';

const FormBieuMau = () => {
  const [form] = Form.useForm();
  const {
    loading,
    edit,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setRecordCauHinhBieuMau,
    recordCauHinhBieuMau,
    setCurrent,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const buildPostData = (arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[]): any => {
    return (
      arrCauHinh?.map((item) => {
        return {
          ...item,
          dataSource: item?.dataSource?.map((data) => ({
            ...data,
            relatedElement: buildPostData(data?.relatedElement ?? []),
          })),
          relatedElement: buildPostData(item?.relatedElement ?? []),
          _id: item?._id ?? nanoid(),
        };
      }) ?? []
    );
  };
  return (
    <Card title={edit ? 'Chỉnh sửa biểu mẫu' : 'Thêm mới biểu mẫu'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          setRecordCauHinhBieuMau({
            ...recordCauHinhBieuMau,
            ...{ cauHinhBieuMau: buildPostData(values?.cauHinhBieuMau ?? []) },
          });
          setCurrent(2);
        }}
        form={form}
      >
        <Form.List
          name="cauHinhBieuMau"
          initialValue={recordCauHinhBieuMau?.cauHinhBieuMau ?? []}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 khối'));
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
                          <div style={{ float: 'left' }}>Khối {index + 1}</div>
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
                      <Block fieldName={`cauHinhBieuMau.[${index}]`} field={{ ...field }} />
                    </Card>

                    <br />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Thêm khối
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
              icon={<EyeOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => {
                const valueView = form.getFieldsValue(true);
                setRecordView({ thongTinDichVu: { ...valueView } } as DichVuMotCuaV2.Don);
                setVisibleFormBieuMau(true);
              }}
            >
              Xem trước
            </Button>
            <Button
              icon={<ArrowLeftOutlined />}
              loading={loading}
              style={{ marginRight: 8 }}
              type="primary"
              onClick={() => {
                const valueView = form.getFieldsValue(true);
                setRecordCauHinhBieuMau({
                  ...recordCauHinhBieuMau,
                  ...{ cauHinhBieuMau: buildPostData(valueView?.cauHinhBieuMau ?? []) },
                });
                setCurrent(0);
              }}
            >
              Quay lại
            </Button>
            <Button
              icon={<ArrowRightOutlined />}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Tiếp theo
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
        visible={visibleFormBieuMau}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <FormView type="view" record={recordView} />
      </Modal>
    </Card>
  );
};

export default FormBieuMau;
