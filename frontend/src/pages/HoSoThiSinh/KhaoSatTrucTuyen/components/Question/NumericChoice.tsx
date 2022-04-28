import type { BieuMau } from '@/services/BieuMau/typings';
import rules from '@/utils/rules';
import { Radio, Form } from 'antd';

const NumericChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
}) => {
  const arrValue: number[] = [];
  for (
    let i = props.question?.gioiHanDuoiTuyenTinh;
    i <= props.question?.gioiHanTrenTuyenTinh;
    i += 1
  )
    arrValue.push(i);
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.required] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Radio.Group>
        {arrValue.map((item) => (
          <Radio key={item} value={item}>
            {item}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default NumericChoice;
