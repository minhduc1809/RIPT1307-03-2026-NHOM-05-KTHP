import { Button, Tooltip } from 'antd';
import React from 'react';

const ButtonExtend = (props: {
	icon: React.ReactNode;
	children?: React.ReactNode;
	tooltip?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	loading?: boolean;
	size?: 'middle' | 'small';
	type?: 'primary' | 'default';
	notHideText?: boolean;
	style?: React.CSSProperties;
}) => {
	const { icon, children, onClick, disabled, loading, size, type, tooltip, notHideText, style } = props;

	return (
		<Tooltip title={tooltip ?? children}>
			<Button icon={icon} onClick={onClick} disabled={disabled} loading={loading} size={size} type={type} style={style}>
				{!notHideText ? <span className='extend'>{children}</span> : children}
			</Button>
		</Tooltip>
	);
};

export default ButtonExtend;
