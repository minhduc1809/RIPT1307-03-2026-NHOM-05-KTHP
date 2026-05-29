import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
	const onDragEnd = (result: any) => {
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
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId={droppableId}>
				{(droppableProvided) => (
					<div
						ref={droppableProvided.innerRef}
						{...droppableProvided.droppableProps}
					>
						{items.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{(draggableProvided, snapshot) => (
									<div
										ref={draggableProvided.innerRef}
										{...draggableProvided.draggableProps}
										className={snapshot.isDragging ? styles.dragging : ''}
										style={{
											...draggableProvided.draggableProps.style,
											marginBottom: 12,
										}}
									>
										<div className={styles.wrapper}>
											<div
												{...draggableProvided.dragHandleProps}
												className={styles.handle}
											>
												<MenuOutlined />
											</div>
											{renderItem(item, index)}
										</div>
									</div>
								)}
							</Draggable>
						))}
						{droppableProvided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default SortableList;
