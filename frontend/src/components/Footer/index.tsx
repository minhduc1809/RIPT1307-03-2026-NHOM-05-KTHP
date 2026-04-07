import { landingUrl, unitName } from '@/services/base/constant';
import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

export default () => {
	const intl = useIntl();
	const defaultMessage = intl.formatMessage({
		id: 'app.copyright.produced',
		defaultMessage: 'CopyRight',
	});

	return (
		<p>hello</p>
	);
};
