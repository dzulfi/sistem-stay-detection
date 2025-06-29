from app.stream import StreamProcessor
from connection import db
from threading import Thread

class MultiStreamManager:
    def __init__(self):
        self.streams = {}

    def start_all(self):
        cameras = db["cameras"].find({"status": "active"})
        for cam in cameras:
            cam_id = str(cam["_id"])
            rtsp_url = cam["string_uri"]
            stream = StreamProcessor(rtsp_url, cam_id=cam_id)
            self.streams[cam_id] = stream
            Thread(target=stream.run, daemon=True).start()
            print(f"[INFO] StreamProcessor started for camera {cam_id} | URL: {rtsp_url}")

    def get_stream(self, cam_id):
        return self.streams.get(cam_id)
