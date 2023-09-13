import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';
import { UserSwitchOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useModel } from 'umi';
import './style.less';

const ModuleView = () => {
	const { initialState } = useModel('@@initialState');
	const permissions = initialState?.authorizedPermissions?.map((item) => item.rsname);

	return (
		<div className='module-view'>
			<div className='module-header'>Danh sách chức năng</div>

			<Row gutter={[5, 5]}>
				{Object.entries(AppModules)
					.filter(([name]) => permissions?.includes(name as EModuleKey))
					.map(([name, value]) => (
						<Col span={8} key={name}>
							<a href={value?.url} target='_blank' rel='noreferrer'>
								<div className='module-item'>
									{value?.icon ? (
										<img src={`${AppModules[EModuleKey.QLDT].url}modules/${value.icon}`} />
									) : (
										<UserSwitchOutlined />
									)}
									<span className='module-name'>{value?.title ?? name}</span>
								</div>
							</a>
						</Col>
					))}
			</Row>
		</div>
	);
};

export default ModuleView;
