import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
  relate?: boolean;
  indexBlock?: number;
  indexDataSource?: number;
}) => {
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={12}>
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
                return Promise.reject(new Error('Ít nhất 1 thao tac'));
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
                  <div>abc</div>
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Thêm lựa chọn
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
