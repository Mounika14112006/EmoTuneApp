import os
import base64
import io
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
from tensorflow.keras.models import load_model
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID', '87d7ba8336f340aab3e98bf04ef47abb')
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET', 'b974daea75bd440ea6504a41f5b03578')
MODEL_PATH = os.path.join("model", "emotion_model.keras")

# Global variables
model = None
emotion_labels = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Surprised']

def load_emotion_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH)
            print("✅ Emotion detection model loaded successfully!")
        else:
            print("⚠️ Model file not found at:", MODEL_PATH)
            model = None
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        model = None

# Load model on startup
load_emotion_model()

def preprocess_image(image):
    try:
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        else:
            gray = image

        # Face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return None, "No face detected in the image"

        # Use the first detected face
        (x, y, w, h) = faces[0]
        face = gray[y:y+h, x:x+w]

        # Resize and normalize
        face_resized = cv2.resize(face, (48, 48))
        face_normalized = face_resized / 255.0
        face_input = face_normalized.reshape(1, 48, 48, 1)

        return face_input, None
    except Exception as e:
        return None, f"Error preprocessing image: {str(e)}"

def get_spotify_access_token():
    try:
        auth_url = "https://accounts.spotify.com/api/token"
        auth_data = {
            'grant_type': 'client_credentials',
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET
        }
        response = requests.post(auth_url, data=auth_data)
        if response.status_code == 200:
            return response.json()['access_token']
        else:
            print(f"Failed to get Spotify access token: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error getting Spotify access token: {str(e)}")
        return None

def search_spotify_music(emotion, limit=10):
    try:
        access_token = get_spotify_access_token()
        if not access_token:
            return []

        emotion_queries = {
            'Happy': 'happy upbeat energetic pop dance',
            'Sad': 'sad melancholy acoustic slow ballad',
            'Angry': 'rock metal aggressive intense',
            'Surprised': 'electronic uplifting dance energetic',
            'Neutral': 'chill relaxing ambient indie',
            'Fearful': 'calming soothing gentle soft',
            'Disgusted': 'alternative indie fresh clean'
        }

        query = emotion_queries.get(emotion, 'popular music')
        search_url = "https://api.spotify.com/v1/search"
        headers = {'Authorization': f'Bearer {access_token}'}
        params = {
            'q': query,
            'type': 'track',
            'limit': limit,
            'market': 'US'
        }

        response = requests.get(search_url, headers=headers, params=params)

        if response.status_code == 200:
            tracks = response.json().get('tracks', {}).get('items', [])
            recommendations = []

            for track in tracks:
                recommendation = {
                    'id': track['id'],
                    'name': track['name'],
                    'artist': ', '.join([artist['name'] for artist in track['artists']]),
                    'album': track['album']['name'],
                    'image': track['album']['images'][0]['url'] if track['album']['images'] else '',
                    'preview_url': track['preview_url'],
                    'external_url': track['external_urls']['spotify'],
                    'duration_ms': track['duration_ms']
                }
                recommendations.append(recommendation)

            return recommendations
        else:
            print(f"Spotify API error: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error searching Spotify: {str(e)}")
        return []

@app.route('/')
def index():
    return jsonify({
        "message": "Emotune Backend API",
        "version": "1.0.0",
        "endpoints": {
            "/detect-emotion": "POST - Detect emotion from uploaded image",
            "/get-recommendations/<emotion>": "GET - Get music recommendations for emotion",
            "/health": "GET - Check API health"
        }
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None,
        "spotify_configured": bool(SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET)
    })

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    try:
        if not model:
            return jsonify({
                'error': 'Emotion detection model not loaded. Please check your model file.',
                'success': False
            }), 500

        data = request.json
        if not data or 'image' not in data:
            return jsonify({
                'error': 'No image data provided',
                'success': False
            }), 400

        image_data = data['image']

        # Handle data URL format
        if 'data:image' in image_data:
            image_data = image_data.split(',')[1]

        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)

        # Preprocess image
        processed_image, error = preprocess_image(image_array)
        if error:
            return jsonify({
                'error': error,
                'success': False
            }), 400

        # Make prediction
        prediction = model.predict(processed_image)
        emotion_index = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0]))
        emotion = emotion_labels[emotion_index]

        # Get music recommendations
        recommendations = search_spotify_music(emotion)

        return jsonify({
            'success': True,
            'emotion': emotion,
            'confidence': round(confidence * 100, 2),
            'all_predictions': {
                emotion_labels[i]: round(float(prediction[0][i]) * 100, 2)
                for i in range(len(emotion_labels))
            },
            'recommendations': recommendations[:6],
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({
            'error': f'Error processing request: {str(e)}',
            'success': False
        }), 500

@app.route('/get-recommendations/<emotion>')
def get_recommendations(emotion):
    try:
        if emotion not in emotion_labels:
            return jsonify({
                'error': f'Invalid emotion. Valid emotions: {emotion_labels}',
                'success': False
            }), 400

        recommendations = search_spotify_music(emotion)

        return jsonify({
            'success': True,
            'emotion': emotion,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({
            'error': f'Error getting recommendations: {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
