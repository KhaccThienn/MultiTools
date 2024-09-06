# run.py

from app import create_app
from pymongo import MongoClient
import sys
sys.stdout.reconfigure(encoding='utf-8')


client = MongoClient('mongodb://localhost:27017/')

try:
    # Kiểm tra kết nối bằng cách liệt kê các cơ sở dữ liệu hiện có
    print(client.list_database_names())
    print("Kết nối thành công!")
except Exception as e:
    print(f"Kết nối thất bại: {e}")

db = client["multitools"]

# Kiểm tra collection
collections = db["tools"]
# Kiểm tra nếu collection 'tools' chưa tồn tại, thực hiện thao tác chèn để tạo nó
if "tools" not in db.list_collection_names():
    print("Collection 'tools' chưa tồn tại, khởi tạo collection...")
else:
    print("Collection 'tools' đã tồn tại.")

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
