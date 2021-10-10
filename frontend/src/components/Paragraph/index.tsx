import { Typography } from 'antd';

const Paragraph = (text: any, rows?: number, style?: object) => (
  <Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
    {text}
  </Typography.Paragraph>
);

export default Paragraph;
