import { landingUrl, unitName } from '@/services/ant-design-pro/constant';
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
			copyright={`2023 ${defaultMessage}`}
			links={[
				{
					key: 'github',
					title: unitName.toUpperCase(),
					href: landingUrl,
					blankTarget: true,
				},
			]}
			style={{ width: '100%' }}
		/>
	);
};
