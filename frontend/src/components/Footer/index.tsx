import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'CopyRight',
  });

  return (
    <DefaultFooter
      copyright={`2021 ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: 'Học viện Công nghệ Bưu chính Viễn thông',
          href: 'https://portal.ptit.edu.vn/',
          blankTarget: true,
        },
      ]}
    />
  );
};
