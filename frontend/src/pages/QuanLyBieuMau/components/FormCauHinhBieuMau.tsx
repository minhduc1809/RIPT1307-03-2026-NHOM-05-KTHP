/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { Button, Card, Form, Tooltip } from 'antd';
import mm from 'moment-timezone';
import { useModel } from 'umi';
import Block from './Block';
import styles from './block.css';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormCauHinhBieuMau = () => {
  const [form] = Form.useForm();

  const { record, edit, putBieuMauModel, addBieuMauModel, setCurrent, setRecord } =
    useModel('bieumau');

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit)
            putBieuMauModel({
              id: record._id,
              data: { ...record, ...values },
            });
          else
            addBieuMauModel({
              ...record,
              ...values,
            });
        }}
        form={form}
      >
        <Form.List
          name="danhSachKhoi"
          initialValue={record?.danhSachKhoi ?? []}
          rules={[
            {
              validator: async (validate, names) => {
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
                          <Tooltip title="Xóa">
                            <CloseCircleOutlined
                              style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
                              onClick={() => remove(field.name)}
                            />
                          </Tooltip>
                          <Tooltip title="Di chuyển lên">
                            <ArrowUpOutlined
                              style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
                              onClick={() => move(field.name, field.name - 1)}
                            />
                          </Tooltip>
                          <Tooltip title="Di chuyển xuống">
                            <ArrowDownOutlined
                              style={{ float: 'right', marginTop: 4 }}
                              onClick={() => move(field.name, field.name + 1)}
                            />
                          </Tooltip>
                        </>
                      }
                    >
                      <Block field={{ ...field }} />
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
        <Form.Item
          style={{ textAlign: 'center', marginBottom: 0, position: 'fixed', top: 14, right: 48 }}
        >
          <Button
            style={{ marginRight: 8 }}
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              const valueView = form.getFieldsValue(true);
              setRecord({ ...record, ...valueView });
              setCurrent(0);
            }}
          >
            Quay lại
          </Button>
          <Button
            icon={edit ? <SaveOutlined /> : <PlusOutlined />}
            //loading={loading}
            loading={false}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormCauHinhBieuMau;
