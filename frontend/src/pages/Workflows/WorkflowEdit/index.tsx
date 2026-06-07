// design: smartadmin.pen · frame 07b — dùng chung Builder, chỉ truyền editId từ route
import React from 'react';
import { useParams } from 'umi';
import WorkflowBuilder from '../Builder';

const WorkflowEdit: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	return <WorkflowBuilder editId={id} />;
};

export default WorkflowEdit;
