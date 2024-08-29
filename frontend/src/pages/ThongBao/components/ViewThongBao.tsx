import { type ThongBao } from '@/services/ThongBao/typing';
import { getNameFile } from '@/utils/utils';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Row } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';
import { history } from 'umi';
import OneSignalDataToPath from './OneSignalDataToPath';
import './style.less';

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void; hideCard?: boolean }) => {
	const { record, afterViewDetail, hideCard } = props;
	const pathname = useMemo(() => OneSignalDataToPath(record?.metadata), [record?._id]);

	const redirectNotif = () => {
		if (pathname) {
			if (afterViewDetail) afterViewDetail();
			history.push({ pathname, query: {} });
		}
	};

	const content = (
		<>
			<Card.Meta
				avatar={record?.imageUrl ? <Avatar src={record?.imageUrl} size='large' /> : false}
				description={
					<>
						<div style={{ marginBottom: 8 }}>{record?.description}</div>
						<UserOutlined /> {record?.senderName ?? ''} <Divider type='vertical' />
						<CalendarOutlined /> {moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}
					</>
				}
			/>
			<br />
			<div dangerouslySetInnerHTML={{ __html: record?.content ?? '' }} className='notif-content' />
			<Row style={{ marginTop: 12 }} gutter={[12, 12]}>
				{record?.taiLieuDinhKem?.length ? (
					<>
						<Col span={24}>Tệp đính kèm: </Col>
						{record?.taiLieuDinhKem?.map((item) => (
							<Col span={24} key={item}>
								<a href={item} target='_blank' rel='noreferrer'>
									{getNameFile(item)}
								</a>
							</Col>
						))}
					</>
				) : null}

				{record?.thoiGianHieuLuc ? (
					<Col span={24}>
						Hiệu lực thông báo: <b style={{ color: 'red' }}>{moment(record?.thoiGianHieuLuc).format('DD/MM/YYYY')}</b>{' '}
					</Col>
				) : null}

				{pathname ? (
					<Col span={24}>
						<Button type='primary' onClick={redirectNotif}>
							Xem chi tiết
						</Button>
					</Col>
				) : null}
			</Row>
		</>
	);

	if (hideCard) return content;
	return <Card title={record?.title}>{content}</Card>;
};

export default ViewThongBao;
