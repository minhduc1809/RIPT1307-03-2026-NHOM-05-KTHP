import { Card } from 'antd';
import '../../TrangChu/components/style.less';
import { unitName } from '@/services/ant-design-pro/constant';

const AboutPage = () => {
	return (
		<Card bodyStyle={{ height: '100%' }}>
			<div className='home-welcome'>
				<h1 className='title'>GIỚI THIỆU HỌC VIỆN</h1>
				<h2 className='sub-title'>HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH - {unitName.toUpperCase()}</h2>
			</div>
		</Card>
	);
};

export default AboutPage;
