import { ToolOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import FormPostIssue from './Form';

const TechnicalSupportBounder = (props: { children: React.ReactNode }) => {
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<>
			{props.children}

			{window.location.pathname !== '/user/login' && window.location.pathname !== '/403' ? (
				<Tooltip title='Phản hồi kĩ thuật' placement='topLeft'>
					<Button
						onClick={() => setVisible(true)}
						style={{
							position: 'fixed',
							bottom: 100,
							right: 34,
							zIndex: 10,
							boxShadow: 'rgba(0, 0, 0, 0.2) 1px 1px 8px 3px',
						}}
						shape='circle'
						size='large'
						type='primary'
					>
						<ToolOutlined />
					</Button>
				</Tooltip>
			) : null}

			<Modal bodyStyle={{ padding: 0 }} footer={false} visible={visible} onCancel={() => setVisible(false)}>
				<FormPostIssue onCancel={() => setVisible(false)} />
			</Modal>
		</>
	);
};

export default TechnicalSupportBounder;
