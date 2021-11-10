/* eslint-disable no-underscore-dangle */
import FormView from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import Block from './BlockBieuMau';

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
  return (
    <Card title={edit ? 'Chỉnh sửa biểu mẫu' : 'Thêm mới biểu mẫu'}>
      <Form
        scrollToFirstError
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          setRecordCauHinhBieuMau({ ...recordCauHinhBieuMau, ...values });
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
          {(fields, { add, remove }, { errors }) => {
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
                            style={{ float: 'right' }}
                            onClick={() => remove(field.name)}
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
              onClick={() => setCurrent(0)}
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
              {edit ? 'Tiếp theo' : 'Thêm'}
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
