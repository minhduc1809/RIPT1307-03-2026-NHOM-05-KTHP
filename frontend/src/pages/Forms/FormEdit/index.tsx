// design: smartadmin.pen · frame 05b — dùng chung Builder, chỉ truyền editId từ route
import React from 'react';
import { useParams } from 'umi';
import FormBuilder from '../Builder';

const FormEdit: React.FC = () => {
	const { formId } = useParams<{ formId: string }>();
	return <FormBuilder editId={formId} />;
};

export default FormEdit;
