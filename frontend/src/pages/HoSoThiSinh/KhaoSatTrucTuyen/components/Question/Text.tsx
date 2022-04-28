import type { BieuMau } from '@/services/BieuMau/typings';
import rules from '@/utils/rules';
import { Input, Form } from 'antd';

const Text = (props: { question: BieuMau.CauHoi; indexKhoi: number; indexCauHoi: number }) => {
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.required, ...rules.text, ...rules.length(500)] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Input.TextArea placeholder="Nhập câu trả lời" rows={3} />
    </Form.Item>
  );
};

export default Text;
