import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import BlockQuestion from './BlockQuestion';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
}) => {
  return (
    <>
      <Form.Item
        name={[props.field.name, 'tieuDe']}
        label="Tiêu đề"
        // rules={[...rules.required]}
        // initialValue={record?.moTa}
      >
        <Input placeholder="Tiêu đề" />
      </Form.Item>
      <Form.Item
        name={[props.field.name, 'moTa']}
        label="Mô tả"
        // rules={[...rules.required]}
        // initialValue={record?.moTa}
      >
        <Input.TextArea rows={3} placeholder="Mô tả" />
      </Form.Item>
      <Form.List
        name={[props.field.name, 'danhSachCauHoi']}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('Ít nhất 1 câu hỏi'));
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
                  <Card
                    // className={styles.block}
                    key={field.key}
                    title={
                      <>
                        <div style={{ float: 'left' }}>Câu hỏi {index + 1}</div>
                        <CloseCircleOutlined
                          style={{ float: 'right' }}
                          onClick={() => remove(field.name)}
                        />
                      </>
                    }
                  >
                    <BlockQuestion index={index} block={props.field.name} />
                  </Card>
                  <br />
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Thêm câu hỏi
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </>
  );
};

export default Block;
