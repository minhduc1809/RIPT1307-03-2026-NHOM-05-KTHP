import { Result } from 'antd';

const ResultWithLogo = (props: {
  logo?: any;
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  extra?: React.ReactNode;
}) => {
  return (
    <Result
      style={{ backgroundColor: 'white', paddingBottom: 20 }}
      icon={props?.logo ? <img alt="" height="200px" src={props?.logo} /> : false}
      title={props?.title}
      subTitle={props?.subTitle}
      extra={props?.extra}
    />
  );
};

export default ResultWithLogo;
