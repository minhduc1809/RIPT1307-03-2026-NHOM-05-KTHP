import React from 'react';
import { useParams } from 'umi';

const FormDetail: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();

    return (
        <div style={{ padding: 24 }}>
            <h2>Điền Form ID: {formId}</h2>
            <p>Render dynamic fields từ cấu hình form</p>
            <p>Submit form data</p>
        </div>
    );
};

export default FormDetail;
