from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import random

app = Flask(__name__)
CORS(app)

CLASS_NAMES = ['Healthy', 'Red Spider Mite', 'Rust']
CLASS_NAMES_RW = ['Neza', 'Ubwukunzi', 'Isigiire']

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'mode': 'demo', 'classes': CLASS_NAMES})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' in request.files:
            file = request.files['image']
            img = Image.open(file.stream).convert('RGB')
        elif request.is_json:
            data = request.get_json()
            if 'image' in data:
                image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
                img = Image.open(BytesIO(base64.b64decode(image_data))).convert('RGB')
            else:
                return jsonify({'error': 'No image provided'}), 400
        
        predicted_idx = random.randint(0, 2)
        confidence = random.uniform(0.75, 0.98)
        
        diseases = [
            {'disease': 'Healthy', 'diseaseRw': 'Neza', 'severity': 'mild', 'area': 5},
            {'disease': 'Red Spider Mite', 'diseaseRw': 'Ubwukunzi', 'severity': 'moderate', 'area': 35},
            {'disease': 'Rust', 'diseaseRw': 'Isigiire', 'severity': 'severe', 'area': 60}
        ]
        
        d = diseases[predicted_idx]
        remaining = 1.0 - confidence
        
        return jsonify({
            'disease': d['disease'],
            'diseaseRw': d['diseaseRw'],
            'confidence': round(confidence, 4),
            'severity': d['severity'],
            'affectedArea': d['area'],
            'treatment': {
                'action': 'Apply treatment as needed',
                'actionRw': 'Kwinjiza inzira',
                'instructions': 'Follow instructions carefully',
                'instructionsRw': 'Suza amababi akenshi',
                'alternative': 'Alternative treatment available',
                'alternativeRw': 'Inzira ishya',
                'cost': 'Variable'
            },
            'allPredictions': {
                CLASS_NAMES[0]: round(remaining/2, 4) if predicted_idx != 0 else round(confidence, 4),
                CLASS_NAMES[1]: round(remaining/2, 4) if predicted_idx != 1 else round(confidence, 4),
                CLASS_NAMES[2]: round(remaining/2, 4) if predicted_idx != 2 else round(confidence, 4),
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/info', methods=['GET'])
def info():
    return jsonify({
        'model': 'Coffee Detector',
        'classes': CLASS_NAMES,
        'classes_rw': CLASS_NAMES_RW
    })

if __name__ == '__main__':
    print("✓ Coffee Guardian API - Demo Mode")
    print("✓ Running on http://localhost:5000")
    app.run(debug=False, port=5000, host='0.0.0.0')
