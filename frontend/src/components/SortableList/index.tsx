import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { MenuOutlined } from '@ant-design/icons';
import styles from './index.less';

interface SortableListProps {
	items: Array<{ id: string; [key: string]: any }>;
	droppableId?: string;
	onReorder: (items: any[]) => void;
	renderItem: (item: any, index: number) => React.ReactNode;
	emptyText?: string;
}

const SortableList: React.FC<SortableListProps> = ({
	items,
	droppableId = 'sortable-list',
	onReorder,
	renderItem,
	emptyText = 'Chưa có mục nào',
}) => {
	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		if (result.source.index === result.destination.index) return;

		const reordered = Array.from(items);
		const [moved] = reordered.splice(result.source.index, 1);
		reordered.splice(result.destination.index, 0, moved);
		onReorder(reordered);
	};

	if (items.length === 0) {
		return <div className={styles.empty}>{emptyText}</div>;
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId={droppableId}>
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps} className={styles.list}>
						{items.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{(dragProvided, snapshot) => (
									<div
										ref={dragProvided.innerRef}
										{...dragProvided.draggableProps}
										className={`${styles.item} ${snapshot.isDragging ? styles.dragging : ''}`}
									>
										<div {...dragProvided.dragHandleProps} className={styles.handle}>
											<MenuOutlined />
										</div>
										<div className={styles.content}>
											{renderItem(item, index)}
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default SortableList;
