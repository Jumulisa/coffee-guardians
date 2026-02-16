# Coffee Guardian Backend API

Flask REST API for the Coffee Guardian AI disease detection system. This API loads a trained MobileNetV2 model and provides disease prediction for coffee leaf images.

## Features

- **Disease Detection**: Identifies coffee diseases (Healthy, Red Spider Mite, Rust)
- **Confidence Scoring**: Returns confidence scores for predictions
- **Severity Classification**: Automatically classifies disease severity
- **Bilingual Support**: Provides disease names and treatment in English and Kinyarwanda
- **CORS Enabled**: Works with frontend running on different port

## Architecture

- **Model**: MobileNetV2 + Custom Classification Head
- **Input**: 224x224x3 RGB images
- **Classes**: 3 (Healthy, Red Spider Mite, Rust)
- **Framework**: TensorFlow/Keras

## Installation

### 1. Install Python Requirements

```bash
cd backend
pip install -r requirements.txt
```

### 2. Ensure Model File Exists

Make sure `coffee_disease_model.h5` is in the `backend/` directory.

```bash
ls -lh backend/coffee_disease_model.h5
```

## Running the API

```bash
cd backend
python app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### POST `/predict`
Predict disease from an image.

**Request (multipart/form-data):**
```bash
curl -X POST -F "image=@leaf.jpg" http://localhost:5000/predict
```

**Request (JSON with base64):**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}' \
  http://localhost:5000/predict
```

**Response:**
```json
{
  "disease": "Rust",
  "diseaseRw": "Isigiire",
  "confidence": 0.95,
  "severity": "severe",
  "affectedArea": 65,
  "treatment": {
    "action": "Apply fungicide spray immediately...",
    "actionRw": "Kwinjiza inzira...",
    "instructions": "1. Apply copper fungicide...",
    "instructionsRw": "1. Kwinjiza inzira...",
    "alternative": "Combine with systemic fungicide...",
    "alternativeRw": "Kupirakira...",
    "cost": "$15-30"
  },
  "allPredictions": {
    "Healthy": 0.02,
    "Red Spider Mite": 0.03,
    "Rust": 0.95
  }
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "classes": ["Healthy", "Red Spider Mite", "Rust"]
}
```

### GET `/info`
Get model information.

**Response:**
```json
{
  "model": "MobileNetV2 + Custom Head",
  "input_size": "224x224x3",
  "classes": ["Healthy", "Red Spider Mite", "Rust"],
  "classes_rw": ["Neza", "Ubwukunzi", "Isigiire"],
  "severity_thresholds": {
    "mild": "< 25% leaf area affected",
    "moderate": "25-50% leaf area affected",
    "severe": "> 50% leaf area affected"
  }
}
```

## Severity Classification

- **Mild** (~5% affected): Healthy or early stage infection
- **Moderate** (25-50% affected): Active infection requiring treatment
- **Severe** (>50% affected): Advanced infection requiring urgent action

## Environment Variables

Create a `.env` file in the backend directory (optional):

```env
FLASK_PORT=5000
FLASK_ENV=production
```

## Production Deployment

For production, use a proper WSGI server:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Or with Docker:

```bash
docker build -t coffee-guardian-api .
docker run -p 5000:5000 coffee-guardian-api
```

## Troubleshooting

### Model fails to load
- Ensure `coffee_disease_model.h5` is in the `backend/` directory
- Check TensorFlow/Keras version compatibility
- Verify model was saved with supported format

### Predictions are slow
- First prediction is slower (model warming up)
- Consider using GPU: `pip install tensorflow-gpu`
- In production, use async workers with Gunicorn

### CORS errors in browser
- Backend CORS is enabled for all origins
- If issues persist, check Flask-CORS configuration in `app.py`

## Development

### Running with debug mode
```bash
python app.py  # debug=True is set by default
```

### Testing the API
```bash
# Test predict endpoint with your image
curl -X POST -F "image=@path/to/leaf.jpg" http://localhost:5000/predict

# Test health endpoint
curl http://localhost:5000/health
```

## Performance Notes

- Model size: ~23 MB
- Input processing: <100ms per image
- Prediction time: 200-500ms depending on hardware
- Total API response: ~500-1000ms including I/O

## Frontend Integration

The frontend communicates with this API via `src/lib/ml-service.ts`. 

Configure the API URL in frontend:
```env
REACT_APP_API_URL=http://localhost:5000
```

For production, update based on your deployment URL.
