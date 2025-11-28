class ApiService {
  constructor() {
    if (window.location.hostname === "localhost") {
      // Local development: frontend and backend on same device
      this.baseURL = "http://localhost:5000";
    } else {
      // Production (when frontend is deployed)
      this.baseURL = "https://your-backend-domain.com";
    }
  }

  async detectEmotion(imageData) {
    try {
      const response = await fetch(`${this.baseURL}/detect-emotion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error detecting emotion:", error);
      throw new Error("Failed to connect to emotion detection service.");
    }
  }

  async getRecommendations(emotion) {
    try {
      const response = await fetch(`${this.baseURL}/get-recommendations/${emotion}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw new Error("Failed to get music recommendations.");
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "unhealthy", error: error.message };
    }
  }
}

export default new ApiService();