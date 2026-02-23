// Service to communicate with the backend ML model API
const API_BASE_URL = 'https://7860-m-s-1cth3lewvr2nf-a.us-central1-0.prod.colab.dev';

export interface BackendPrediction {
  disease: string;
  diseaseRw: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  affectedArea: number;
  treatment: {
    action: string;
    actionRw: string;
    instructions: string;
    instructionsRw: string;
    alternative: string;
    alternativeRw: string;
    cost: string;
  };
  allPredictions: {
    [key: string]: number;
  };
}

export const mlService = {
  /**
   * Send image to backend for disease prediction
   */
    async predictDisease(imageFile: File): Promise<BackendPrediction> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

        const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling ML API:', error);
      throw error;
    }
  },

    // Removed getModelInfo (not supported by Colab proxy)

    // Removed checkHealth (not supported by Colab proxy)
    async getDiseases() {
      try {
        const response = await fetch(`${API_BASE_URL}/diseases/`);
        if (!response.ok) throw new Error('Failed to get diseases');
        return await response.json();
      } catch (error) {
        console.error('Error getting diseases:', error);
        throw error;
      }
    },

  /**
   * Predict from base64 image string
   */
  async predictFromBase64(imageBase64: string): Promise<BackendPrediction> {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling ML API:', error);
      throw error;
    }
  },
};
