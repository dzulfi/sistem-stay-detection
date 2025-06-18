from datetime import datetime

def get_centroid(box):
  x1, y1, x2, y2 = box
  return ((x1 + x2) // 2, (y1 + y2) // 2)

def euclidean(p1, p2):
  return ((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2) ** 0.5

def format_duration(seconds):
  m, s = divmod(int(seconds), 60)
  h, m = divmod(m, 60)
  return f"{h:02}:{m:02}:{s:02}"

def convert_timestamps(data):
  return {
    **data,
    "start_time": datetime.fromtimestamp(data["start_time"]).strftime('%Y-%m-%d %H:%M:%S'),
    "last_seen": datetime.fromtimestamp(data["last_seen"]).strftime('%Y-%m-%d %H:%M:%S')
  }
