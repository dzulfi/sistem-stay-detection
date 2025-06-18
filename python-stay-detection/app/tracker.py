import cv2
import numpy as np
from .utils import get_centroid, euclidean, format_duration
# from ultralytics.trackers.byte_tracker import BYTETracker #tambahan untuk meningkatkan pelacakan agar tidak gonta-ganti ID ( harus mengganti self.trackers )

class CentroidTracker:
  def __init__(self):
    self.trackers = {}
    # self.tracker = BYTETracker()
    self.next_id = 0
    self.MAX_DISAPPEAR = 4 # Durasi bounding menghilang
    self.MATCH_DISTANCE = 70 # jarak antara bounding jika terlalu kecil (30) menyebabkan bounding dan id berganti-ganti

  def update(self, boxes, current_time, frame, logger):
    matched_ids = set()
    for box in boxes:
      centroid = get_centroid(box)
      matched = False
      for tid, data in self.trackers.items():
        if euclidean(data["centroid"], centroid) < self.MATCH_DISTANCE:
          data.update({"centroid": centroid, "last_seen": current_time, "box": box})
          matched_ids.add(tid)
          matched = True
          break
      if not matched:
        self.trackers[self.next_id] = {
          "id": self.next_id,
          "centroid": centroid,
          "start_time": current_time,
          "last_seen": current_time,
          "box": box,
          "duration": 0
        }
        matched_ids.add(self.next_id)
        self.next_id += 1

    to_delete = []
    # for tid, data in self.trackers.items():
    #   if tid not in matched_ids and current_time - data["last_seen"] > self.MAX_DISAPPEAR:
    #     stay_duration = current_time - data["start_time"]
    #     if stay_duration >= 5:
    #       logger.save(data, frame)
    #     else:
    #       print(f"[SKIP] ID {tid} tinggal hanya {stay_duration:.2f} detik, abaikan.")
    #     to_delete.append(tid)
    for tid, data in self.trackers.items():
      stay_duration = current_time - data["start_time"]

      # Jika sudah 5 detik dan belum dicapture, capture sekarang
      if stay_duration >= 5 and not data.get("captured", False):
        logger.save(data, frame)
        data["captured"] = True # tandai sudah disimpan

      # Hapus tracker jika terlalu lama tidak terlihat
      if tid not in matched_ids and current_time - data["last_seen"] > self.MAX_DISAPPEAR:
        to_delete.append(tid)
    for tid in to_delete:
      del self.trackers[tid]

  def annotate(self, frame, current_time):
    for tid, data in self.trackers.items():
      x1, y1, x2, y2 = data["box"]
      dur_str = format_duration(current_time - data["start_time"])
      data["duration"] = dur_str
      cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
      cv2.putText(frame, f"ID {tid} | {dur_str}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,0), 2)
    return frame

  def get_current_status(self):
    return [
      {"id": tid, "duration": data["duration"]}
      for tid, data in self.trackers.items()
    ]
