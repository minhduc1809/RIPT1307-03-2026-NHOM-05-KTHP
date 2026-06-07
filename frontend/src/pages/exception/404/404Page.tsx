import Footer from '@/components/Footer';
import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { history } from 'umi';

const NotFoundPage = () => {
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
				title='404'
				style={{
					background: 'none',
				}}
				subTitle='Xin lỗi, trang bạn yêu cầu không tồn tại.'
				extra={
					<Button type='primary' onClick={() => history.push('/')} icon={<HomeOutlined />}>
						Về trang chủ
					</Button>
				}
			/>

			<Footer />
		</div>
	);
};
export default NotFoundPage;
