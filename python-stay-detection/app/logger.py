import time, cv2
from datetime import datetime
from .utils import convert_timestamps
from connection import db
import os

class Logger:
  def save(self, data, frame):
    x1, y1, x2, y2 = data["box"]
    w, h = x2 - x1, y2 - y1
    area = w * h
    ratio = h / (w + 1e-5) # hindari divide by zero

    # Filter: hanya proses crop besar dan tinggi
    if area < 8000 or ratio < 1.2:
      print(f"[SKIP] Person ID {data['id']} tidak memenuhi filter ukuran.")
      return

    cropped = frame[y1:y2, x1:x2]

    # if cropped.size == 0:
    #   print(f"[SKIP] Crop kosong, ID {data['id']}")
    #   return
   
    # Cek untuk background terlalu gelap
    mean_color = cv2.mean(cropped)[:3]
    brightness = sum(mean_color) / 3
    if brightness < 99:
      print(f"[SKIP] Crop terlalu gelap, ID {data['id']}")
      return

    # Simpan dan Resize crop agar hasil lebih jelas saat diperbesar
    cropped = cv2.resize(cropped, (200, 400), interpolation=cv2.INTER_CUBIC)

    # Simpan hasil crop ke file
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    os.makedirs("captures", exist_ok=True)
    filename = f"captures/person_{data['id']}_{timestamp}.jpg"
    cv2.imwrite(filename, cropped)
    print(f"[INFO] Cropped person ID {data['id']} saved as {filename}")

    # Simpan metadata ke database
    converted = convert_timestamps(data)
    converted["capture_path"] = filename
    collection = db["log_stay"]
    collection.insert_one(converted)
    print(f"[INFO] Data for person ID {data['id']} saved to MongoDB.")