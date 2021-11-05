/* eslint-disable no-underscore-dangle */
import { ArrowRightOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import Block from './BlockQuyTrinh';

const FormTaoQuyTrinh = () => {
  const [form] = Form.useForm();
  const { loading, recordQuyTrinh, edit, setCurrent, setRecordQuyTrinh } =
    useModel('dichvumotcuav2');
  const { getAllDonViModel, danhSach } = useModel('donvi');

  useEffect(() => {
    getAllDonViModel();
  }, []);

  return (
    <Card title={edit ? 'Chỉnh sửa quy trình' : 'Thêm mới quy trình'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const quyTrinh: DichVuMotCuaV2.QuyTrinh = {
            danhSachBuoc: values?.quyTrinh?.danhSachBuoc?.map(
              (buoc: DichVuMotCuaV2.BuocQuyTrinh) => {
                return {
                  ...buoc,
                  danhSachThaoTac: buoc?.danhSachThaoTac?.map(
                    (thaoTac: DichVuMotCuaV2.ThaoTacQuyTrinh) => ({
                      ...thaoTac,
                      idDonVi: thaoTac?.idDonVi?.toString(),
                      tenDonVi:
                        danhSach?.find((item) => item.id.toString() === thaoTac.idDonVi)
                          ?.ten_don_vi ?? '',
                    }),
                  ),
                };
              },
            ),
          };
          setRecordQuyTrinh(quyTrinh);
          setCurrent(1);
        }}
        form={form}
      >
        <Form.List
          name={['quyTrinh', 'danhSachBuoc']}
          initialValue={recordQuyTrinh?.danhSachBuoc ?? []}
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
            {/* <Steps
              style={{ marginRight: 8, minWidth: 300 }}
              current={current}
              onChange={(val) => {
                setCurrent(val);
              }}
            >
              <Steps.Step title="Quy trình" description="" />
              <Steps.Step title="Biểu mẫu" description="" />
            </Steps> */}

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
