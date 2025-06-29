from flask import Flask, Response, render_template, jsonify
from app.multi_stream import MultiStreamManager
import threading
from connection import db
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="static")
CORS(app, origins=["http://localhost:3000"])

# Inisialisasi dan mulai semua stream kamera yang aktif
manager = MultiStreamManager()
manager.start_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed/<cam_id>')
def video_feed(cam_id):
    stream = manager.get_stream(cam_id)
    if not stream:
        return f"Stream for camera {cam_id} not found", 404
    return Response(stream.mjpeg_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/cameras')
def list_cameras():
    cameras = db['cameras'].find()
    result = []
    for cam in cameras:
        result.append({
            "_id": str(cam["_id"]),
            "name_camera": cam["name_camera"],
            "string_uri": cam["string_uri"],  # Bisa dipakai untuk streaming endpoint
        })
    return jsonify(result)

@app.route('/status')
def status():
    # Mengembalikan status aktif dari semua kamera
    status_data = {
        cam_id: stream.get_active_ids()
        for cam_id, stream in manager.streams.items()
    }
    return jsonify(status_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
