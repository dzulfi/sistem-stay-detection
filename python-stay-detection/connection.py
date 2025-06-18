from pymongo import MongoClient

# Ganti URL dan nama database sesuai kebutuhan
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "stay_detection"

# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]
try:
  client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
  client.server_info() # Coba panggil server info untuk memastikan koneksi berhasil
  db = client[DB_NAME]
  print("[INFO] Connected to MongoDB successfully.")
except Exception as e:
  print(f"[ERROR] Failed to connect to MongoDB: {e}")
  db = None # atau sys.exit(1) jika kamu ingin hentikan program