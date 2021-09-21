/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { Checkbox, Form } from 'antd';

const MultipleChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
}) => {
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.required] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Checkbox.Group>
        {props.question.luaChon?.map((item) => (
          <>
            <Checkbox key={item._id} value={item._id}>
              {item.noiDung}
            </Checkbox>
            <br />
          </>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );
};

export default MultipleChoice;
