from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
from collections import Counter
import datetime
import json
import os
import threading
import time

app = Flask(__name__)
CORS(app)  #allow frontend( from http://localhost:5173)

# Load model and face detector
model = tf.keras.models.load_model("emotion_model.h5")
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

class_names = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised']
valence_map = {
    'angry': 'negative',
    'disgusted': 'negative',
    'fearful': 'negative',
    'sad': 'negative',
    'happy': 'positive',
    'surprised': 'positive',
    'neutral': 'neutral'
}

# Emotion log folder
os.makedirs("emotion_logs", exist_ok=True)


tracking_active = False
emotion_counter = Counter()
valence_counter = Counter()
tracking_thread = None
stop_signal = False
frame_buffer = None

def track_emotions():
    global tracking_active, emotion_counter, valence_counter, stop_signal, frame_buffer

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print(" Could not access webcam.")
        tracking_active = False
        return

    start_time = time.time()
    duration_seconds = 1 * 60  

    while tracking_active and not stop_signal:
        ret, frame = cap.read()
        if not ret:
            print(" Failed to grab frame")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            face_img = frame[y:y+h, x:x+w]
            face_img = cv2.resize(face_img, (48, 48))
            face_img = face_img / 255.0
            face_img = np.expand_dims(face_img, axis=0)
            prediction = model.predict(face_img, verbose=0)
            emotion = class_names[np.argmax(prediction)]
            valence = valence_map[emotion]
            emotion_counter[emotion] += 1
            valence_counter[valence] += 1

            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 255, 0), 2)
            cv2.putText(frame, f'{emotion} ({valence})', (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_buffer = buffer.tobytes()

        if time.time() - start_time > duration_seconds:
            print("Auto-stopped after 10 minutes.")
            break

        time.sleep(0.05)

    cap.release()
    tracking_active = False

    
    today = datetime.date.today().isoformat()
    log_path = f"emotion_logs/{today}.json"
    with open(log_path, "w") as f:
        json.dump({
            "date": today,
            "duration_minutes": round((time.time() - start_time) / 60, 2),
            "emotions": dict(emotion_counter),
            "valence": dict(valence_counter)
        }, f, indent=4)
    print(f"Log saved to {log_path}")

@app.route('/start-video')
def start_video():
    global tracking_active, tracking_thread, emotion_counter, valence_counter, stop_signal
    if not tracking_active:
        emotion_counter.clear()
        valence_counter.clear()
        stop_signal = False
        tracking_active = True
        tracking_thread = threading.Thread(target=track_emotions)
        tracking_thread.start()
        return jsonify({"status": "started"})
    else:
        return jsonify({"status": "already running"})

@app.route('/stop-video')
def stop_video():
    global stop_signal
    stop_signal = True
    return jsonify({"status": "stopping"})

@app.route('/video-feed')
def video_feed():
    def generate():
        global frame_buffer
        while tracking_active and not stop_signal:
            if frame_buffer:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_buffer + b'\r\n')
            time.sleep(0.05)
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/today-summary')
def today_summary():
    today = datetime.date.today().isoformat()

    total_emotions = sum(emotion_counter.values()) or 1  # avoid division by 0
    total_valence = sum(valence_counter.values()) or 1

    emotion_percent = {k: round((v / total_emotions) * 100, 2) for k, v in emotion_counter.items()}
    valence_percent = {k: round((v / total_valence) * 100, 2) for k, v in valence_counter.items()}

    return jsonify({
        "date": today,
        "emotions": emotion_percent,
        "valence": valence_percent
    })

@app.route('/weekly-valence')
def weekly_valence():
    log_dir = "emotion_logs"
    logs = []

    for filename in os.listdir(log_dir):
        if filename.endswith(".json"):
            date_str = filename.replace(".json", "")
            try:
                date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                logs.append((date, filename))
            except ValueError:
                continue

    logs.sort()

    if len(logs) > 7:
        for date, filename in logs[:-7]:
            os.remove(os.path.join(log_dir, filename))

    logs = logs[-7:]
    result = []

    for date, filename in logs:
        with open(os.path.join(log_dir, filename)) as f:
            log = json.load(f)

        valence_data = log.get("valence", {})
        total = sum(valence_data.values()) or 1

        result.append({
            "date": date.strftime("%d/%m"),
            "Positive": round((valence_data.get("positive", 0) / total) * 100, 2),
            "Negative": round((valence_data.get("negative", 0) / total) * 100, 2),
            "Neutral": round((valence_data.get("neutral", 0) / total) * 100, 2),
        })

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
