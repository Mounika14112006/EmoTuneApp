import React, { useState, useRef } from 'react';
import ApiService from '../services/ApiService';
import './UploadImage.css';

const UploadImage = ({ onEmotionDetected, isLoading, setIsLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
          dataURL: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const detectEmotion = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const response = await ApiService.detectEmotion(selectedImage.dataURL);
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

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Image</h2>
      <p>Choose a photo from your device</p>

      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {selectedImage ? (
          <div className="selected-image">
            <img src={selectedImage.preview} alt="Selected" />
            <div className="image-actions">
              <button className="btn-secondary" onClick={clearImage}>
                Change Image
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
          <div className="upload-placeholder">
            <div className="upload-icon">📤</div>
            <p>Click to upload or drag image here</p>
            <small>Supports JPG, PNG formats</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;