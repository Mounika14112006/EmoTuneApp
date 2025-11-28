import React from 'react';
import './Profile.css';

const Profile = ({ user, onLogout }) => {
  if (!user) return null;

  const {
    name,
    email,
    age,
    loginHistory = [],
    favoriteGenres = ['Pop', 'Rock', 'Electronic', 'Indie'],
    recentEmotions = ['Happy', 'Neutral', 'Sad', 'Surprised'],
    totalDetections = 47,
  } = user;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span role="img" aria-label="avatar">👤</span>
        </div>
        <div className="profile-info">
          <h2>Welcome, {name}</h2>
          <p>Email: {email}</p>
          <p>Age: {age}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Favorite Music Genres</h3>
          <div className="genres-list">
            {favoriteGenres.map((genre, i) => (
              <span key={i} className="genre-tag">{genre}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Recent Emotions Detected</h3>
          <div className="emotions-list">
            {recentEmotions.map((emotion, i) => (
              <span key={i} className="emotion-tag">{emotion}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Login History</h3>
          <div className="login-history">
            {loginHistory.length === 0 && <p>No login history available.</p>}
            {loginHistory.map((login, i) => (
              <div key={i} className="login-item">
                <div className="login-date">{login.date}</div>
                <div className="login-method">{login.method}</div>
                <div className="login-time">{login.time}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
