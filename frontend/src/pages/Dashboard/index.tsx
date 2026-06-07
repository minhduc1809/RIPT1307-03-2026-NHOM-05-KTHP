// design: smartadmin.pen · frame 03
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	FieldTimeOutlined,
	FileTextOutlined,
	InboxOutlined,
	TrophyOutlined,
} from '@ant-design/icons';
import { RefreshCcw } from 'lucide-react';
import { Spin, Tooltip } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import moment from 'moment';
import { useModel } from 'umi';
import {
	getDashboardSummary,
	getMyDashboardSummary,
	getSubmissionsByDay,
	getSubmissionsByStatus,
	getTopForms,
	getSlaMetrics,
} from '@/services/Dashboard/dashboardApi';
import styles from './index.less';

interface ISummary {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
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
	formName: string | null;
	count: number;
}

interface ISlaMetric {
	definitionName: string;
	step: string;
	slaHours: number;
	totalInstances: number;
	breachedCount: number;
	complianceRate: number;
	avgDurationHours: number;
}

function extractData<T>(res: any): T {
	return res?.data?.data ?? res?.data ?? res;
}

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

const STAT_CARDS: { key: keyof ISummary; icon: React.ReactNode; color: string; label: string }[] = [
	{ key: 'total', icon: <FileTextOutlined />, color: 'indigo', label: 'Tổng lượt nộp biểu mẫu' },
	{ key: 'approved', icon: <CheckCircleOutlined />, color: 'green', label: 'Đã được phê duyệt' },
	{ key: 'rejected', icon: <CloseCircleOutlined />, color: 'red', label: 'Bị từ chối' },
	{ key: 'pending', icon: <ClockCircleOutlined />, color: 'amber', label: 'Đang chờ xử lý' },
];

/** Hook lấy chiều rộng cửa sổ để điều chỉnh chart height */
function useWindowWidth() {
	const [width, setWidth] = useState(() => window.innerWidth);
	useEffect(() => {
		const handler = () => setWidth(window.innerWidth);
		window.addEventListener('resize', handler);
		return () => window.removeEventListener('resize', handler);
	}, []);
	return width;
}

