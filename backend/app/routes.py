# app/routes.py

from flask import Blueprint, request, send_file
from .utils import resize_image, crop_image, remove_object

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

@bp.route('/remove-object', methods=['POST'])
def remove_object_route():
    """
    API route để xóa một chi tiết trong ảnh.
    
    Yêu cầu:
    - POST request với file ảnh và các thông số tọa độ x1, y1, x2, y2.
    - Phương pháp inpainting (telea hoặc ns) có thể được cung cấp trong form data (mặc định là 'telea').
    
    Trả về:
    - Ảnh đã được xóa chi tiết.
    """
    file = request.files['image']
    x1 = int(request.form['x1'])
    y1 = int(request.form['y1'])
    x2 = int(request.form['x2'])
    y2 = int(request.form['y2'])
    method = request.form.get('method', 'telea')  # Mặc định là 'telea' nếu không cung cấp

    # Gọi hàm remove_object từ utils.py
    result_io = remove_object(file, x1, y1, x2, y2, method)

    # Trả về ảnh đã xử lý
    return send_file(result_io, mimetype='image/jpeg')
