import {
	ArrowRightOutlined,
	FileTextOutlined,
	FormOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Input, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import styles from './index.less';

const FormSubmit: React.FC = () => {
	const [forms, setForms] = useState<IForm[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		const loadForms = async () => {
			setLoading(true);
			try {
				const response = await getActiveForms();
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForms(Array.isArray(data) ? data : []);
			} catch {
				// silently fail
			} finally {
				setLoading(false);
			}
		};
		loadForms();
	}, []);

	const filteredForms = useMemo(() => {
		if (!searchText.trim()) return forms;
		return forms.filter(
			(f) =>
				f.name.toLowerCase().includes(searchText.toLowerCase()) ||
				(f.description ?? '').toLowerCase().includes(searchText.toLowerCase()),
		);
	}, [forms, searchText]);

	const getFieldCount = (form: IForm): number => {
		return form.schema?.fields?.length ?? 0;
	};

	const FORM_COLORS = [
		{ bg: '#ede9fe', color: '#7c3aed', icon: '📋' },
		{ bg: '#dbeafe', color: '#2563eb', icon: '📝' },
		{ bg: '#d1fae5', color: '#059669', icon: '📊' },
		{ bg: '#fef3c7', color: '#d97706', icon: '📄' },
		{ bg: '#fce7f3', color: '#db2777', icon: '📑' },
		{ bg: '#e0e7ff', color: '#4f46e5', icon: '📃' },
	];

	return (
		<div className={styles.submitPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div className={styles.headerTop}>
					<div>
						<h1>Nộp biểu mẫu</h1>
						<p>Chọn biểu mẫu bạn muốn điền và nộp</p>
					</div>
				</div>
			</div>

			{/* Search */}
			<div className={styles.searchBar}>
				<Input
					placeholder="Tìm kiếm biểu mẫu..."
					prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					allowClear
				/>
			</div>

			{/* Forms Grid */}
			{loading ? (
				<div className={styles.loadingContainer}>
					<Spin size="large" />
				</div>
			) : filteredForms.length === 0 ? (
				<div className={styles.emptyState}>
					<span>📭</span>
					<p>{searchText ? 'Không tìm thấy biểu mẫu phù hợp' : 'Chưa có biểu mẫu nào'}</p>
				</div>
			) : (
				<div className={styles.formsGrid}>
					{filteredForms.map((form, idx) => {
						const colorSet = FORM_COLORS[idx % FORM_COLORS.length];
						const fieldCount = getFieldCount(form);

						return (
							<div
								key={form.id}
								className={styles.formCard}
								onClick={() => history.push(`/submissions/new/${form.id}`)}
							>
								<div className={styles.cardTop}>
									<div
										className={styles.formIcon}
										style={{ background: colorSet.bg, color: colorSet.color }}
									>
										{colorSet.icon}
									</div>
									<div className={styles.arrowIcon}>
										<ArrowRightOutlined />
									</div>
								</div>

								<div className={styles.cardContent}>
									<h3 className={styles.formName}>{form.name}</h3>
									{form.description && (
										<p className={styles.formDesc}>{form.description}</p>
									)}
								</div>

								<div className={styles.cardFooter}>
									<span className={styles.fieldCount}>
										<FormOutlined /> {fieldCount} trường
									</span>
									<span className={styles.fillBtn}>
										Điền ngay <ArrowRightOutlined />
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default FormSubmit;
