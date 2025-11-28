import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'chatbot', label: 'Chatbot', icon: '💬' },
    { id: 'upload', label: 'Upload Image', icon: '📤' },
    { id: 'camera', label: 'Use Camera', icon: '📷' },
    { id: 'songs', label: 'Songs List', icon: '🎵' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>🎵 Emotune</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;