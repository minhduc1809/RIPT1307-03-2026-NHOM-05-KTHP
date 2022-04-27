/* eslint-disable no-underscore-dangle */
import { Radio } from 'antd';

const SingleChoice = (props: {
  luaChon: { _id: string; noiDung: string; dung?: boolean }[];
  dapAn?: string[];
}) => {
  return (
    <Radio.Group value={props?.luaChon.find((o) => o.dung)?._id}>
      {props.luaChon?.map((item) => (
        <Radio checked={item.dung} key={item._id} value={item._id}>
          {item.noiDung}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default SingleChoice;
