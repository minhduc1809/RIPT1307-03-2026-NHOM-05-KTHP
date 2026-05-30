import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';

interface ApprovalStep {
	role: string;
	canReject: boolean;
	requireCommentOnReject: boolean;
	canReturn: boolean;
	requireCommentOnReturn: boolean;
}

interface ParallelData {
	roles: string[];
}

interface VotingData {
	voterRole: string;
	approveThreshold: number;
	rejectThreshold?: number;
}

interface MixedStage {
	type: 'sequential' | 'parallel' | 'voting';
	role?: string;
	parallelRoles?: string[];
	voterRole?: string;
	approveThreshold?: number;
	rejectThreshold?: number;
	canReject?: boolean;
	canReturn?: boolean;
}

interface WorkflowTreeProps {
	mode?: 'sequential' | 'parallel' | 'voting' | 'mixed';
	steps?: ApprovalStep[];
	parallelData?: ParallelData;
	votingData?: VotingData;
	mixedStages?: MixedStage[];
	roleLabels?: Record<string, string>;
}

const DEFAULT_ROLE_LABELS: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	HR: 'Nhân sự',
	USER: 'Nhân viên',
};

const NODE_W = 160;
const NODE_H = 52;
const GAP_Y = 60;
const GAP_X = 200;
const BRANCH_NODE_W = 120;
const BRANCH_NODE_H = 40;
const PAD = 40;

interface NodeDef {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	label: string;
	sublabel?: string;
	type: 'start' | 'step' | 'approved' | 'rejected' | 'returned';
	stepNum?: number;
}

interface EdgeDef {
	from: string;
	to: string;
	label?: string;
	type: 'main' | 'reject' | 'return';
}

