from flask import Flask, request, jsonify
from model import model_educational_admissions_consultant

app = Flask(__name__)
model = model_educational_admissions_consultant()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
    result = model.predict(text)
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
