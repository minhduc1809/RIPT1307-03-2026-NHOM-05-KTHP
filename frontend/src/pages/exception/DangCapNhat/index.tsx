import Footer from '@/components/Footer';
import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { history } from 'umi';

const DangCapNhatPage = () => {
	// Nếu Đang cập nhật thì bỏ cái này đi
	useEffect(() => {
		history.replace('/active-forms');
	}, []);

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexDirection: 'column',
			}}
		>
			<Result
				status='404'
				title='Đang cập nhật'
				style={{ background: 'none' }}
				subTitle='Hệ thống đang cập nhật. Vui lòng thử lại sau!'
				extra={
					<Button type='primary' onClick={() => history.replace('/')} icon={<HomeOutlined />}>
						Về trang chủ
					</Button>
				}
			/>

			<Footer />
		</div>
	);
};
export default DangCapNhatPage;
