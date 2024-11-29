from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
from underthesea import word_tokenize

app = Flask(__name__)

# Tải mô hình và tokenizer
model = tf.keras.models.load_model("sentiment_model_vietnamese.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Tiền xử lý văn bản tiếng Việt
    text = word_tokenize(text, format="text")
    text = text.lower()
    sequence = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequence, maxlen=10)

    # Dự đoán
    prediction = model.predict(padded_sequence)
    sentiment = "positive" if prediction[0][0] > 0.5 else "negative"

    return jsonify({"sentiment": sentiment, "score": float(prediction[0][0])})

if __name__ == "__main__":
    app.run(debug=True, port=5000)


predict