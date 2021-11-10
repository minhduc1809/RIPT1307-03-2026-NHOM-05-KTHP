import rules from '@/utils/rules';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import styles from './block.css';
import BlockThaoTac from './BlockThaoTac';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
  relate?: boolean;
  indexBlock?: number;
  indexDataSource?: number;
}) => {
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={[props.field.name, 'ten']}
            label="Tên bước"
            rules={[...rules.required]}
          >
            <Input placeholder="Tên bước" />
          </Form.Item>
        </Col>
      </Row>

      <Form.List
        name={[props.field.name, 'danhSachThaoTac']}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('Ít nhất 1 thao tác'));
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
                <>
                  <div key={field.key}>
                    <Card
                      headStyle={{ padding: '8px 24px' }}
                      bodyStyle={{ padding: '8px 24px' }}
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Thao tác {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right' }}
                            onClick={() => remove(field.name)}
                          />
                        </>
                      }
                    >
                      <BlockThaoTac field={{ ...field }} />
                    </Card>
                    <br />
                  </div>
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Thêm thao tác
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>

      {/* <Form.Item valuePropName="checked" name={[props.field.name, 'isRequired']}>
        <Checkbox>Bắt buộc</Checkbox>
      </Form.Item> */}
    </>
  );
};

export default Block;