function buildSequentialLayout(
	steps: ApprovalStep[],
	roleLabels: Record<string, string>,
) {
	const hasReject = steps.some((s) => s.canReject);
	const hasReturn = steps.some((s) => s.canReturn);
	const mainX = PAD + (hasReturn ? GAP_X : 0);
	const nodes: NodeDef[] = [];
	const edges: EdgeDef[] = [];

	let y = PAD;

	nodes.push({ id: 'start', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Nộp yêu cầu', sublabel: 'Nhân viên', type: 'start' });
	y += NODE_H + GAP_Y;

	steps.forEach((step, idx) => {
		const id = `step_${idx}`;
		nodes.push({ id, x: mainX, y, w: NODE_W, h: NODE_H, label: roleLabels[step.role] || step.role, sublabel: 'Xem xét & quyết định', type: 'step', stepNum: idx + 1 });
		const prevId = idx === 0 ? 'start' : `step_${idx - 1}`;
		edges.push({ from: prevId, to: id, label: idx === 0 ? '' : 'Duyệt', type: 'main' });

		if (step.canReject) {
			const rejId = `reject_${idx}`;
			nodes.push({ id: rejId, x: mainX + GAP_X, y: y + 4, w: BRANCH_NODE_W, h: BRANCH_NODE_H, label: 'Từ chối', sublabel: step.requireCommentOnReject ? 'Cần ghi chú' : undefined, type: 'rejected' });
			edges.push({ from: id, to: rejId, label: 'Từ chối', type: 'reject' });
		}
		if (step.canReturn) {
			const retId = `return_${idx}`;
			nodes.push({ id: retId, x: mainX - GAP_X, y: y + 4, w: BRANCH_NODE_W, h: BRANCH_NODE_H, label: 'Trả lại', sublabel: step.requireCommentOnReturn ? 'Cần ghi chú' : undefined, type: 'returned' });
			edges.push({ from: id, to: retId, label: 'Trả lại', type: 'return' });
		}

		y += NODE_H + GAP_Y;
	});

	nodes.push({ id: 'approved', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Phê duyệt', sublabel: 'Hoàn tất', type: 'approved' });
	edges.push({ from: `step_${steps.length - 1}`, to: 'approved', label: 'Duyệt', type: 'main' });

	const totalW = mainX + NODE_W + (hasReject ? GAP_X + BRANCH_NODE_W : 0) + PAD;
	const totalH = y + NODE_H + PAD;
	return { nodes, edges, width: totalW, height: totalH };
}

function buildParallelLayout(
	data: ParallelData,
	roleLabels: Record<string, string>,
) {
	const nodes: NodeDef[] = [];
	const edges: EdgeDef[] = [];
	const roleCount = data.roles.length;
	const colWidth = NODE_W + 20;
	const groupW = roleCount * colWidth;
	const centerX = PAD + groupW / 2;

	let y = PAD;

	nodes.push({ id: 'start', x: centerX - NODE_W / 2, y, w: NODE_W, h: NODE_H, label: 'Nộp yêu cầu', sublabel: 'Nhân viên', type: 'start' });
	y += NODE_H + GAP_Y;

	data.roles.forEach((role, i) => {
		const id = `role_${i}`;
		const x = PAD + i * colWidth + (colWidth - NODE_W) / 2;
		nodes.push({ id, x, y, w: NODE_W, h: NODE_H, label: roleLabels[role] || role, sublabel: 'Duyệt đồng thời', type: 'step', stepNum: i + 1 });
		edges.push({ from: 'start', to: id, type: 'main' });
	});

	y += NODE_H + GAP_Y;

	nodes.push({ id: 'approved', x: centerX - NODE_W / 2, y, w: NODE_W, h: NODE_H, label: 'Phê duyệt', sublabel: 'Tất cả đã duyệt', type: 'approved' });
	data.roles.forEach((_, i) => {
		edges.push({ from: `role_${i}`, to: 'approved', label: 'Duyệt', type: 'main' });
	});

	const rejX = PAD + groupW + 40;
	const rejY = PAD + NODE_H + GAP_Y + 4;
	nodes.push({ id: 'rejected', x: rejX, y: rejY, w: BRANCH_NODE_W + 20, h: BRANCH_NODE_H, label: '1 từ chối = Kết thúc', type: 'rejected' });
	data.roles.forEach((_, i) => {
		edges.push({ from: `role_${i}`, to: 'rejected', type: 'reject' });
	});

	const totalW = rejX + BRANCH_NODE_W + 20 + PAD;
	const totalH = y + NODE_H + PAD;
	return { nodes, edges, width: totalW, height: totalH };
}

function buildVotingLayout(
	data: VotingData,
	roleLabels: Record<string, string>,
) {
	const nodes: NodeDef[] = [];
	const edges: EdgeDef[] = [];
	const mainX = PAD + GAP_X;

	let y = PAD;

	nodes.push({ id: 'start', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Nộp yêu cầu', sublabel: 'Nhân viên', type: 'start' });
	y += NODE_H + GAP_Y;

	nodes.push({ id: 'voting', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Bỏ phiếu', sublabel: roleLabels[data.voterRole] || data.voterRole, type: 'step' });
	edges.push({ from: 'start', to: 'voting', type: 'main' });

	const approvedLabel = `>= ${data.approveThreshold} đồng ý`;
	const rejectedLabel = data.rejectThreshold ? `>= ${data.rejectThreshold} từ chối` : 'Từ chối';

	y += NODE_H + GAP_Y;

	nodes.push({ id: 'approved', x: mainX - GAP_X, y, w: NODE_W, h: NODE_H, label: 'Phê duyệt', sublabel: approvedLabel, type: 'approved' });
	edges.push({ from: 'voting', to: 'approved', label: approvedLabel, type: 'main' });

	nodes.push({ id: 'rejected', x: mainX + GAP_X, y, w: NODE_W, h: NODE_H, label: 'Từ chối', sublabel: rejectedLabel, type: 'rejected' });
	edges.push({ from: 'voting', to: 'rejected', label: rejectedLabel, type: 'reject' });

	const totalW = mainX + GAP_X + NODE_W + PAD;
	const totalH = y + NODE_H + PAD;
	return { nodes, edges, width: totalW, height: totalH };
}

function buildMixedLayout(
	stages: MixedStage[],
	roleLabels: Record<string, string>,
) {
	const nodes: NodeDef[] = [];
	const edges: EdgeDef[] = [];
	const hasReturn = stages.some((s) => s.canReturn);
	const mainX = PAD + (hasReturn ? GAP_X : 0);
	const REJECT_GAP = 50;
	const REJECT_X = mainX + NODE_W + REJECT_GAP;

	let y = PAD;
	let maxRight = REJECT_X + BRANCH_NODE_W + PAD;
	let minLeft = 0;

	nodes.push({ id: 'start', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Nộp yêu cầu', sublabel: 'Nhân viên', type: 'start' });
	y += NODE_H + GAP_Y;

	let lastExitId = 'start';

	stages.forEach((stage, idx) => {
		const edgeLabel = lastExitId === 'start' ? '' : 'Duyệt';

		if (stage.type === 'sequential') {
			const id = `stage_${idx}`;
			const label = roleLabels[stage.role || 'MANAGER'] || stage.role || 'Duyệt';
			nodes.push({ id, x: mainX, y, w: NODE_W, h: NODE_H, label, sublabel: 'Duyệt tuần tự', type: 'step', stepNum: idx + 1 });
			edges.push({ from: lastExitId, to: id, label: edgeLabel, type: 'main' });

			// Reject: small dot marker on the right edge of the node, with a dashed line going right
			const rejId = `rej_${idx}`;
			nodes.push({ id: rejId, x: REJECT_X, y: y + 6, w: BRANCH_NODE_W, h: BRANCH_NODE_H, label: 'Từ chối', type: 'rejected' });
			edges.push({ from: id, to: rejId, type: 'reject' });

			if (stage.canReturn) {
				const retId = `ret_${idx}`;
				const retX = mainX - GAP_X;
				nodes.push({ id: retId, x: retX, y: y + 6, w: BRANCH_NODE_W, h: BRANCH_NODE_H, label: 'Trả lại', type: 'returned' });
				edges.push({ from: id, to: retId, type: 'return' });
				minLeft = Math.min(minLeft, retX);
			}

			lastExitId = id;
			y += NODE_H + GAP_Y;

		} else if (stage.type === 'parallel') {
			const roles = stage.parallelRoles || ['MANAGER', 'HR'];
			const colW = NODE_W + 30;
			const groupW = roles.length * colW;
			const groupStartX = mainX + NODE_W / 2 - groupW / 2;

			roles.forEach((role, ri) => {
				const rid = `stage_${idx}_p${ri}`;
				const rx = groupStartX + ri * colW + (colW - NODE_W) / 2;
				nodes.push({ id: rid, x: rx, y, w: NODE_W, h: NODE_H, label: roleLabels[role] || role, sublabel: 'Đồng thời', type: 'step', stepNum: idx + 1 });
				edges.push({ from: lastExitId, to: rid, label: ri === 0 ? edgeLabel : '', type: 'main' });
				maxRight = Math.max(maxRight, rx + NODE_W + 40 + BRANCH_NODE_W);
				minLeft = Math.min(minLeft, rx);
			});

			// Reject: any one rejects = all fail. Show edges from every parallel node.
			const lastPX = groupStartX + (roles.length - 1) * colW + (colW - NODE_W) / 2;
			const rejId = `rej_${idx}`;
			const parallelRejX = lastPX + NODE_W + REJECT_GAP;
			nodes.push({ id: rejId, x: parallelRejX, y: y + 6, w: BRANCH_NODE_W + 20, h: BRANCH_NODE_H, label: '1 từ chối = Kết thúc', type: 'rejected' });
			roles.forEach((_, ri) => {
				edges.push({ from: `stage_${idx}_p${ri}`, to: rejId, type: 'reject' });
			});
			maxRight = Math.max(maxRight, parallelRejX + BRANCH_NODE_W + 20);

			y += NODE_H + GAP_Y;

			// Join node
			const joinId = `stage_${idx}_join`;
			nodes.push({ id: joinId, x: mainX, y, w: NODE_W, h: 36, label: 'Gộp kết quả', type: 'step' });
			roles.forEach((_, ri) => {
				edges.push({ from: `stage_${idx}_p${ri}`, to: joinId, type: 'main' });
			});

			lastExitId = joinId;
			y += 36 + GAP_Y;

		} else if (stage.type === 'voting') {
			const id = `stage_${idx}`;
			const voterLabel = roleLabels[stage.voterRole || 'MANAGER'] || stage.voterRole || '';
			nodes.push({ id, x: mainX, y, w: NODE_W, h: NODE_H, label: `Bỏ phiếu`, sublabel: `${voterLabel} (>=${stage.approveThreshold || 2})`, type: 'step', stepNum: idx + 1 });
			edges.push({ from: lastExitId, to: id, label: edgeLabel, type: 'main' });

			const rejId = `rej_${idx}`;
			const rejLabel = stage.rejectThreshold ? `>=${stage.rejectThreshold} từ chối` : 'Từ chối';
			nodes.push({ id: rejId, x: REJECT_X, y: y + 6, w: BRANCH_NODE_W, h: BRANCH_NODE_H, label: rejLabel, type: 'rejected' });
			edges.push({ from: id, to: rejId, type: 'reject' });

			lastExitId = id;
			y += NODE_H + GAP_Y;
		}
	});

	// Final approved node
	nodes.push({ id: 'approved_final', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Phê duyệt', sublabel: 'Hoàn tất', type: 'approved' });
	edges.push({ from: lastExitId, to: 'approved_final', label: 'Duyệt', type: 'main' });

	// Shift everything right if any node went negative
	const shift = minLeft < PAD ? PAD - minLeft : 0;
	if (shift > 0) {
		nodes.forEach((n) => { n.x += shift; });
		maxRight += shift;
	}

	const totalW = maxRight + PAD;
	const totalH = y + NODE_H + PAD;
	return { nodes, edges, width: totalW, height: totalH };
}

const WorkflowTree: React.FC<WorkflowTreeProps> = ({
	mode = 'sequential',
	steps = [],
	parallelData,
	votingData,
	mixedStages,
	roleLabels = DEFAULT_ROLE_LABELS,
}) => {
	const layout = useMemo(() => {
		if (mode === 'mixed' && mixedStages && mixedStages.length > 0) {
			return buildMixedLayout(mixedStages, roleLabels);
		}
		if (mode === 'parallel' && parallelData) {
			return buildParallelLayout(parallelData, roleLabels);
		}
		if (mode === 'voting' && votingData) {
			return buildVotingLayout(votingData, roleLabels);
		}
		return buildSequentialLayout(steps, roleLabels);
	}, [mode, steps, parallelData, votingData, mixedStages, roleLabels]);

	const getPos = (id: string, pos: 'center' | 'top' | 'bottom' | 'left' | 'right') => {
		const n = layout.nodes.find((nd) => nd.id === id);
		if (!n) return { x: 0, y: 0 };
		switch (pos) {
			case 'center': return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
			case 'top': return { x: n.x + n.w / 2, y: n.y };
			case 'bottom': return { x: n.x + n.w / 2, y: n.y + n.h };
			case 'left': return { x: n.x, y: n.y + n.h / 2 };
			case 'right': return { x: n.x + n.w, y: n.y + n.h / 2 };
		}
	};

	const renderEdge = (edge: EdgeDef, idx: number) => {
		const fromNode = layout.nodes.find((n) => n.id === edge.from);
		const toNode = layout.nodes.find((n) => n.id === edge.to);
		if (!fromNode || !toNode) return null;

		// Reject edges: always go horizontally to the right
		if (edge.type === 'reject') {
			const fr = getPos(edge.from, 'right');
			const t = getPos(edge.to, 'left');
			const dx = t.x - fr.x;
			const cp = Math.max(dx * 0.4, 20);
			const d = `M ${fr.x} ${fr.y} C ${fr.x + cp} ${fr.y}, ${t.x - cp} ${t.y}, ${t.x} ${t.y}`;
			return <g key={`edge-${idx}`}><path d={d} className={styles.edgeReject} markerEnd="url(#arrowReject)" /></g>;
		}

		// Return edges: always go horizontally to the left
		if (edge.type === 'return') {
			const fr = getPos(edge.from, 'left');
			const t = getPos(edge.to, 'right');
			const dx = Math.abs(t.x - fr.x);
			const cp = Math.max(dx * 0.4, 20);
			const d = `M ${fr.x} ${fr.y} C ${fr.x - cp} ${fr.y}, ${t.x + cp} ${t.y}, ${t.x} ${t.y}`;
			return <g key={`edge-${idx}`}><path d={d} className={styles.edgeReturn} markerEnd="url(#arrowReturn)" /></g>;
		}

		// Main edges: vertical (top to bottom)
		const from = getPos(edge.from, 'bottom');
		const to = getPos(edge.to, 'top');
		const midY = (from.y + to.y) / 2;
		const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
		return (
			<g key={`edge-${idx}`}>
				<path d={d} className={styles.edgeMain} markerEnd="url(#arrowMain)" />
				{edge.label && (
					<text x={(from.x + to.x) / 2 + 12} y={midY} className={styles.edgeLabelMain}>{edge.label}</text>
				)}
			</g>
		);
	};

	const renderNode = (node: NodeDef) => {
		const cx = node.x + node.w / 2;
		const cy = node.y + node.h / 2;
		const textX = node.stepNum ? node.x + 40 : cx;
		const anchor = node.stepNum ? 'start' : 'middle' as const;

		return (
			<g key={node.id}>
				<rect x={node.x} y={node.y} width={node.w} height={node.h} rx={14} ry={14} className={`${styles.node} ${styles[node.type]}`} />
				{node.stepNum && (
					<>
						<circle cx={node.x + 20} cy={cy} r={12} className={styles.stepBadge} />
						<text x={node.x + 20} y={cy} dy="0.35em" className={styles.stepBadgeText} textAnchor="middle">{node.stepNum}</text>
					</>
				)}
				{node.sublabel ? (
					<>
						<text x={textX} y={cy - 7} dy="0.35em" className={`${styles.nodeLabel} ${styles[node.type]}`} textAnchor={anchor}>{node.label}</text>
						<text x={textX} y={cy + 9} dy="0.35em" className={styles.nodeSub} textAnchor={anchor}>{node.sublabel}</text>
					</>
				) : (
					<text x={textX} y={cy} dy="0.35em" className={`${styles.nodeLabel} ${styles[node.type]}`} textAnchor={anchor}>{node.label}</text>
				)}
			</g>
		);
	};

	// ---- Zoom & Pan ----
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

	// Native wheel listener with passive: false to allow preventDefault
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const onWheel = (e: WheelEvent) => {
			if (!focused) return;
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.08 : 0.08;
			setScale((s) => Math.min(2, Math.max(0.2, Math.round((s + delta) * 100) / 100)));
		};
		el.addEventListener('wheel', onWheel, { passive: false });
		return () => el.removeEventListener('wheel', onWheel);
	}, [focused]);

	// Click outside to unfocus
	useEffect(() => {
		if (!focused) return;
		const onClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setFocused(false);
			}
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, [focused]);

	// Auto-fit on mount / layout change
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const containerW = el.clientWidth;
		const containerH = Math.min(el.clientHeight || 500, 500);
		const fitScaleX = containerW / layout.width;
		const fitScaleY = containerH / layout.height;
		const fit = Math.min(fitScaleX, fitScaleY, 1);
		setScale(Math.round(fit * 100) / 100);
		setPan({ x: Math.max(0, (containerW - layout.width * fit) / 2), y: 0 });
	}, [layout.width, layout.height]);

	const [focused, setFocused] = useState(false);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.button !== 0) return;
		setDragging(true);
		dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
	}, [pan]);

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!dragging) return;
		setPan({
			x: dragStart.current.panX + (e.clientX - dragStart.current.x),
			y: dragStart.current.panY + (e.clientY - dragStart.current.y),
		});
	}, [dragging]);

	const handleMouseUp = useCallback(() => setDragging(false), []);

	const zoomIn = () => setScale((s) => Math.min(2, Math.round((s + 0.15) * 100) / 100));
	const zoomOut = () => setScale((s) => Math.max(0.2, Math.round((s - 0.15) * 100) / 100));
	const zoomFit = () => {
		const el = containerRef.current;
		if (!el) return;
		const fit = Math.min(el.clientWidth / layout.width, 500 / layout.height, 1);
		setScale(Math.round(fit * 100) / 100);
		setPan({ x: Math.max(0, (el.clientWidth - layout.width * fit) / 2), y: 0 });
	};

	return (
		<div
			ref={containerRef}
			className={`${styles.treeContainer} ${focused ? styles.focused : ''}`}
			onClick={() => setFocused(true)}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			style={{ height: Math.min(layout.height * scale + 20, 520) }}
		>
			<div
				className={styles.treeViewport}
				style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
			>
				<svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} className={styles.treeSvg}>
					<defs>
						<marker id="arrowMain" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
							<path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
						</marker>
						<marker id="arrowReject" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
							<path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
						</marker>
						<marker id="arrowReturn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
							<path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
						</marker>
					</defs>
					{layout.edges.map(renderEdge)}
					{layout.nodes.map(renderNode)}
				</svg>
			</div>

			{/* Zoom controls */}
			<div className={styles.zoomControls}>
				<button onClick={zoomOut} title="Thu nhỏ">-</button>
				<button onClick={zoomFit} title="Vừa màn hình">Fit</button>
				<button onClick={zoomIn} title="Phóng to">+</button>
			</div>
			<div className={styles.zoomLabel}>
			{Math.round(scale * 100)}%{focused ? ' · Scroll để zoom' : ' · Click để zoom'}
		</div>
		</div>
	);
};

export default WorkflowTree;
