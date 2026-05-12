import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div style={{ padding: 24 }}>
            <h2>Dashboard</h2>
            <p>Table request</p>
            <p>Filter: status, createdBy</p>
            <iframe width="1184" height="675" src="https://datastudio.google.com/embed/reporting/43d3038c-6034-411f-a8e9-81c4ecb0bbb7/page/page_12345" frameBorder="0" allowFullScreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
        </div>
    );
};

export default Dashboard;
