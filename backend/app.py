from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Model configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'coffee_disease_model.h5')
INPUT_SIZE = 224
CLASS_NAMES = ['Healthy', 'Red Spider Mite', 'Rust']
CLASS_NAMES_RW = ['Neza', 'Ubwukunzi', 'Isigiire']

# Severity mapping (confidence-based)
def get_severity(class_name, confidence):
    """Map class to severity level"""
    if class_name == 'Healthy':
        return 'mild'
    elif class_name == 'Red Spider Mite':
        return 'moderate' if confidence > 0.6 else 'mild'
    else:  # Rust
        return 'severe' if confidence > 0.7 else 'moderate'

def get_affected_area(class_name, confidence):
    """Estimate affected leaf area"""
    if class_name == 'Healthy':
        return 5
    elif class_name == 'Red Spider Mite':
        return int(30 + (confidence * 20))
    else:  # Rust
        return int(40 + (confidence * 30))

try:
    # Load model at startup
    model = load_model(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'classes': CLASS_NAMES
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease from image
    Expected: multipart/form-data with 'image' field or JSON with 'image' (base64)
    """
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        # Handle both file upload and base64
        if 'image' in request.files:
            file = request.files['image']
            img = Image.open(file.stream).convert('RGB')
        elif request.is_json:
            data = request.get_json()
            if 'image' in data:
                # Handle base64 image
                image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
                img = Image.open(BytesIO(base64.b64decode(image_data))).convert('RGB')
            else:
                return jsonify({'error': 'No image provided'}), 400
        else:
            return jsonify({'error': 'No image data in request'}), 400

        # Preprocess image
        img = img.resize((INPUT_SIZE, INPUT_SIZE))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        confidence_scores = predictions[0]
        predicted_class_idx = np.argmax(confidence_scores)
        confidence = float(confidence_scores[predicted_class_idx])

        # Get class names
        predicted_class = CLASS_NAMES[predicted_class_idx]
        predicted_class_rw = CLASS_NAMES_RW[predicted_class_idx]

        # Calculate severity and affected area
        severity = get_severity(predicted_class, confidence)
        affected_area = get_affected_area(predicted_class, confidence)

        # Get treatment info
        treatments = {
            'Healthy': {
                'action': 'Continue regular monitoring and maintenance',
                'actionRw': 'Komeza gukurikirana n\'kubungabunga',
                'instructions': 'Monitor leaves regularly.\nMaintain proper pruning.\nEnsure good sunlight exposure.\nKeep soil moisture balanced.',
                'instructionsRw': 'Suza amababi akenshi.\nMenye ubwoko bw\'imirire.\nNigukora umuriro mwiza.\nGwiza amazi neza.',
                'alternative': 'Apply preventive fungicides monthly',
                'alternativeRw': 'Kwinjiza inzira y\'urugo vuba',
                'cost': 'Low'
            },
            'Red Spider Mite': {
                'action': 'Apply acaricide spray immediately',
                'actionRw': 'Kwinjiza inzira y\'urugo vuba',
                'instructions': 'Spray with acaricide (e.g., neem oil).\nRepeat every 7-10 days.\nTarget both leaf surfaces.\nEnsure good spray coverage.',
                'instructionsRw': '1. Kwinjiza inzira y\'urugo\n2. Gusuza mu minsi 7-10\n3. Kwinjiza ibakiro bya kabukiriro\n4. Gumenya umuriro mwiza',
                'alternative': 'Introduce natural predators like ladybugs',
                'alternativeRw': 'Shakira ibinyabupfu bishya',
                'cost': '$10-20'
            },
            'Rust': {
                'action': 'Apply fungicide spray immediately - urgent treatment required',
                'actionRw': 'Kwinjiza inzira y\'urugo vuba - ikintu cyiza',
                'instructions': 'Apply copper fungicide immediately.\nRepeat every 5-7 days.\nRemove severely affected leaves.\nImprove air circulation.\nAvoid leaf wetting.',
                'instructionsRw': '1. Kwinjiza inzira y\'urugo vuba\n2. Gusuza mu minsi 5-7\n3. Kuvanisha amababi ahagarikitswe\n4. Kwiheza umwungeri\n5. Gatanga urutihe y\'amazi',
                'alternative': 'Combine with systemic fungicide for internal infection control',
                'alternativeRw': 'Kupirakira n\'inzira y\'urugo ishya',
                'cost': '$15-30'
            }
        }

        treatment = treatments.get(predicted_class, treatments['Healthy'])

        # Build response
        response = {
            'disease': predicted_class,
            'diseaseRw': predicted_class_rw,
            'confidence': confidence,
            'severity': severity,
            'affectedArea': affected_area,
            'treatment': {
                'action': treatment['action'],
                'actionRw': treatment['actionRw'],
                'instructions': treatment['instructions'],
                'instructionsRw': treatment['instructionsRw'],
                'alternative': treatment['alternative'],
                'alternativeRw': treatment['alternativeRw'],
                'cost': treatment['cost']
            },
            'allPredictions': {
                CLASS_NAMES[i]: float(confidence_scores[i]) 
                for i in range(len(CLASS_NAMES))
            }
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/info', methods=['GET'])
def info():
    """Get model information"""
    return jsonify({
        'model': 'MobileNetV2 + Custom Head',
        'input_size': f'{INPUT_SIZE}x{INPUT_SIZE}x3',
        'classes': CLASS_NAMES,
        'classes_rw': CLASS_NAMES_RW,
        'severity_thresholds': {
            'mild': '< 25% leaf area affected',
            'moderate': '25-50% leaf area affected',
            'severe': '> 50% leaf area affected'
        }
    })

if __name__ == '__main__':
    print("Starting Coffee Guardian API...")
    print(f"Model: MobileNetV2 + Custom Head")
    print(f"Input: {INPUT_SIZE}x{INPUT_SIZE} RGB")
    print(f"Classes: {', '.join(CLASS_NAMES)}")
    app.run(debug=True, port=5000, host='0.0.0.0')
