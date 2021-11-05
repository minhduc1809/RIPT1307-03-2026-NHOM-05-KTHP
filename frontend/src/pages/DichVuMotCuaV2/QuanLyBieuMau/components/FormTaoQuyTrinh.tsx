/* eslint-disable no-underscore-dangle */
import { ArrowRightOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Steps } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import Block from './BlockQuyTrinh';

const FormTaoQuyTrinh = () => {
  const [form] = Form.useForm();
  const { loading, record, edit, current, setCurrent } = useModel('dichvumotcuav2');
  const { getAllDonViModel } = useModel('donvi');

  useEffect(() => {
    getAllDonViModel();
  }, []);

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const abcd = values;
          debugger;
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
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Card
                      headStyle={{ padding: '8px 24px' }}
                      bodyStyle={{ padding: '8px 24px' }}
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Bước {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right' }}
                            onClick={() => remove(field.name)}
                          />
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
            <Steps
              style={{ marginRight: 8, minWidth: 300 }}
              current={current}
              onChange={(val) => {
                setCurrent(val);
              }}
            >
              <Steps.Step title="Quy trình" description="" />
              <Steps.Step title="Biểu mẫu" description="" />
            </Steps>

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
    </Card>
  );
};

export default FormTaoQuyTrinh;
