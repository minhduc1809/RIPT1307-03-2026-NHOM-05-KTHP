import { CalendarOutlined, FileTextOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import styles from './index.less';

const ActiveForms: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [forms, setForms] = useState<IForm[]>([]);
	const [searchText, setSearchText] = useState('');

	const fetchActiveForms = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getActiveForms();
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setForms(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error('Failed to fetch active forms:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchActiveForms();
	}, [fetchActiveForms]);

	const filteredForms = forms.filter((form) => form.name.toLowerCase().includes(searchText.toLowerCase()));

	const getFieldCount = (form: IForm): number => {
		return form.schema?.fields?.length ?? 0;
	};

	const handleFillForm = (formId: string) => {
		history.push(`/forms/${formId}`);
	};

	return (
		<div className={styles.activeFormsPage}>
			{/* Header */}
			<div className={styles.headerSection}>
				<h1>Biểu mẫu đang hoạt động</h1>
				<p>Chọn biểu mẫu bạn muốn điền và gửi dữ liệu.</p>
			</div>

			{/* Search */}
			<div className={styles.searchBar}>
				<Input
					placeholder='Tìm kiếm biểu mẫu...'
					prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					allowClear
				/>
			</div>

			{/* Loading */}
			{loading && (
				<div className={styles.loadingContainer}>
					<Spin size='large' />
				</div>
			)}

			{/* Cards Grid */}
			{!loading && filteredForms.length > 0 && (
				<div className={styles.cardsGrid}>
					{filteredForms.map((form) => (
						<div key={form.id} className={styles.formCard} onClick={() => handleFillForm(form.id)}>
							<div className={styles.cardHeader}>
								<div className={styles.cardIcon}>
									<FileTextOutlined />
								</div>
								<div className={styles.cardTitle}>
									<h3>{form.name}</h3>
									<div className={styles.fieldCount}>{getFieldCount(form)} trường dữ liệu</div>
								</div>
							</div>

							<div className={styles.cardBody}>
								<div className={styles.cardDescription}>
									{form.description || 'Chưa có mô tả cho biểu mẫu này.'}
								</div>
								<div className={styles.cardFooter}>
									<div className={styles.cardDate}>
										<CalendarOutlined />
										{moment(form.createdAt).format('DD/MM/YYYY')}
									</div>
									<Button
										type='primary'
										size='small'
										className={styles.fillBtn}
										icon={<RightOutlined />}
										onClick={(e) => {
											e.stopPropagation();
											handleFillForm(form.id);
										}}
									>
										Điền biểu mẫu
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && filteredForms.length === 0 && (
				<div className={styles.emptyState}>
					<div className={styles.emptyIcon}>📋</div>
					<h3>{searchText ? 'Không tìm thấy biểu mẫu' : 'Chưa có biểu mẫu nào'}</h3>
					<p>
						{searchText
							? `Không có biểu mẫu nào khớp với "${searchText}"`
							: 'Hiện tại chưa có biểu mẫu nào đang hoạt động.'}
					</p>
				</div>
			)}
		</div>
	);
};

export default ActiveForms;
