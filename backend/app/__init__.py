# app/__init__.py

from flask import Flask
from flask_cors import CORS
from .routes import bp
import os


def create_app():
    app = Flask(__name__)

    
    CORS(app)  # Kích hoạt CORS
    app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # Giới hạn 500MB
    from .routes import bp  # Import bp sau khi app đã được khởi tạo
    app.register_blueprint(bp)  # Đăng ký các route từ routes.py

    return app
