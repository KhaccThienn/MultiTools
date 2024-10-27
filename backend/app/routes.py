# app/routes.py

import base64
from io import BytesIO
from tkinter import Image
from flask import Blueprint, request, send_file, jsonify
from .utils import change_background, resize_image, crop_image, remove_object, process_crop, remove_background

# Sử dụng Blueprint để tổ chức các route
bp = Blueprint('main', __name__)

@bp.route('/resize', methods=['POST'])
def resize_route():
    file = request.files['image']
    img_io = resize_image(file)
    return send_file(img_io, mimetype='image/jpeg')

@bp.route('/crop', methods=['POST'])
def crop_image_route():
    data = request.get_json()
    top = int(data['top'])
    left = int(data['left'])
    width = int(data['width'])
    height = int(data['height'])
    image_data = data['image']

    # Sử dụng hàm tiện ích để xử lý crop hình ảnh
    cropped_image_str = process_crop(image_data, left, top, width, height)

    # Trả về hình ảnh đã crop dưới dạng base64
    return jsonify({'cropped_image': 'data:image/png;base64,' + cropped_image_str})

@bp.route('/remove-object', methods=['POST'])
def remove_object_route():
    """
    API route để xóa một chi tiết trong ảnh.
    """
    file = request.files['image']
    x1 = int(request.form['x1'])
    y1 = int(request.form['y1'])
    x2 = int(request.form['x2'])
    y2 = int(request.form['y2'])
    method = request.form.get('method', 'telea')

    # Gọi hàm remove_object từ utils.py
    result_io = remove_object(file, x1, y1, x2, y2, method)

    # Trả về ảnh đã xử lý
    return send_file(result_io, mimetype='image/jpeg')

@bp.route('/remove-background', methods=['POST'])
def remove_background_route():
    try:
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'Trường image không tồn tại trong dữ liệu gửi đến'}), 400

        image_data = data['image']

        # Gọi hàm remove_background từ utils.py
        output_image_str = remove_background(image_data)

        if output_image_str:
            # Trả về hình ảnh đã xóa nền dưới dạng base64
            return jsonify({'output_image': 'data:image/png;base64,' + output_image_str})
        else:
            return jsonify({'error': 'Lỗi khi xử lý xóa nền.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

import traceback

@bp.route('/change-background', methods=['POST'])
def change_background_route():
    try:
        data = request.get_json()
        image_data = data.get('image')
        background_type = data.get('backgroundType')
        background_value = data.get('backgroundValue')

        if not image_data or not background_type or not background_value:
            return jsonify({'error': 'Thiếu dữ liệu cần thiết.'}), 400

        output_image_str = change_background(image_data, background_type, background_value)

        if output_image_str:
            return jsonify({'output_image': 'data:image/png;base64,' + output_image_str})
        else:
            return jsonify({'error': 'Lỗi khi thay đổi nền.'}), 500
    except Exception as e:
        print(f"Lỗi khi xử lý yêu cầu thay đổi nền: {e}")
        traceback.print_exc()
        # Trả về chi tiết lỗi cho frontend
        return jsonify({'error': f'Lỗi khi xử lý yêu cầu: {str(e)}'}), 500
