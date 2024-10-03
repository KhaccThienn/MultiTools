# app/utils.py

from PIL import Image
import io
import cv2
import numpy as np
import base64
from io import BytesIO

def resize_image(file, width=300, height=300):
    img = Image.open(file.stream)
    img = img.resize((width, height))

    img_io = io.BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)
    
    return img_io

def crop_image(file, left, top, right, bottom):
    img = Image.open(file.stream)
    img = img.crop((left, top, right, bottom))

    img_io = io.BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)

    return img_io

def process_crop(image_data, left, top, width, height):
    # Loại bỏ tiền tố 'data:image/png;base64,' nếu có
    if ',' in image_data:
        image_data = image_data.split(',')[1]

    decoded_image = base64.b64decode(image_data)
    image = Image.open(BytesIO(decoded_image))

    # Crop hình ảnh
    cropped_image = image.crop((left, top, left + width, top + height))

    buffered = BytesIO()
    cropped_image.save(buffered, format="PNG")
    cropped_image_str = base64.b64encode(buffered.getvalue()).decode()

    return cropped_image_str

def remove_object(file, x1, y1, x2, y2, method='telea'):
    """
    Xóa một chi tiết trong một bức ảnh bằng kỹ thuật inpainting.
    
    Parameters:
    - file: Ảnh đầu vào (từ request).
    - x1, y1, x2, y2: Tọa độ của khu vực cần xóa (hình chữ nhật).
    - method: Phương pháp inpainting ('telea' hoặc 'ns'). Mặc định là 'telea'.
    
    Returns:
    - img_io: Ảnh kết quả sau khi xóa chi tiết, ở định dạng BytesIO.
    """
    # Đọc ảnh từ đối tượng file
    file_stream = file.read()  # Đọc toàn bộ nội dung của file
    np_img = np.frombuffer(file_stream, np.uint8)  # Chuyển đổi dữ liệu file thành mảng numpy
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)  # Giải mã mảng numpy thành ảnh

    # Tạo mặt nạ cho khu vực cần xóa
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.rectangle(mask, (x1, y1), (x2, y2), 255, -1)  # Vẽ hình chữ nhật màu trắng trên mặt nạ

    # Chọn phương pháp inpainting
    if method == 'telea':
        inpaint_method = cv2.INPAINT_TELEA
    elif method == 'ns':
        inpaint_method = cv2.INPAINT_NS
    else:
        raise ValueError("Method must be 'telea' or 'ns'.")

    # Xóa khu vực được chọn bằng phương pháp inpainting
    result = cv2.inpaint(img, mask, 3, inpaint_method)

    # Chuyển ảnh kết quả thành định dạng BytesIO
    _, img_encoded = cv2.imencode('.jpg', result)
    img_io = io.BytesIO(img_encoded.tobytes())

    return img_io


from rembg import remove

def remove_background(image_data):
    try:
        # Loại bỏ tiền tố 'data:image/png;base64,' nếu có
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        # Giải mã chuỗi base64 thành dữ liệu nhị phân
        decoded_image = base64.b64decode(image_data)

        # Sử dụng BytesIO để chuyển đổi dữ liệu nhị phân thành đối tượng hình ảnh
        input_image = Image.open(BytesIO(decoded_image)).convert("RGBA")

        # Chuyển đổi hình ảnh thành mảng numpy
        input_np = np.array(input_image)

        # Xóa nền bằng rembg
        output_np = remove(input_np)

        # Chuyển đổi mảng numpy kết quả thành hình ảnh PIL
        output_image = Image.fromarray(output_np).convert("RGBA")

        # Chuyển hình ảnh kết quả thành chuỗi base64
        buffered = BytesIO()
        output_image.save(buffered, format="PNG")
        output_image_str = base64.b64encode(buffered.getvalue()).decode()

        return output_image_str

    except Exception as e:
        print(f"Lỗi khi xử lý xóa nền: {e}")
        return None