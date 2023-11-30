import { AppModules } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import './style.less';
import { Link, history } from 'umi';

const HeaderContentPage = () => {
	return (
		<div className='header-content'>
			<img src='/logo.png' alt='logo' onClick={() => history.push('/')} />
			<div>
				<div className='text-error'>HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH</div>
				<Link to='/'>{AppModules[currentRole].title?.toLocaleUpperCase()}</Link>
			</div>
		</div>
	);
};

export default HeaderContentPage;
