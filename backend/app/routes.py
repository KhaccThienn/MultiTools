# app/routes.py

from flask import Blueprint, request, send_file
from .utils import resize_image, crop_image

# Sử dụng Blueprint để tổ chức các route
bp = Blueprint('main', __name__)

@bp.route('/resize', methods=['POST'])
def resize():
    file = request.files['image']
    img_io = resize_image(file)
    return send_file(img_io, mimetype='image/jpeg')

@bp.route('/crop', methods=['POST'])
def crop():
    file = request.files['image']
    left = int(request.form['left'])
    top = int(request.form['top'])
    right = int(request.form['right'])
    bottom = int(request.form['bottom'])

    img_io = crop_image(file, left, top, right, bottom)
    return send_file(img_io, mimetype='image/jpeg')
