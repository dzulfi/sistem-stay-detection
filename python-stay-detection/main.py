from flask import Flask, Response, render_template, jsonify
from app.stream import StreamProcessor
import threading

app = Flask(__name__, static_folder="static", template_folder="static")
processor = StreamProcessor()
t = threading.Thread(target=processor.run, daemon=True)
t.start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(processor.mjpeg_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    return jsonify(processor.get_active_ids())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
