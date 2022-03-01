import { Input } from 'antd';

const Text = (props: { dapAn?: string }) => {
  return <Input.TextArea rows={3} value={props?.dapAn} readOnly />;
};

export default Text;
