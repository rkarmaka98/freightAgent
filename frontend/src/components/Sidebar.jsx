import React, { useState } from 'react';

// Collapsible sidebar with navigation links
export default function Sidebar() {
  // collapsed state toggles visibility of link list
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}> {/* sidebar wrapper */}
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
      {/* only show links when expanded */}
      {!collapsed && (
        <ul>
          <li><a href="#policies">Policies</a></li>
          <li><a href="#transactions">Transactions</a></li>
          <li><a href="#analytics">Analytics</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      )}
    </div>
  );
}
