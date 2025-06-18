import cv2
from ultralytics import YOLO
import numpy as np

class PersonDetector:
  def __init__(self, model_path="yolov8n.pt"):
    self.model = YOLO(model_path)
    self.model.fuse()

  def detect(self, frame):
    # Cek brightness frame (nilai rata-rata pixel)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)
    if brightness < 99:
      print(f"[SKIP] Frame terlalu gelap untuk deteksi.")
      return

    # deteksi jika cukup terang
    results = self.model(frame, conf=0.3, iou=0.5)[0] # lebih selektif
    detections = []
    for result in results.boxes:
      if int(result.cls[0]) == 0: # class 0 = person
        x1, y1, x2, y2 = map(int, result.xyxy[0])
        w = x2 - x1
        h = y2 - y1
        area = w * h
        ratio = h / (w + 1e-5) # hindari divide by zero

        # Filter berdasarkan area dan rasio tinggi
        if area > 150 and ratio > 1.0:
          detections.append((x1, y1, x2, y2))
    return detections

