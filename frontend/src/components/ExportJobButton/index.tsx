import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DownloadOutlined,
	ExportOutlined,
	LoadingOutlined,
	RedoOutlined,
} from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	createExportJob,
	getExportJobStatus,
	getExportDownloadUrl,
	retryExportJob,
} from '@/services/Files/fileApi';
import styles from './index.less';

interface ExportJobButtonProps {
	formId?: string;
	fromDate?: string;
	toDate?: string;
	buttonText?: string;
}

type JobStatus = 'IDLE' | 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

const ExportJobButton: React.FC<ExportJobButtonProps> = ({
	formId,
	fromDate,
	toDate,
	buttonText = 'Xuất Excel',
}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [jobId, setJobId] = useState<string | null>(null);
	const [status, setStatus] = useState<JobStatus>('IDLE');
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	const stopPolling = useCallback(() => {
		if (pollingRef.current) {
			clearInterval(pollingRef.current);
			pollingRef.current = null;
		}
	}, []);

	const pollJobStatus = useCallback(
		(id: string) => {
			stopPolling();
			pollingRef.current = setInterval(async () => {
				try {
					const res = await getExportJobStatus(id);
					const data = (res as any)?.data?.data ?? (res as any)?.data;
					setProgress(data?.progress ?? 0);

					if (data?.status === 'DONE') {
						setStatus('DONE');
						setDownloadUrl(data?.result?.url || data?.result?.filepath || null);
						stopPolling();
					} else if (data?.status === 'FAILED') {
						setStatus('FAILED');
						setError(data?.error ?? 'Export thất bại');
						stopPolling();
					} else {
						setStatus(data?.status === 'PROCESSING' ? 'PROCESSING' : 'PENDING');
					}
				} catch {
					// ignore transient poll errors
				}
			}, 2000);
		},
		[stopPolling],
	);

	useEffect(() => {
		return () => stopPolling();
	}, [stopPolling]);

	const handleStartExport = async () => {
		setStatus('PENDING');
		setProgress(0);
		setError(null);
		setModalVisible(true);

		try {
			const res = await createExportJob({ formId, fromDate, toDate });
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			const id = data?.id;
			if (!id) throw new Error('Không nhận được Job ID');
			setJobId(id);
			pollJobStatus(id);
		} catch (err: any) {
			setStatus('FAILED');
			setError(err?.response?.data?.message || 'Không thể tạo export job');
		}
	};

	const handleRetry = async () => {
		if (!jobId) return;
		setStatus('PENDING');
		setProgress(0);
		setError(null);

		try {
			await retryExportJob(jobId);
			message.info('Đang thử lại...');
			pollJobStatus(jobId);
		} catch (err: any) {
			setStatus('FAILED');
			setError(err?.response?.data?.message || 'Không thể thử lại');
		}
	};

	const handleDownload = async () => {
		if (!jobId) return;

		// If Cloudinary URL, open directly (public URL, no auth needed)
		if (downloadUrl && downloadUrl.startsWith('http')) {
			window.open(downloadUrl, '_blank');
			return;
		}

		// Fallback: download from backend with auth header
		try {
			const token = localStorage.getItem('token');
			const url = getExportDownloadUrl(jobId);
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!response.ok) throw new Error('Download failed');
			const blob = await response.blob();
			const blobUrl = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = `export-${jobId}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(blobUrl);
		} catch {
			message.error('Không thể tải file. Vui lòng thử lại.');
		}
	};

	const handleClose = () => {
		stopPolling();
		setModalVisible(false);
		setStatus('IDLE');
		setJobId(null);
		setProgress(0);
		setError(null);
		setDownloadUrl(null);
	};

	return (
		<>
			<Button icon={<ExportOutlined />} onClick={handleStartExport} className={styles.trigger}>
				{buttonText}
			</Button>

			{/* design: smartadmin.pen frame 18 */}
			<Modal
				visible={modalVisible}
				onCancel={handleClose}
				footer={null}
				destroyOnClose
				centered
				width={360}
				closable={status !== 'PENDING' && status !== 'PROCESSING'}
				maskClosable={false}
				className={styles.modal}
			>
				<div className={styles.body}>
					{(status === 'PENDING' || status === 'PROCESSING') && (
						<>
							<span className={styles.title}>Xuất dữ liệu Excel</span>
							<LoadingOutlined className={styles.spinner} />
							<span className={styles.statusText}>Đang xuất dữ liệu... {progress}%</span>
							<div className={styles.track}>
								<div className={styles.fill} style={{ width: `${progress}%` }} />
							</div>
							<span className={styles.hint}>(Vui lòng chờ đến khi tiến trình kết thúc!)</span>
						</>
					)}

					{status === 'DONE' && (
						<>
							<CheckCircleOutlined className={styles.doneIcon} />
							<span className={styles.doneText}>Xuất dữ liệu thành công!</span>
							<button type='button' className={styles.downloadBtn} onClick={handleDownload}>
								<DownloadOutlined /> Tải file Excel
							</button>
						</>
					)}

					{status === 'FAILED' && (
						<>
							<CloseCircleOutlined className={styles.failIcon} />
							<span className={styles.failText}>Xuất dữ liệu thất bại</span>
							{error && <span className={styles.errorText}>{error}</span>}
							<button type='button' className={styles.retryBtn} onClick={handleRetry}>
								<RedoOutlined /> Thử lại
							</button>
						</>
					)}
				</div>
			</Modal>
		</>
	);
};

export default ExportJobButton;
