import { Radio } from 'antd';

const NumericChoice = (props: { luaChon: { start: number; end: number }; dapAn?: number }) => {
  const arrValue: number[] = [];
  for (let i = props.luaChon.start; i <= props.luaChon.end; i += 1) arrValue.push(i);
  return (
    <Radio.Group value={props?.dapAn}>
      {arrValue.map((item) => (
        <Radio key={item} value={item}>
          {item}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default NumericChoice;