const Dashboard: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const userRole = initialState?.currentUser?.role;
	const isFullDashboard = userRole === 'ADMIN' || userRole === 'MANAGER';

	const windowWidth = useWindowWidth();
	const isMobile = windowWidth <= 480;
	const isTablet = windowWidth <= 768;

	const [summary, setSummary] = useState<ISummary | null>(null);
	const [statusData, setStatusData] = useState<IStatusItem[]>([]);
	const [dayData, setDayData] = useState<IDayItem[]>([]);
	const [topForms, setTopForms] = useState<ITopForm[]>([]);
	const [slaMetrics, setSlaMetrics] = useState<ISlaMetric[]>([]);

	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [selectedDays, setSelectedDays] = useState(30);

	// Dùng ref để giữ giá trị mới nhất mà không tạo dependency trong useEffect
	const selectedDaysRef = useRef(selectedDays);
	const isFullDashboardRef = useRef(isFullDashboard);
	selectedDaysRef.current = selectedDays;
	isFullDashboardRef.current = isFullDashboard;

	const fetchAll = useCallback(
		async (showRefresh = false) => {
			if (showRefresh) setRefreshing(true);
			else setLoading(true);
			// giữ spin tối thiểu 600ms để người dùng thấy phản hồi khi dữ liệu trả về quá nhanh
			const minSpin = showRefresh ? new Promise((r) => setTimeout(r, 600)) : Promise.resolve();

			try {
				if (isFullDashboardRef.current) {
					const [summaryRes, statusRes, dayRes, topRes, slaRes] = await Promise.all([
						getDashboardSummary(),
						getSubmissionsByStatus(),
						getSubmissionsByDay(selectedDaysRef.current),
						getTopForms(10),
						getSlaMetrics(selectedDaysRef.current),
					]);

					setSummary(extractData<ISummary>(summaryRes));

					const rawStatus = extractData<IStatusItem[] | any>(statusRes);
					setStatusData(Array.isArray(rawStatus) ? rawStatus : []);

					const rawDay = extractData<IDayItem[] | any>(dayRes);
					setDayData(Array.isArray(rawDay) ? rawDay : []);

					const rawTop = extractData<ITopForm[] | any>(topRes);
					setTopForms(Array.isArray(rawTop) ? rawTop : []);

					const rawSla = extractData<ISlaMetric[] | any>(slaRes);
					setSlaMetrics(Array.isArray(rawSla) ? rawSla : []);
				} else {
					const summaryRes = await getMyDashboardSummary();
					setSummary(extractData<ISummary>(summaryRes));
				}
			} catch (error) {
				console.error('Dashboard fetch error', error);
			} finally {
				await minSpin;
				setLoading(false);
				setRefreshing(false);
			}
		},
		[], // stable — đọc giá trị mới nhất qua ref
	);

	// Fetch lần đầu khi mount
	useEffect(() => {
		fetchAll();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Fetch lại khi selectedDays thay đổi (không dùng loading screen, chỉ refresh nhẹ)
	useEffect(() => {
		fetchAll(true);
	}, [selectedDays]); // eslint-disable-line react-hooks/exhaustive-deps

	// ─── Chart heights — responsive theo window width ───────────────────────
	const donutHeight = isMobile ? 260 : isTablet ? 280 : 240;
	const areaHeight = isMobile ? 180 : isTablet ? 200 : 210;

	const donutOptions: ApexOptions = {
		chart: { type: 'donut', fontFamily: 'inherit' },
		labels: statusData.map((s) => s.status),
		colors: statusData.map((s) => getStatusColor(s.status)),
		legend: {
			// Mobile: legend bên dưới chart để tiết kiệm chiều ngang
			position: isMobile ? 'bottom' : 'right',
			fontWeight: 600,
			fontSize: isMobile ? '11px' : '12px',
			labels: { colors: '#334155' },
			markers: { width: 8, height: 8, radius: 8 } as any,
			itemMargin: { horizontal: 4, vertical: 4 },
		},
		dataLabels: { enabled: false },
		plotOptions: {
			pie: {
				donut: {
					size: '66%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng số',
							fontSize: '11px',
							fontWeight: 500,
							color: '#64748b',
							formatter: (w) => {
								const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
								return total.toLocaleString();
							},
						},
						value: {
							fontSize: isMobile ? '20px' : '24px',
							fontWeight: 800,
							color: '#0f172a',
							offsetY: 4,
						},
					},
				},
			},
		},
		stroke: { width: 2, colors: ['#fff'] },
		tooltip: {
			y: { formatter: (val: number) => `${val} submissions` },
		},
	};

	const areaOptions: ApexOptions = {
		chart: {
			type: 'area',
			fontFamily: 'inherit',
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		colors: ['#4f46e5'],
		dataLabels: { enabled: false },
		stroke: { curve: 'smooth', width: 2.5 },
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.3,
				opacityTo: 0,
				stops: [0, 100],
			},
		},
		xaxis: {
			categories: dayData.map((d) => moment(d.date).format('DD/MM')),
			labels: {
				style: { colors: '#94a3b8', fontSize: isMobile ? '10px' : '11px', fontWeight: 500 },
				rotate: -45,
				rotateAlways: dayData.length > 10,
			},
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: {
			labels: {
				style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 500 },
				formatter: (val: number) => Math.round(val).toString(),
			},
		},
		grid: {
			borderColor: '#f1f5f9',
			strokeDashArray: 0,
			xaxis: { lines: { show: false } },
		},
		tooltip: {
			x: { format: 'dd/MM/yyyy' },
			y: { formatter: (val: number) => `${val} submissions` },
		},
	};

	const areaSeries = [{ name: 'Submissions', data: dayData.map((d) => d.count) }];

	const maxCount = topForms.length > 0 ? topForms[0].count : 1;

	const getRankClass = (idx: number) => {
		if (idx === 0) return styles.rank1;
		if (idx === 1) return styles.rank2;
		if (idx === 2) return styles.rank3;
		return styles.rankOther;
	};

	const getRateClass = (rate: number) => {
		if (rate >= 90) return styles.good;
		if (rate >= 70) return styles.warn;
		return styles.bad;
	};

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
			{/* ─── Header ─────────────────────────────────────────────────────── */}
			<div className={styles.dashboardHeader}>
				<div className={styles.headerLeft}>
					<h1>Dashboard</h1>
					<p>{isFullDashboard ? 'Tổng quan hệ thống và phân tích dữ liệu submissions' : 'Tổng quan yêu cầu của tôi'}</p>
				</div>
				<Tooltip title="Làm mới dữ liệu">
					<button
						type="button"
						className={`${styles.refreshBtn} ${refreshing ? styles.spinning : ''}`}
						onClick={() => fetchAll(true)}
						disabled={refreshing}
					>
						<RefreshCcw size={14} className={styles.refreshIcon} />
						<span>Làm mới</span>
					</button>
				</Tooltip>
			</div>

			{/* ─── Stat cards ─────────────────────────────────────────────────── */}
			<div className={styles.statsGrid}>
				{STAT_CARDS.map((card, idx) => (
					<div key={card.key} className={`${styles.statCard} ${styles.fadeIn}`} style={{ animationDelay: `${0.05 * (idx + 1)}s` }}>
						<div className={`${styles.statIcon} ${styles[card.color]}`}>{card.icon}</div>
						<div>
							<div className={styles.statValue}>
								<CountUp end={(summary?.[card.key] as number) ?? 0} duration={1.5} separator="," />
							</div>
							<div className={styles.statLabel}>{card.label}</div>
						</div>
					</div>
				))}
			</div>

			{/* ─── Charts ─────────────────────────────────────────────────────── */}
			{isFullDashboard && (
				<div className={styles.chartsGrid}>
					{/* Donut chart */}
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
									height={donutHeight}
								/>
							) : (
								<div className={styles.emptyState}>
									<InboxOutlined className={styles.emptyIcon} />
									<span>Chưa có dữ liệu submission</span>
								</div>
							)}
						</div>
					</div>

					{/* Area chart */}
					<div className={`${styles.chartCard} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
						<div className={styles.chartHeader}>
							<div className={styles.chartTitle}>
								<h3>Submissions theo ngày</h3>
								<p>Xu hướng nộp biểu mẫu {selectedDays} ngày gần nhất</p>
							</div>
							<div className={styles.daysSelector}>
								{[7, 14, 30].map((d) => (
									<button
										type="button"
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
								<Chart options={areaOptions} series={areaSeries} type="area" width="100%" height={areaHeight} />
							) : (
								<div className={styles.emptyState}>
									<InboxOutlined className={styles.emptyIcon} />
									<span>Chưa có dữ liệu submission</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* ─── Bottom: Top forms + SLA ────────────────────────────────────── */}
			{isFullDashboard && (
				<div className={styles.bottomGrid}>
					{/* Top forms */}
					<div className={`${styles.sectionCard} ${styles.fadeIn}`} style={{ animationDelay: '0.35s' }}>
						<div className={styles.sectionHeader}>
							<TrophyOutlined className={`${styles.sectionIcon} ${styles.amber}`} />
							<h3>Top biểu mẫu được sử dụng nhiều nhất</h3>
						</div>

						{topForms.length > 0 ? (
							<div className={styles.topFormsList}>
								{topForms.map((form, idx) => (
									<div key={form.formId} className={styles.topFormItem}>
										<div className={`${styles.rankBadge} ${getRankClass(idx)}`}>{idx + 1}</div>
										<div className={styles.formInfo}>
											<div className={styles.formName}>{form.formName ?? 'Không có tên'}</div>
											<div className={styles.formBar}>
												<div className={styles.barFill} style={{ width: `${(form.count / maxCount) * 100}%` }} />
											</div>
										</div>
										<div className={styles.formCount}>
											<span className={styles.countValue}>
												<CountUp end={form.count} duration={1.2} separator="," />
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

					{/* SLA table */}
					{slaMetrics.length > 0 && (
						<div className={`${styles.sectionCard} ${styles.fadeIn}`} style={{ animationDelay: '0.4s' }}>
							<div className={styles.sectionHeader}>
								<FieldTimeOutlined className={`${styles.sectionIcon} ${styles.indigo}`} />
								<h3>Tuân thủ SLA theo bước</h3>
							</div>

							<div className={styles.slaTableWrapper}>
								<table className={styles.slaTable}>
									<thead>
										<tr>
											<th>QUY TRÌNH</th>
											<th>BƯỚC</th>
											<th className={styles.num}>SLA (GIỜ)</th>
											<th className={styles.num}>TỔNG</th>
											<th className={styles.num}>VI PHẠM</th>
											<th className={styles.num}>TB (GIỜ)</th>
											<th className={styles.num}>TUÂN THỦ</th>
										</tr>
									</thead>
									<tbody>
										{slaMetrics.map((m, idx) => (
											// eslint-disable-next-line react/no-array-index-key
											<tr key={idx}>
												<td>{m.definitionName}</td>
												<td className={styles.stepCol}>{m.step}</td>
												<td className={styles.num}>{m.slaHours}</td>
												<td className={styles.num}>{m.totalInstances}</td>
												<td className={styles.num}>{m.breachedCount}</td>
												<td className={styles.num}>{m.avgDurationHours}</td>
												<td className={`${styles.num} ${styles.rate} ${getRateClass(m.complianceRate)}`}>
													{m.complianceRate}%
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Dashboard;
