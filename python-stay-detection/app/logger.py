import time, cv2
from datetime import datetime
from .utils import convert_timestamps
from connection import db
import os

class Logger:
  def save(self, data, frame, cam_id="unknown"):
    x1, y1, x2, y2 = data["box"]
    w, h = x2 - x1, y2 - y1
    area = w * h
    ratio = h / (w + 1e-5)

    # if area < 10000 or ratio < 1.2:
    #   print(f"[SKIP] Person ID {data['id']} camera {[cam_id]} tidak memenuhi filter ukuran.")
    #   return False

    cropped = frame[y1:y2, x1:x2]
    if cropped.size == 0:
      print(f"[SKIP] Crop kosong, ID {data['id']}")
      return False

    mean_color = cv2.mean(cropped)[:3]
    brightness = sum(mean_color) / 3
    if brightness < 30:
      print(f"[SKIP] Crop terlalu gelap, ID {data['id']} camera {[cam_id]}")
      return False

    cropped = cv2.resize(cropped, (200, 400), interpolation=cv2.INTER_CUBIC)

    timestamp = time.strftime("%Y%m%d-%H%M%S")
    os.makedirs(f"captures/{cam_id}", exist_ok=True)
    filename = f"captures/{cam_id}/person_{data['id']}_{timestamp}.jpg"
    cv2.imwrite(filename, cropped)
    print(f"[INFO] [{cam_id}] Cropped person ID {data['id']} saved as {filename}")

    converted = convert_timestamps(data)
    converted["capture_path"] = filename
    converted["camera_id"] = cam_id
    collection = db["log_stay"]
    collection.insert_one(converted) # perintah untuk memasukkan kedalam database
    print(f"[INFO] Data for person ID {data['id']} (Camera: {cam_id}) saved to MongoDB.")
    return True