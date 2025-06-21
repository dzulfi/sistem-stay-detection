from .tracker import CentroidTracker
from .detector import PersonDetector
from .logger import Logger
from .utils import format_duration
import cv2, time
from threading import Lock
from threading import Thread

class VideoStream:
  def __init__(self, src):
    self.stream = cv2.VideoCapture(src, cv2.CAP_FFMPEG)
    self.stream.set(cv2.CAP_PROP_BUFFERSIZE, 5)
    self.ret, self.frame = self.stream.read()
    self.stopped = False
    Thread(target=self.update, args=(), daemon=True).start()

  def update(self):
    while not self.stopped:
      self.ret, self.frame = self.stream.read()

  def read(self):
    return self.ret, self.frame

  def stop(self):
    self.stopped = True
    self.stream.release()

class StreamProcessor:
  # menangkap real time camera cctv
  def __init__(self, camera_url, cam_id=None):
    # self.cap = cv2.VideoCapture("rtsp://admin:Joglo631999@192.168.200.40:554/live/0/MAIN", cv2.CAP_FFMPEG)
    # camera = "rtsp://admin:Joglo631999@192.168.200.40:554/live/0/MAIN"
    # camera = "rtsp://192.168.200.23:554/LiveMedia/ch1/Media2?src=onvif"
    self.cam_id = cam_id # Simpan ID kamera
    self.cap = VideoStream(camera_url)
    self.detector = PersonDetector()
    self.tracker = CentroidTracker(cam_id=cam_id) # Diteruskan ke tracker
    self.logger = Logger()
    self.output_frame = None
    self.lock = Lock()

  def run(self):
    print(f"[RUN] mulai loop kamera {self.cam_id}")
    while True:
      ret, frame = self.cap.read()
      if not ret:
        print(f"[warn] kamera {self.cam_id} gagal baca frame")
        continue
      frame = cv2.resize(frame, (800, 400))
      persons = self.detector.detect(frame)
      current_time = time.time()
      self.tracker.update(persons, current_time, frame, self.logger)
      annotated = self.tracker.annotate(frame.copy(), current_time)
      with self.lock:
        self.output_frame = annotated

  def mjpeg_stream(self):
    while True:
      with self.lock:
        if self.output_frame is None:
          continue
        ret, buffer = cv2.imencode('.jpg', self.output_frame)
        frame = buffer.tobytes()
      yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

  def get_active_ids(self):
    return self.tracker.get_current_status()
