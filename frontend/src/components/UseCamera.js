import React, { useState, useRef, useCallback } from 'react';
import ApiService from '../services/ApiService';
import './UseCamera.css';

const UseCamera = ({ onEmotionDetected, isLoading, setIsLoading }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      alert('Error accessing camera: ' + error.message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataURL);
    stopCamera();
  }, [stopCamera]);

  const detectEmotion = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    try {
      const response = await ApiService.detectEmotion(capturedImage);
      if (response.success) {
        onEmotionDetected(response.emotion, response.recommendations);
      } else {
        alert('Error: ' + response.error);
      }
    } catch (error) {
      alert('Failed to detect emotion: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="camera-container">
      <h2>Use Camera</h2>
      <p>Capture your photo for emotion detection</p>

      <div className="camera-area">
        {capturedImage ? (
          <div className="captured-photo">
            <img src={capturedImage} alt="Captured" />
            <div className="photo-actions">
              <button className="btn-secondary" onClick={retakePhoto}>
                Retake Photo
              </button>
              <button 
                className="btn-primary" 
                onClick={detectEmotion}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Detect Emotion'}
              </button>
            </div>
          </div>
        ) : (
          <div className="camera-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ display: isStreaming ? 'block' : 'none' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {!isStreaming && (
              <div className="camera-placeholder">
                <div className="camera-icon">📷</div>
                <p>Camera preview will appear here</p>
                <button className="btn-primary" onClick={startCamera}>
                  Start Camera
                </button>
              </div>
            )}

            {isStreaming && (
              <div className="camera-controls">
                <button className="btn-capture" onClick={capturePhoto}>
                  📷 Capture Photo
                </button>
                <button className="btn-secondary" onClick={stopCamera}>
                  Stop Camera
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UseCamera;