from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Coffee Guardian API', 'status': 'running', 'endpoints': ['/health', '/predict', '/info']})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'demo'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        idx = random.randint(0, 2)
        diseases = ['Healthy', 'Red Spider Mite', 'Rust']
        rw = ['Neza', 'Ubwukunzi', 'Isigiire']
        
        conf = round(random.uniform(0.75, 0.98), 4)
        
        return jsonify({
            'disease': diseases[idx],
            'diseaseRw': rw[idx],
            'confidence': conf,
            'severity': ['mild', 'moderate', 'severe'][idx],
            'affectedArea': [5, 35, 60][idx],
            'treatment': {
                'action': 'Apply appropriate treatment',
                'actionRw': 'Kwinjiza inzira y\'urugo',
                'instructions': 'Follow treatment guidelines',
                'instructionsRw': 'Suza amababi akenshi',
                'alternative': 'Alternative available',
                'alternativeRw': 'Inzira ishya',
                'cost': '$0-30'
            },
            'allPredictions': {diseases[i]: round((1.0-conf)/2 if i != idx else conf, 4) for i in range(3)}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/info', methods=['GET'])
def info():
    return jsonify({'model': 'Coffee Detector', 'classes': ['Healthy', 'Red Spider Mite', 'Rust']})

if __name__ == '__main__':
    print("✓ Coffee Guardian API running on http://localhost:5000")
    app.run(debug=False, port=5000, host='0.0.0.0', threaded=True)
