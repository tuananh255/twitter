from keras.models import model_from_json
import numpy as np
from pyvi import ViTokenizer
import re
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences


class model_educational_admissions_consultant:
    def __init__(self):
        self.le= pickle.load(open('model/decode_label.pkl', 'rb'))
        self.stopwords = pickle.load(open('model/stopwords.pkl', 'rb'))
        self.tokenizer= pickle.load(open('model/decode_tokenizer.pkl', 'rb'))
        json_file = open('model/BI_model.json', 'r')
        loaded_model_json = json_file.read()
        json_file.close()
        clf = model_from_json(loaded_model_json)
        clf.load_weights("model/BI_model.h5")
        self.model = clf

    def preprocessing(self,document):
        document = ViTokenizer.tokenize(document)
        document = document.lower()
        document = re.sub(r'[^\s\wáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđ_]', ' ', document)
        document = re.sub(r'\s+', ' ', document).strip()
        return document

    def remove_stopwords(self,line):
        words = []
        for word in line.strip().split():
            if word not in self.stopwords:
                words.append(word)
        return ' '.join(words)

    def predict(self,text):
        vector = self.remove_stopwords(self.remove_stopwords(text))
        one_hot = self.tokenizer.texts_to_sequences([vector])
        input = pad_sequences(one_hot, maxlen=30, padding="pre")
        result = self.le.inverse_transform(np.argmax(self.model.predict(input.reshape(1, 30, 1)), axis=1))[0]
        return result