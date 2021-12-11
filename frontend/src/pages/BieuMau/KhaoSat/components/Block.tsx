import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Input, Tooltip } from 'antd';
import BlockQuestion from './BlockQuestion';
import styles from './block.css';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean; fieldKey: number };
}) => {
  return (
    <>
      <Form.Item style={{ marginBottom: 12 }} name={[props.field.name, 'tieuDe']} label="Tiêu đề">
        <Input placeholder="Tiêu đề" />
      </Form.Item>
      <Form.Item name={[props.field.name, 'moTa']} label="Mô tả">
        <Input.TextArea rows={2} placeholder="Mô tả" />
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
        {(fields, { add, remove, move }, { errors }) => {
          return (
            <>
              {fields.map((field, index) => (
                <>
                  <Card
                    size="small"
                    headStyle={{ padding: '0px 24px' }}
                    bodyStyle={{ padding: '8px 24px' }}
                    key={field.key}
                    className={styles.block}
                    title={
                      <>
                        <div style={{ float: 'left' }}>Câu hỏi {index + 1}</div>
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
