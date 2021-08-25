import rules from '@/utils/rules';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import styles from '../block.css';

const MultipleChoice = (props: {
  index: number;
  remove: (index: number | number[]) => void;
  fieldName: number;
}) => {
  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Row>
        <Col sm={22}>
          <Form.Item
            name={[props.index, 'noiDung']}
            rules={[...rules.required]}
            label={`Lựa chọn ${props.index + 1}`}
          >
            <Input placeholder={`Nội dung câu trả lời ${props.index + 1}`} />
          </Form.Item>
        </Col>
        <Col sm={2}>
          <MinusCircleOutlined
            className={styles.deleteAnswer}
            onClick={() => props.remove(props.fieldName)}
          />
        </Col>
      </Row>
    </Form.Item>
  );
};

export default MultipleChoice;
