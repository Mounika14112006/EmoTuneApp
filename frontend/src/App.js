import React, { useState } from 'react';
import LoginSignupPage from './components/LoginSignupPage';
import Sidebar from './components/Sidebar';
import UploadImage from './components/UploadImage';
import UseCamera from './components/UseCamera';
import SongsList from './components/SongsList';
import Profile from './components/Profile';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentView, setCurrentView] = useState('upload');
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add login history to user on each login
  const updateLoginHistory = (u) => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const loginRecord = { date, time, method: 'Web' };
    return {
      ...u,
      loginHistory: u.loginHistory ? [loginRecord, ...u.loginHistory] : [loginRecord]
    };
  };

  const handleLogin = (userInfo) => {
    const updatedUser = updateLoginHistory(userInfo);
    setUser(updatedUser);
    setUsers(prevUsers => {
      const others = prevUsers.filter(u => u.email !== userInfo.email);
      return [updatedUser, ...others];
    });
  };

  const addUser = (newUser) => {
    newUser.loginHistory = [];
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('upload');
    setDetectedEmotion(null);
    setRecommendations([]);
  };

  const handleEmotionDetected = (emotion, recs) => {
    setDetectedEmotion(emotion);
    setRecommendations(recs);
    setCurrentView('songs');
  };

  if (!user) {
    return (
      <LoginSignupPage 
        onLogin={handleLogin} 
        users={users} 
        addUser={addUser}
      />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chatbot':
        return <Chatbot />;
      case 'upload':
        return (
          <UploadImage
            onEmotionDetected={handleEmotionDetected}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 'camera':
        return (
          <UseCamera
            onEmotionDetected={handleEmotionDetected}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 'songs':
        return <SongsList emotion={detectedEmotion} recommendations={recommendations} />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} />;
      default:
        return (
          <UploadImage
            onEmotionDetected={handleEmotionDetected}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      <div className="main-content">
        <header className="app-header">
          <h1>🎵 Emotune</h1>
          <p>Emotion-Based Music Recommendation</p>
        </header>
        <main className="app-main">{renderCurrentView()}</main>
        <footer className="app-footer">
          <p>© 2025 Emotune</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
