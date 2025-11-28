import React from 'react';
import './SongsList.css';

const SongsList = ({ emotion, recommendations }) => {
  const openSpotify = (url) => {
    window.open(url, '_blank');
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="songs-container">
      <div className="songs-header">
        <h2>🎵 Recommended Songs</h2>
        {emotion && (
          <p className="detected-emotion">
            Detected Emotion: <span className="emotion-tag">{emotion}</span>
          </p>
        )}
      </div>

      {recommendations && recommendations.length > 0 ? (
        <div className="songs-grid">
          {recommendations.map((song, index) => (
            <div key={song.id || index} className="song-card">
              <div className="song-image">
                {song.image ? (
                  <img src={song.image} alt={song.name} />
                ) : (
                  <div className="song-placeholder">🎵</div>
                )}
              </div>

              <div className="song-info">
                <h3 className="song-title">{song.name}</h3>
                <p className="song-artist">{song.artist}</p>
                <p className="song-album">{song.album}</p>
                {song.duration_ms && (
                  <p className="song-duration">{formatDuration(song.duration_ms)}</p>
                )}
              </div>

              <div className="song-actions">
                {song.preview_url && (
                  <button 
                    className="btn-preview"
                    onClick={() => {
                      const audio = new Audio(song.preview_url);
                      audio.play();
                    }}
                  >
                    ▶️ Preview
                  </button>
                )}
                <button 
                  className="btn-spotify"
                  onClick={() => openSpotify(song.external_url)}
                >
                  🎵 Spotify
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-songs">
          <p>No recommendations available. Try detecting an emotion first!</p>
        </div>
      )}
    </div>
  );
};

export default SongsList;