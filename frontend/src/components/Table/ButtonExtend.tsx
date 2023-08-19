import { Button, Tooltip, type ButtonProps } from 'antd';
import React from 'react';

/** Button extend text with default Tooltip */
const ButtonExtend = (
	props: {
		children?: React.ReactNode;
		tooltip?: React.ReactNode;
		notHideText?: boolean;
	} & ButtonProps,
) => {
	const { children, tooltip, notHideText, ...otherProps } = props;

	return (
		<Tooltip title={tooltip ?? children}>
			<Button {...otherProps}>{!notHideText ? <span className='extend'>{children}</span> : children}</Button>
		</Tooltip>
	);
};

export default ButtonExtend;
