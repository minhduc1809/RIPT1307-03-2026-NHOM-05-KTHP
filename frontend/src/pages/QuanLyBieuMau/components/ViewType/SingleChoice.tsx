/* eslint-disable no-underscore-dangle */
import { Radio } from 'antd';

const SingleChoice = (props: {
  luaChon: { _id: string; noiDung: string; dung?: boolean }[];
  dapAn?: string[];
}) => {
  return (
    <Radio.Group value={props?.dapAn?.[0]}>
      {props.luaChon?.map((item) => (
        <Radio checked={true} key={item._id} value={item.noiDung}>
          {item.noiDung}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default SingleChoice;
