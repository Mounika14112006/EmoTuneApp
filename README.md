# Emotune - Emotion-Based Music Recommendation System

A full-stack web application that detects emotions from facial expressions and recommends music based on the detected emotion using Spotify API.

## Features

- **Emotion Detection**: Upload images or use live camera to detect facial emotions
- **Music Recommendations**: Get personalized music recommendations based on detected emotions
- **Modern UI**: Beautiful, responsive React frontend with gradient designs
- **Real-time Processing**: Fast emotion detection using TensorFlow/Keras model
- **Spotify Integration**: Direct integration with Spotify Web API for music recommendations

## Tech Stack

### Backend
- Python Flask
- TensorFlow/Keras for emotion detection
- OpenCV for image processing
- Spotify Web API integration
- CORS enabled for frontend communication

### Frontend
- React.js with modern hooks
- CSS3 with gradients and animations
- Responsive design
- File upload and camera capture
- REST API integration

## Project Structure

```
emotune/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── model/
│   │   └── emotion_model.keras # Your trained emotion detection model
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/         # React components
    │   ├── services/          # API service layer
    │   ├── App.js            # Main App component
    │   └── index.js          # React entry point
    └── package.json          # Node.js dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Spotify Developer Account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. **IMPORTANT**: Place your trained `emotion_model.keras` file in the `backend/model/` directory

5. Set up environment variables for Spotify API:
```bash
# Windows
set SPOTIFY_CLIENT_ID=your_client_id_here
set SPOTIFY_CLIENT_SECRET=your_client_secret_here

# macOS/Linux
export SPOTIFY_CLIENT_ID=your_client_id_here
export SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

6. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Health Check
- **URL**: `GET /health`
- **Description**: Check if the API and model are loaded
- **Response**: Health status and configuration info

### Detect Emotion
- **URL**: `POST /detect-emotion`
- **Description**: Detect emotion from uploaded image
- **Request Body**:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```
- **Response**:
```json
{
  "success": true,
  "emotion": "Happy",
  "confidence": 87.3,
  "all_predictions": {
    "Angry": 2.1,
    "Happy": 87.3,
    ...
  },
  "recommendations": [...],
  "timestamp": "2025-10-15T12:00:00"
}
```

### Get Recommendations
- **URL**: `GET /get-recommendations/{emotion}`
- **Description**: Get music recommendations for specific emotion
- **Valid Emotions**: Angry, Disgusted, Fearful, Happy, Neutral, Sad, Surprised
- **Response**: List of recommended tracks from Spotify

## Postman Testing

### 1. Health Check
```
GET http://localhost:5000/health
```

### 2. Detect Emotion
```
POST http://localhost:5000/detect-emotion
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,YOUR_BASE64_IMAGE_STRING_HERE"
}
```

### 3. Get Recommendations
```
GET http://localhost:5000/get-recommendations/Happy
```

## Configuration Changes Needed

### 1. Spotify API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new app
3. Get your Client ID and Client Secret
4. Set environment variables or update the code with your credentials

### 2. Model File
- Place your trained `emotion_model.keras` file in `backend/model/`
- Ensure the model expects 48x48 grayscale images
- Verify emotion labels match: ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Surprised']

### 3. Production Deployment
- Update `frontend/src/services/ApiService.js` with your production backend URL
- Configure CORS settings in Flask for production domain
- Set up proper environment variables on your hosting platform

## Troubleshooting

### Common Issues

1. **Model not loading**: Ensure `emotion_model.keras` is in the correct directory
2. **CORS errors**: Check that Flask-CORS is properly configured
3. **Camera not working**: Ensure HTTPS in production for camera access
4. **Spotify API errors**: Verify your credentials and API limits

### Debug Steps

1. Check backend logs for error messages
2. Use browser DevTools Network tab to inspect API calls
3. Test individual endpoints with Postman
4. Verify model file format and size

## License

This project is for educational purposes. Make sure to comply with Spotify's API terms of service.

## Support

If you encounter any issues, please check the troubleshooting section or review the code comments for additional guidance.
