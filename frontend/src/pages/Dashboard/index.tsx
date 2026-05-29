import {
	FileTextOutlined,
	FormOutlined,
	InboxOutlined,
	ReloadOutlined,
	TeamOutlined,
	ClockCircleOutlined,
	CalendarOutlined,
	TrophyOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import moment from 'moment';
import {
	getDashboardSummary,
	getSubmissionsByDay,
	getSubmissionsByStatus,
	getTopForms,
} from '@/services/Dashboard/dashboardApi';
import styles from './index.less';

// =============================================
// TYPE DEFINITIONS
// =============================================
interface ISummary {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
	// Legacy fields (may be added later)
	totalForms?: number;
	totalSubmissions?: number;
	totalUsers?: number;
	pendingSubmissions?: number;
}

interface IStatusItem {
	status: string;
	count: number;
}

interface IDayItem {
	date: string;
	count: number;
}

interface ITopForm {
	formId: string;
	formTitle: string;
	submissionCount: number;
}

// =============================================
// HELPER – extract data from axios response
// =============================================
function extractData<T>(res: any): T {
	return res?.data?.data ?? res?.data ?? res;
}

// =============================================
// STATUS COLOR MAP
// =============================================
const STATUS_COLORS: Record<string, string> = {
	PENDING: '#f59e0b',
	APPROVED: '#10b981',
	REJECTED: '#ef4444',
	DRAFT: '#94a3b8',
	IN_REVIEW: '#6366f1',
	SUBMITTED: '#06b6d4',
	COMPLETED: '#22c55e',
	CANCELLED: '#dc2626',
};

function getStatusColor(status: string): string {
	return STATUS_COLORS[status.toUpperCase()] || '#94a3b8';
}

// =============================================
// BAR GRADIENT COLORS (for top forms)
// =============================================
const BAR_GRADIENTS = [
	'linear-gradient(90deg, #6366f1, #818cf8)',
	'linear-gradient(90deg, #06b6d4, #67e8f9)',
	'linear-gradient(90deg, #f59e0b, #fbbf24)',
	'linear-gradient(90deg, #8b5cf6, #a78bfa)',
	'linear-gradient(90deg, #ec4899, #f472b6)',
	'linear-gradient(90deg, #10b981, #34d399)',
	'linear-gradient(90deg, #f97316, #fb923c)',
	'linear-gradient(90deg, #14b8a6, #2dd4bf)',
	'linear-gradient(90deg, #e11d48, #fb7185)',
	'linear-gradient(90deg, #7c3aed, #a78bfa)',
];

// =============================================
// DASHBOARD COMPONENT
// =============================================
const Dashboard: React.FC = () => {
	// Data state
	const [summary, setSummary] = useState<ISummary | null>(null);
	const [statusData, setStatusData] = useState<IStatusItem[]>([]);
	const [dayData, setDayData] = useState<IDayItem[]>([]);
	const [topForms, setTopForms] = useState<ITopForm[]>([]);

	// Loading state
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Chart controls
	const [selectedDays, setSelectedDays] = useState(30);

	// ----- FETCH ALL DATA -----
	const fetchAll = useCallback(async (showRefresh = false) => {
		if (showRefresh) setRefreshing(true);
		else setLoading(true);

		try {
			const [summaryRes, statusRes, dayRes, topRes] = await Promise.all([
				getDashboardSummary(),
				getSubmissionsByStatus(),
				getSubmissionsByDay(selectedDays),
				getTopForms(10),
			]);

			setSummary(extractData<ISummary>(summaryRes));

			const rawStatus = extractData<IStatusItem[] | any>(statusRes);
			setStatusData(Array.isArray(rawStatus) ? rawStatus : []);

			const rawDay = extractData<IDayItem[] | any>(dayRes);
			setDayData(Array.isArray(rawDay) ? rawDay : []);

			const rawTop = extractData<ITopForm[] | any>(topRes);
			setTopForms(Array.isArray(rawTop) ? rawTop : []);
		} catch (error) {
			console.error('Dashboard fetch error', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [selectedDays]);

	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	// ----- CHART CONFIG: DONUT (status) -----
	const donutOptions: ApexOptions = {
		chart: { type: 'donut', fontFamily: 'inherit' },
		labels: statusData.map((s) => s.status),
		colors: statusData.map((s) => getStatusColor(s.status)),
		legend: {
			position: 'bottom',
			fontWeight: 600,
			fontSize: '12px',
			labels: { colors: '#64748b' },
			markers: { width: 10, height: 10, radius: 4 },
			itemMargin: { horizontal: 8, vertical: 4 },
		},
		dataLabels: {
			enabled: true,
			dropShadow: { enabled: false },
			style: { fontSize: '12px', fontWeight: 700 },
		},
		plotOptions: {
			pie: {
				donut: {
					size: '58%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng',
							fontSize: '13px',
							fontWeight: 800,
							color: '#94a3b8',
							formatter: (w) => {
								const total = w.globals.seriesTotals.reduce(
									(a: number, b: number) => a + b,
									0,
								);
								return total.toString();
							},
						},
						value: {
							fontSize: '28px',
							fontWeight: 900,
							color: '#1a2332',
							offsetY: 4,
						},
					},
				},
			},
		},
		stroke: { width: 2, colors: ['#fff'] },
		tooltip: {
			y: {
				formatter: (val: number) => `${val} submissions`,
			},
		},
		responsive: [
			{
				breakpoint: 576,
				options: {
					chart: { height: 300 },
					legend: { fontSize: '11px' },
				},
			},
		],
	};

	// ----- CHART CONFIG: AREA (daily submissions) -----
	const areaOptions: ApexOptions = {
		chart: {
			type: 'area',
			fontFamily: 'inherit',
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		colors: ['#6366f1'],
		dataLabels: { enabled: false },
		stroke: { curve: 'smooth', width: 3 },
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.35,
				opacityTo: 0.05,
				stops: [0, 90, 100],
			},
		},
		xaxis: {
			categories: dayData.map((d) => moment(d.date).format('DD/MM')),
			labels: {
				style: {
					colors: '#94a3b8',
					fontSize: '10px',
					fontWeight: 600,
				},
				rotate: -45,
				rotateAlways: dayData.length > 15,
			},
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: {
			labels: {
				style: {
					colors: '#94a3b8',
					fontSize: '11px',
					fontWeight: 600,
				},
				formatter: (val: number) => Math.round(val).toString(),
			},
		},
		grid: {
			borderColor: '#f0f4f7',
			strokeDashArray: 4,
			xaxis: { lines: { show: false } },
		},
		tooltip: {
			x: { format: 'dd/MM/yyyy' },
			y: { formatter: (val: number) => `${val} submissions` },
		},
		responsive: [
			{
				breakpoint: 576,
				options: {
					chart: { height: 260 },
				},
			},
		],
	};

	const areaSeries = [
		{
			name: 'Submissions',
			data: dayData.map((d) => d.count),
		},
	];

	// ----- RENDER HELPERS -----
	const maxCount = topForms.length > 0 ? topForms[0].submissionCount : 1;

	const getRankClass = (idx: number) => {
		if (idx === 0) return styles.rank1;
		if (idx === 1) return styles.rank2;
		if (idx === 2) return styles.rank3;
		return styles.rankOther;
	};

	// ----- LOADING STATE -----
	if (loading) {
		return (
			<div className={styles.dashboardPage}>
				<div className={styles.loadingState} style={{ minHeight: '60vh' }}>
					<Spin size="large" />
					<span>Đang tải dữ liệu Dashboard...</span>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.dashboardPage}>
			{/* ====== HEADER ====== */}
			<div className={styles.dashboardHeader}>
				<div className={styles.headerLeft}>
					<h1>Dashboard</h1>
					<p>Tổng quan hệ thống quản lý biểu mẫu</p>
				</div>
				<div className={styles.headerRight}>
					<Tooltip title="Làm mới dữ liệu">
						<button
							className={`${styles.refreshBtn} ${refreshing ? styles.spinning : ''}`}
							onClick={() => fetchAll(true)}
							disabled={refreshing}
						>
							<ReloadOutlined className={styles.refreshIcon} />
							{refreshing ? 'Đang tải...' : 'Làm mới'}
						</button>
					</Tooltip>
				</div>
			</div>

			{/* ====== STAT CARDS ====== */}
			<div className={styles.statsGrid}>
				<div className={`${styles.statCard} ${styles.forms} ${styles.fadeIn}`} style={{ animationDelay: '0.05s' }}>
					<div className={styles.statTop}>
						<span className={styles.statLabel}>Tổng submissions</span>
						<div className={`${styles.statIcon} ${styles.formIcon}`}>
							<FormOutlined />
						</div>
					</div>
					<div className={styles.statValue}>
						<CountUp end={summary?.total ?? 0} duration={1.5} separator="," />
					</div>
					<div className={`${styles.statChange} ${styles.neutral}`}>
						<CalendarOutlined /> Tổng lượt nộp biểu mẫu
					</div>
				</div>

				<div className={`${styles.statCard} ${styles.submissions} ${styles.fadeIn}`} style={{ animationDelay: '0.1s' }}>
					<div className={styles.statTop}>
						<span className={styles.statLabel}>Đã duyệt</span>
						<div className={`${styles.statIcon} ${styles.submissionIcon}`}>
							<FileTextOutlined />
						</div>
					</div>
					<div className={styles.statValue}>
						<CountUp end={summary?.approved ?? 0} duration={1.5} separator="," />
					</div>
					<div className={`${styles.statChange} ${styles.neutral}`}>
						<InboxOutlined /> Submissions đã được phê duyệt
					</div>
				</div>

				<div className={`${styles.statCard} ${styles.users} ${styles.fadeIn}`} style={{ animationDelay: '0.15s' }}>
					<div className={styles.statTop}>
						<span className={styles.statLabel}>Từ chối</span>
						<div className={`${styles.statIcon} ${styles.userIcon}`}>
							<CloseCircleOutlined />
						</div>
					</div>
					<div className={styles.statValue}>
						<CountUp end={summary?.rejected ?? 0} duration={1.5} separator="," />
					</div>
					<div className={`${styles.statChange} ${styles.neutral}`}>
						<CloseCircleOutlined /> Submissions bị từ chối
					</div>
				</div>

				<div className={`${styles.statCard} ${styles.pending} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
					<div className={styles.statTop}>
						<span className={styles.statLabel}>Chờ duyệt</span>
						<div className={`${styles.statIcon} ${styles.pendingIcon}`}>
							<ClockCircleOutlined />
						</div>
					</div>
					<div className={styles.statValue}>
						<CountUp end={summary?.pending ?? 0} duration={1.5} separator="," />
					</div>
					<div className={`${styles.statChange} ${styles.neutral}`}>
						<ClockCircleOutlined /> Submissions đang chờ xử lý
					</div>
				</div>
			</div>

			{/* ====== CHARTS ====== */}
			<div className={styles.chartsGrid}>
				{/* Donut – Submissions by Status */}
				<div className={`${styles.chartCard} ${styles.fadeIn}`} style={{ animationDelay: '0.25s' }}>
					<div className={styles.chartHeader}>
						<div className={styles.chartTitle}>
							<h3>Phân bổ theo trạng thái</h3>
							<p>Tỷ lệ submission theo từng trạng thái</p>
						</div>
					</div>
					<div className={styles.chartBody}>
						{statusData.length > 0 ? (
							<Chart
								options={donutOptions}
								series={statusData.map((s) => s.count)}
								type="donut"
								width="100%"
								height={340}
							/>
						) : (
							<div className={styles.emptyState}>
								<InboxOutlined className={styles.emptyIcon} />
								<span>Chưa có dữ liệu submission</span>
							</div>
						)}
					</div>
				</div>

				{/* Area – Submissions by Day */}
				<div className={`${styles.chartCard} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
					<div className={styles.chartHeader}>
						<div className={styles.chartTitle}>
							<h3>Submissions theo ngày</h3>
							<p>Biểu đồ {selectedDays} ngày gần nhất</p>
						</div>
						<div className={styles.daysSelector}>
							{[7, 14, 30].map((d) => (
								<button
									key={d}
									className={`${styles.dayBtn} ${selectedDays === d ? styles.active : ''}`}
									onClick={() => setSelectedDays(d)}
								>
									{d}D
								</button>
							))}
						</div>
					</div>
					<div className={styles.chartBody}>
						{dayData.length > 0 ? (
							<Chart
								options={areaOptions}
								series={areaSeries}
								type="area"
								width="100%"
								height={320}
							/>
						) : (
							<div className={styles.emptyState}>
								<InboxOutlined className={styles.emptyIcon} />
								<span>Chưa có dữ liệu submission</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ====== TOP FORMS ====== */}
			<div className={`${styles.topFormsSection} ${styles.fadeIn}`} style={{ animationDelay: '0.35s' }}>
				<div className={styles.topFormsHeader}>
					<div className={styles.topFormsTitle}>
						<h3>
							<TrophyOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
							Top biểu mẫu được sử dụng nhiều nhất
						</h3>
						<p>Danh sách {topForms.length} form có số lượt nộp cao nhất</p>
					</div>
				</div>

				{topForms.length > 0 ? (
					<div className={styles.topFormsList}>
						{topForms.map((form, idx) => (
							<div key={form.formId} className={styles.topFormItem}>
								<div className={`${styles.rankBadge} ${getRankClass(idx)}`}>
									{idx + 1}
								</div>
								<div className={styles.formInfo}>
									<div className={styles.formName}>{form.formTitle}</div>
									<div className={styles.formMeta}>ID: {form.formId.slice(0, 8)}...</div>
									<div className={styles.formBar}>
										<div
											className={styles.barFill}
											style={{
												width: `${(form.submissionCount / maxCount) * 100}%`,
												background: BAR_GRADIENTS[idx % BAR_GRADIENTS.length],
											}}
										/>
									</div>
								</div>
								<div className={styles.formCount}>
									<span className={styles.countValue}>
										<CountUp end={form.submissionCount} duration={1.2} separator="," />
									</span>
									<span className={styles.countLabel}>lượt nộp</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className={styles.emptyState}>
						<InboxOutlined className={styles.emptyIcon} />
						<span>Chưa có dữ liệu top forms</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
