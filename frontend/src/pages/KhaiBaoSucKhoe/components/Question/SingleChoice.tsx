/* eslint-disable no-underscore-dangle */
import { Radio } from 'antd';

const SingleChoice = (props: { luaChon: { _id: string; noiDung: string }[]; dapAn: string[] }) => {
  return (
    <Radio.Group value={props.dapAn?.[0]}>
      {props.luaChon?.map((item) => (
        <Radio key={item._id} value={item._id}>
          {item.noiDung}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default SingleChoice;
