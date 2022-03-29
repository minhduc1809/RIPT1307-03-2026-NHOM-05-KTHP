/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { Radio, Form } from 'antd';

const SingleChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
}) => {
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.required] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Radio.Group>
        {props.question?.luaChon?.map((item) => (
          <Radio key={item._id} value={item._id}>
            {item.noiDung}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default SingleChoice;
