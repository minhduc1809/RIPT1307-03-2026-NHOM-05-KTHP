import React, { useMemo } from 'react';
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

interface WorkflowTreeProps {
	mode?: 'sequential' | 'parallel' | 'voting';
	steps?: ApprovalStep[];
	parallelData?: ParallelData;
	votingData?: VotingData;
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
	nodes.push({ id: 'rejected', x: rejX, y: rejY, w: BRANCH_NODE_W, h: BRANCH_NODE_H, label: 'Từ chối', type: 'rejected' });
	edges.push({ from: `role_0`, to: 'rejected', type: 'reject' });

	const totalW = rejX + BRANCH_NODE_W + PAD;
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

const WorkflowTree: React.FC<WorkflowTreeProps> = ({
	mode = 'sequential',
	steps = [],
	parallelData,
	votingData,
	roleLabels = DEFAULT_ROLE_LABELS,
}) => {
	const layout = useMemo(() => {
		if (mode === 'parallel' && parallelData) {
			return buildParallelLayout(parallelData, roleLabels);
		}
		if (mode === 'voting' && votingData) {
			return buildVotingLayout(votingData, roleLabels);
		}
		return buildSequentialLayout(steps, roleLabels);
	}, [mode, steps, parallelData, votingData, roleLabels]);

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
		const from = getPos(edge.from, 'bottom');
		const to = getPos(edge.to, 'top');

		const fromNode = layout.nodes.find((n) => n.id === edge.from);
		const toNode = layout.nodes.find((n) => n.id === edge.to);

		if (edge.type === 'reject' && fromNode && toNode && Math.abs(fromNode.y - toNode.y) < NODE_H + GAP_Y) {
			const fr = getPos(edge.from, 'right');
			const t = getPos(edge.to, 'left');
			const midX = (fr.x + t.x) / 2;
			const path = `M ${fr.x} ${fr.y} C ${midX} ${fr.y}, ${midX} ${t.y}, ${t.x} ${t.y}`;
			return <g key={`edge-${idx}`}><path d={path} className={styles.edgeReject} markerEnd="url(#arrowReject)" /></g>;
		}

		if (edge.type === 'return') {
			const fr = getPos(edge.from, 'left');
			const t = getPos(edge.to, 'right');
			const midX = (fr.x + t.x) / 2;
			const path = `M ${fr.x} ${fr.y} C ${midX} ${fr.y}, ${midX} ${t.y}, ${t.x} ${t.y}`;
			return <g key={`edge-${idx}`}><path d={path} className={styles.edgeReturn} markerEnd="url(#arrowReturn)" /></g>;
		}

		const midY = (from.y + to.y) / 2;
		const path = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
		const edgeClass = edge.type === 'reject' ? styles.edgeReject : styles.edgeMain;
		const marker = edge.type === 'reject' ? 'url(#arrowReject)' : 'url(#arrowMain)';
		return (
			<g key={`edge-${idx}`}>
				<path d={path} className={edgeClass} markerEnd={marker} />
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

	return (
		<div className={styles.treeContainer}>
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
	);
};

export default WorkflowTree;
