import pandas as pd
from keras.models import Sequential
from keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
from underthesea import word_tokenize

# Đọc dữ liệu từ file Excel
data = pd.read_excel("Book1.xlsx")

# Tách văn bản và nhãn
texts = data["text"].tolist()
labels = data["label"].tolist()

# Tiền xử lý: Tokenize và xử lý từ dừng
def preprocess(text):
    # Tokenize văn bản tiếng Việt bằng underthesea
    text = word_tokenize(text, format="text")
    text = text.lower()
    return text
# Tiền xử lý dữ liệu
texts = [preprocess(text) for text in texts]
tokenizer = Tokenizer(num_words=5000)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded_sequences = pad_sequences(sequences, maxlen=10)
# Mô hình Deep Learning
model = Sequential([
    Embedding(input_dim=5000, output_dim=32, input_length=10),
    LSTM(64),
    Dense(1, activation='sigmoid')
])
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Huấn luyện mô hình
labels = np.array(labels)
model.fit(padded_sequences, labels, epochs=10, batch_size=2)

# Lưu mô hình
model.save("sentiment_model_vietnamese.h5")

# Lưu tokenizer
import pickle
with open("tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)

print("Mô hình và tokenizer đã được lưu!")
