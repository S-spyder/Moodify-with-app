from flask import  Flask, redirect, render_template, jsonify, request
import cv2
from flask_cors import CORS, cross_origin
import numpy as np
from keras.models import load_model
from time import sleep
from keras.preprocessing.image import img_to_array
from keras.preprocessing import image
import random

face_classifier = cv2.CascadeClassifier("C:/Users/subha/OneDrive/Desktop/EmotionBasedMusicPlayer/cascades/data/haarcascade_frontalface_default.xml")
classifier = load_model("C:/Users/subha/OneDrive/Desktop/EmotionBasedMusicPlayer/Emotion.h5")

class_labels = ['Angry','Happy','Neutral','Sad','Surprise']
songs = {
    'Angry': ['Music/Angry/Kaam 25_ DIVINE.mp3','Music/Angry/Riva Riva.mp3','Music/Angry/Royal Family Clean Mix.mp3'],
    'Happy': ['Music/Happy/KHAAB.mp3','Music/Happy/Luis Fonsi - Despacito.mp3','Music/Happy/Shape of you.mp3'],
    'Neutral': ['Music/Neutral/Nazm_Nazm.mp3','Music/Neutral/Pehli Nazar Mein.mp3','Music/Neutral/Standing By You.mp3'],
    'Sad': ['Music/Sad/Aate Jate Khoobsurat.mp3','Music/Sad/Charlie_Puth_Attention.mp3','Music/Sad/Hamdard.mp3','Music/Sad/I_am_so_lonely_broken_angel.mp3'],
    'Surprise': ['Music/Surprise/Abusadamente.mp3','Music/Surprise/Bum Bum Tam Tam.mp3','Music/Surprise/Tu Jaane Na.mp3']
}

def shuffle(arr):
    l = len(arr) - 1
    for i in range(50):
        x = random.randint(0, l)
        y = random.randint(0, l)
        arr[x], arr[y] = arr[y], arr[x]
    return arr
        

app = Flask(__name__)
cors = CORS(app)

@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def index():
    if request.method == 'POST':
        try:
            frame = cv2.imdecode(np.fromstring(request.files['file'].read(), np.uint8), cv2.IMREAD_UNCHANGED)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_classifier.detectMultiScale(gray, 1.3, 5)
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                roi_gray = gray[y:y + h, x:x + w]
                roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

                if np.sum([roi_gray]) != 0:
                    roi = roi_gray.astype('float') / 255.0
                    roi = img_to_array(roi)
                    roi = np.expand_dims(roi, axis=0)

                    # Prediction on roi then lookup the classes.
                    preds = classifier.predict(roi)[0]
                    label = class_labels[preds.argmax()]
                    arr = shuffle(songs[label])
                    return jsonify({ 'mood': label, 'songs': arr })
                else:
                    return jsonify({ 'mood': 'Face Not Found', 'songs': None })
            else:
                return jsonify({ 'mood': 'Could not process Image', 'songs': None })
        except Exception as e:
            print(e)
            return jsonify({ 'mood': 'An Error Occured', 'songs': None })
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)