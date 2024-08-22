# app/__init__.py

from flask import Flask
from flask_cors import CORS
from .routes import bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Kích hoạt CORS
    app.register_blueprint(bp)  # Đăng ký các route từ routes.py

    return app
