import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import SingleChoice from './SingleChoice';

const GridChoice = (props: { name: number }) => {
  return (
    <Row gutter={[40, 0]}>
      <Col span={12}>
        <Form.List
          name={[props.name, 'luaChonHang']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 hàng'));
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
                    <SingleChoice
                      key={field.key}
                      type="grid"
                      index={index}
                      remove={remove}
                      fieldName={field.name}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                  <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm hàng
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Col>
      <Col span={12}>
        <Form.List
          name={[props.name, 'luaChonCot']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 cột'));
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
                    <SingleChoice
                      key={field.key}
                      type="grid"
                      index={index}
                      remove={remove}
                      fieldName={field.name}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                  <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm cột
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Col>
    </Row>
  );
};

export default GridChoice;
