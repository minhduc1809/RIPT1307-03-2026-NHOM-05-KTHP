import React, { useMemo } from 'react';
import styles from './index.less';

interface ApprovalStep {
	role: string;
	canReject: boolean;
	requireCommentOnReject: boolean;
	canReturn: boolean;
	requireCommentOnReturn: boolean;
}

interface WorkflowTreeProps {
	steps: ApprovalStep[];
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

const WorkflowTree: React.FC<WorkflowTreeProps> = ({ steps, roleLabels = DEFAULT_ROLE_LABELS }) => {
	const hasReject = steps.some((s) => s.canReject);
	const hasReturn = steps.some((s) => s.canReturn);

	const layout = useMemo(() => {
		const mainX = PAD + (hasReturn ? GAP_X : 0);
		const nodes: Array<{
			id: string;
			x: number;
			y: number;
			w: number;
			h: number;
			label: string;
			sublabel?: string;
			type: 'start' | 'step' | 'approved' | 'rejected' | 'returned';
			stepNum?: number;
		}> = [];
		const edges: Array<{
			from: string;
			to: string;
			label?: string;
			type: 'main' | 'reject' | 'return';
		}> = [];

		let y = PAD;

		// Start node
		nodes.push({ id: 'start', x: mainX, y, w: NODE_W, h: NODE_H, label: 'Nộp yêu cầu', sublabel: 'Nhân viên', type: 'start' });
		y += NODE_H + GAP_Y;

		// Step nodes
		steps.forEach((step, idx) => {
			const id = `step_${idx}`;
			nodes.push({
				id,
				x: mainX,
				y,
				w: NODE_W,
				h: NODE_H,
				label: roleLabels[step.role] || step.role,
				sublabel: 'Xem xét & quyết định',
				type: 'step',
				stepNum: idx + 1,
			});

			// Edge from previous
			const prevId = idx === 0 ? 'start' : `step_${idx - 1}`;
			edges.push({ from: prevId, to: id, label: idx === 0 ? '' : 'Duyệt', type: 'main' });

			// Reject branch
			if (step.canReject) {
				const rejId = `reject_${idx}`;
				nodes.push({
					id: rejId,
					x: mainX + GAP_X,
					y: y + 4,
					w: BRANCH_NODE_W,
					h: BRANCH_NODE_H,
					label: 'Từ chối',
					sublabel: step.requireCommentOnReject ? 'Cần ghi chú' : undefined,
					type: 'rejected',
				});
				edges.push({ from: id, to: rejId, label: 'Từ chối', type: 'reject' });
			}

			// Return branch
			if (step.canReturn) {
				const retId = `return_${idx}`;
				nodes.push({
					id: retId,
					x: mainX - GAP_X,
					y: y + 4,
					w: BRANCH_NODE_W,
					h: BRANCH_NODE_H,
					label: 'Trả lại',
					sublabel: step.requireCommentOnReturn ? 'Cần ghi chú' : undefined,
					type: 'returned',
				});
				edges.push({ from: id, to: retId, label: 'Trả lại', type: 'return' });
			}

			y += NODE_H + GAP_Y;
		});

		// Approved node
		nodes.push({
			id: 'approved',
			x: mainX,
			y,
			w: NODE_W,
			h: NODE_H,
			label: 'Phê duyệt',
			sublabel: 'Hoàn tất',
			type: 'approved',
		});
		edges.push({
			from: `step_${steps.length - 1}`,
			to: 'approved',
			label: 'Duyệt',
			type: 'main',
		});

		const totalW = mainX + NODE_W + (hasReject ? GAP_X + BRANCH_NODE_W : 0) + PAD;
		const totalH = y + NODE_H + PAD;

		return { nodes, edges, width: totalW, height: totalH };
	}, [steps, roleLabels, hasReject, hasReturn]);

	const getNodeCenter = (id: string) => {
		const n = layout.nodes.find((nd) => nd.id === id);
		if (!n) return { x: 0, y: 0 };
		return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
	};

	const getNodeBottom = (id: string) => {
		const n = layout.nodes.find((nd) => nd.id === id);
		if (!n) return { x: 0, y: 0 };
		return { x: n.x + n.w / 2, y: n.y + n.h };
	};

	const getNodeTop = (id: string) => {
		const n = layout.nodes.find((nd) => nd.id === id);
		if (!n) return { x: 0, y: 0 };
		return { x: n.x + n.w / 2, y: n.y };
	};

	const getNodeLeft = (id: string) => {
		const n = layout.nodes.find((nd) => nd.id === id);
		if (!n) return { x: 0, y: 0 };
		return { x: n.x, y: n.y + n.h / 2 };
	};

	const getNodeRight = (id: string) => {
		const n = layout.nodes.find((nd) => nd.id === id);
		if (!n) return { x: 0, y: 0 };
		return { x: n.x + n.w, y: n.y + n.h / 2 };
	};

	const renderEdge = (edge: typeof layout.edges[0], idx: number) => {
		if (edge.type === 'main') {
			const from = getNodeBottom(edge.from);
			const to = getNodeTop(edge.to);
			const midY = (from.y + to.y) / 2;
			const path = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
			return (
				<g key={`edge-${idx}`}>
					<path d={path} className={styles.edgeMain} markerEnd="url(#arrowMain)" />
					{edge.label && (
						<text x={(from.x + to.x) / 2 + 12} y={midY} className={styles.edgeLabelMain}>{edge.label}</text>
					)}
				</g>
			);
		}

		if (edge.type === 'reject') {
			const from = getNodeRight(edge.from);
			const to = getNodeLeft(edge.to);
			const midX = (from.x + to.x) / 2;
			const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
			return (
				<g key={`edge-${idx}`}>
					<path d={path} className={styles.edgeReject} markerEnd="url(#arrowReject)" />
				</g>
			);
		}

		if (edge.type === 'return') {
			const from = getNodeLeft(edge.from);
			const to = getNodeRight(edge.to);
			const midX = (from.x + to.x) / 2;
			const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
			return (
				<g key={`edge-${idx}`}>
					<path d={path} className={styles.edgeReturn} markerEnd="url(#arrowReturn)" />
				</g>
			);
		}

		return null;
	};

	const renderNode = (node: typeof layout.nodes[0]) => {
		const cx = node.x + node.w / 2;
		const cy = node.y + node.h / 2;
		const textX = node.stepNum ? node.x + 40 : cx;
		const anchor = node.stepNum ? 'start' : 'middle' as const;

		return (
			<g key={node.id}>
				<rect
					x={node.x}
					y={node.y}
					width={node.w}
					height={node.h}
					rx={14}
					ry={14}
					className={`${styles.node} ${styles[node.type]}`}
				/>
				{node.stepNum && (
					<>
						<circle cx={node.x + 20} cy={cy} r={12} className={styles.stepBadge} />
						<text x={node.x + 20} y={cy} dy="0.35em" className={styles.stepBadgeText} textAnchor="middle">
							{node.stepNum}
						</text>
					</>
				)}
				{node.sublabel ? (
					<>
						<text x={textX} y={cy - 7} dy="0.35em" className={`${styles.nodeLabel} ${styles[node.type]}`} textAnchor={anchor}>
							{node.label}
						</text>
						<text x={textX} y={cy + 9} dy="0.35em" className={styles.nodeSub} textAnchor={anchor}>
							{node.sublabel}
						</text>
					</>
				) : (
					<text x={textX} y={cy} dy="0.35em" className={`${styles.nodeLabel} ${styles[node.type]}`} textAnchor={anchor}>
						{node.label}
					</text>
				)}
			</g>
		);
	};

	return (
		<div className={styles.treeContainer}>
			<svg
				width={layout.width}
				height={layout.height}
				viewBox={`0 0 ${layout.width} ${layout.height}`}
				className={styles.treeSvg}
			>
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
