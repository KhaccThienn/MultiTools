# app/__init__.py

from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Kích hoạt CORS
    
    from .routes import bp  # Import bp sau khi app đã được khởi tạo
    app.register_blueprint(bp)  # Đăng ký các route từ routes.py

    return app
