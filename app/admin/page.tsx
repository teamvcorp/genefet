'use client';
import React, { useEffect, useState } from 'react';

const checkAdminStatus = async (): Promise<boolean> => {
    // Replace with your actual admin status check logic (API call, etc.)
    // For demo, always returns true after 500ms
    return new Promise((resolve) => setTimeout(() => resolve(false), 500));
};

const AdminPage: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        checkAdminStatus().then(setIsAdmin);
    }, []);

    if (isAdmin === null) {
        return <div>Checking admin status...</div>;
    }

    if (!isAdmin) {
        return <div>Access denied. You are not an admin.</div>;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome, admin!</p>
        </div>
    );
};

export default AdminPage;