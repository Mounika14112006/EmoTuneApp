# Emotune Setup Instructions

## Required Changes After Download

### 1. Add Your Trained Model
- Place your `emotion_model.keras` file in the `backend/model/` directory
- The model should be trained for 7 emotions: ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Surprised']
- Input shape should be (48, 48, 1) - 48x48 grayscale images

### 2. Configure Spotify API
1. Go to https://developer.spotify.com/dashboard/
2. Create a new app
3. Copy your Client ID and Client Secret
4. Update the environment variables:

**Windows:**
```cmd
set SPOTIFY_CLIENT_ID=your_actual_client_id
set SPOTIFY_CLIENT_SECRET=your_actual_client_secret
```

**macOS/Linux:**
```bash
export SPOTIFY_CLIENT_ID=your_actual_client_id
export SPOTIFY_CLIENT_SECRET=your_actual_client_secret
```

**Alternative:** Edit `backend/app.py` lines 12-13:
```python
SPOTIFY_CLIENT_ID = 'your_actual_client_id'
SPOTIFY_CLIENT_SECRET = 'your_actual_client_secret'
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### 5. Test with Postman

Use these URLs to test your API:
- Health: `GET http://localhost:5000/health`
- Emotion Detection: `POST http://localhost:5000/detect-emotion`
- Recommendations: `GET http://localhost:5000/get-recommendations/Happy`

### 6. Access the Application

Open your browser and go to `http://localhost:3000`

## What's Included

✅ Complete React frontend with modern UI
✅ Flask backend with your emotion detection API
✅ Spotify music recommendation integration
✅ Image upload and camera capture
✅ Responsive design with beautiful gradients
✅ Error handling and loading states
✅ Profile and chat components
✅ Complete API service layer

## Next Steps

1. Add your model file
2. Configure Spotify credentials
3. Install dependencies
4. Run both servers
5. Test the complete application

Your Emotune application will be fully functional!
