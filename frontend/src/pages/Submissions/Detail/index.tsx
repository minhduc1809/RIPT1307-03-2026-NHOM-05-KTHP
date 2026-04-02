import React from 'react';
import { useParams } from 'umi';

const SubmissionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div style={{ padding: 24 }}>
            <h2>Chi tiết Yêu cầu ID: {id}</h2>
            <p>Hiển thị: form data, status, timeline</p>
            <hr />
            <h3>Action:</h3>
            <p>Nếu là approver: Approve / Reject (kèm reason)</p>
            <p>Nếu là owner + rejected: Edit + Resubmit</p>
        </div>
    );
};

export default SubmissionDetail;
