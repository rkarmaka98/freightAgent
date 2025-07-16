import React from 'react';
import Sidebar from './Sidebar';

// Layout component placing sidebar next to main content
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout"> {/* layout wrapper */}
      <Sidebar />
      <main className="content">{/* main content container */}
        {children}
      </main>
    </div>
  );
}
