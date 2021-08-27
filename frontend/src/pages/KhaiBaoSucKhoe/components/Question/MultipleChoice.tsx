/* eslint-disable no-underscore-dangle */
import { Checkbox } from 'antd';

const MultipleChoice = (props: {
  luaChon: { _id: string; noiDung: string }[];
  dapAn: string[];
}) => {
  return (
    <Checkbox.Group value={props.dapAn}>
      {props.luaChon?.map((item) => (
        <>
          <Checkbox key={item._id} value={item._id}>
            {item.noiDung}
          </Checkbox>
          <br />
        </>
      ))}
    </Checkbox.Group>
  );
};

export default MultipleChoice;
