import { Button, Typography } from 'antd';
import { useState } from 'react';

const Paragraph = (text: any, rows?: number, style?: object) => {
  const [ellipsis, setEllipsis] = useState<boolean>(true);
  const onChangeEllipsis = () => {
    setEllipsis(!ellipsis);
  };
  return (
    <>
      {ellipsis ? (
        <Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
          {text}
        </Typography.Paragraph>
      ) : (
        <div>{text}</div>
      )}
      <Button onClick={onChangeEllipsis} size="small" type="link">
        {ellipsis ? 'Xem tiếp' : 'Thu gọn'}
      </Button>
    </>
  );
};

export default Paragraph;
