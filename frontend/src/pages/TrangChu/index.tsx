import { Card } from 'antd';
import './components/style.less';
import { unitName } from '@/services/base/constant';

const TrangChu = () => {
	return (
		<Card bodyStyle={{ height: '100%' }}>
			<div className='home-welcome'>
				<h1 className='title'>PHÂN HỆ QUẢN LÝ ĐÀO TẠO</h1>
				<h2 className='sub-title'>HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH - {unitName.toUpperCase()}</h2>
			</div>
		</Card>
	);
};

export default TrangChu;
