# app/utils.py

from PIL import Image, ImageFilter
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


# def remove_background(image_data):
#     try:
#         # Loại bỏ tiền tố 'data:image/png;base64,' nếu có
#         if ',' in image_data:
#             image_data = image_data.split(',')[1]

#         # Giải mã chuỗi base64 thành dữ liệu nhị phân
#         decoded_image = base64.b64decode(image_data)

#         # Sử dụng BytesIO để chuyển đổi dữ liệu nhị phân thành đối tượng hình ảnh
#         input_image = Image.open(BytesIO(decoded_image)).convert("RGBA")

#         # Chuyển đổi hình ảnh thành mảng numpy
#         input_np = np.array(input_image)

#         # Xóa nền bằng rembg
#         output_np = remove(input_np)

#         # Chuyển đổi mảng numpy kết quả thành hình ảnh PIL
#         output_image = Image.fromarray(output_np).convert("RGBA")

#         # Chuyển hình ảnh kết quả thành chuỗi base64
#         buffered = BytesIO()
#         output_image.save(buffered, format="PNG")
#         output_image_str = base64.b64encode(buffered.getvalue()).decode()

#         return output_image_str

#     except Exception as e:
#         print(f"Lỗi khi xử lý xóa nền: {e}")
#         return None
    

def remove_background(image_data):
    try:
        # Loại bỏ tiền tố 'data:image/png;base64,' nếu có
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        # Giải mã chuỗi base64 thành dữ liệu nhị phân
        decoded_image = base64.b64decode(image_data)

        # Chuyển đổi dữ liệu nhị phân thành mảng numpy để sử dụng với OpenCV
        nparr = np.frombuffer(decoded_image, np.uint8)
        input_image = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)  # Đọc ảnh RGBA nếu có

        if input_image is None:
            raise ValueError("Không thể đọc ảnh từ dữ liệu base64")

        # Xóa nền bằng rembg (rembg hỗ trợ xử lý mảng numpy)
        output_image = remove(input_image)

        # Chuyển đổi ảnh kết quả sang định dạng PNG
        _, buffer = cv2.imencode('.png', output_image)

        # Mã hóa kết quả thành base64
        output_image_str = base64.b64encode(buffer).decode()

        return output_image_str

    except Exception as e:
        print(f"Lỗi khi xử lý xóa nền: {e}")
        return None 

        
import traceback
import requests

def change_background(image_data, background_type, background_value):
    try:
        print("Bắt đầu hàm change_background")
        print("background_type:", background_type)
        print("background_value:", background_value)

        # Loại bỏ tiền tố 'data:image/png;base64,' nếu có
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        # Giải mã chuỗi base64 thành dữ liệu nhị phân
        decoded_image = base64.b64decode(image_data)

        # Chuyển đổi dữ liệu nhị phân thành mảng numpy để sử dụng với OpenCV
        nparr = np.frombuffer(decoded_image, np.uint8)
        input_image = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)  # Đọc ảnh RGBA nếu có

        if input_image is None:
            raise ValueError("Không thể đọc ảnh từ dữ liệu base64")

        print("Kích thước input_image:", input_image.shape)
        print("Số kênh của input_image:", input_image.shape[2])

        # Kiểm tra xem ảnh có kênh alpha không
        if input_image.shape[2] < 4:
            # Nếu không có kênh alpha, cần xóa nền trước
            input_image = remove(input_image)

            # Kiểm tra lại xem ảnh đã có kênh alpha chưa
            if input_image.shape[2] < 4:
                raise ValueError("Không thể tạo kênh alpha cho ảnh")

        # Tách kênh màu và kênh alpha
        bgr = input_image[:, :, :3]
        alpha_channel = input_image[:, :, 3] / 255.0  # Chuyển đổi alpha về phạm vi [0,1]
        alpha_channel = alpha_channel.astype(np.float32)

        print("Kích thước bgr:", bgr.shape)
        print("Kích thước alpha_channel:", alpha_channel.shape)

        # Xử lý nền mới
        if background_type == 'color':
            # Chuyển đổi mã màu hex sang tuple BGR
            hex_color = background_value.lstrip('#')
            if len(hex_color) != 6 or not all(c in '0123456789abcdefABCDEF' for c in hex_color):
                raise ValueError("Mã màu hex không hợp lệ")
            background_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
            # Tạo ảnh nền với màu sắc chỉ định
            background = np.zeros_like(bgr, dtype=np.uint8)
            background[:] = background_color[::-1]  # Đảo ngược để chuyển RGB sang BGR
        elif background_type == 'image':
            # Kiểm tra xem background_value là base64 hay URL
            if background_value.startswith('data:image'):
                # Nếu là chuỗi base64
                bg_image_data = background_value.split(',')[1]
                bg_decoded_image = base64.b64decode(bg_image_data)
                bg_nparr = np.frombuffer(bg_decoded_image, np.uint8)
                background = cv2.imdecode(bg_nparr, cv2.IMREAD_COLOR)
            else:
                # Nếu là URL, tải ảnh từ URL
                response = requests.get(background_value)
                if response.status_code != 200:
                    raise ValueError("Không thể tải ảnh nền từ URL")
                bg_image_data = response.content
                bg_nparr = np.frombuffer(bg_image_data, np.uint8)
                background = cv2.imdecode(bg_nparr, cv2.IMREAD_COLOR)

            if background is None:
                raise ValueError("Không thể đọc ảnh nền")

            # Thay đổi kích thước ảnh nền cho khớp với ảnh gốc
            background = cv2.resize(background, (bgr.shape[1], bgr.shape[0]))
        else:
            raise ValueError("Loại nền không hợp lệ")

        # Mở rộng kênh alpha lên 3 kênh
        alpha_mask = np.dstack((alpha_channel, alpha_channel, alpha_channel))
        alpha_mask = alpha_mask.astype(np.float32)

        # Chuyển đổi ảnh về phạm vi [0, 1]
        bgr_normalized = bgr.astype(np.float32) / 255.0
        background_normalized = background.astype(np.float32) / 255.0

        # Kết hợp ảnh gốc với nền mới sử dụng kênh alpha mở rộng
        foreground = cv2.multiply(alpha_mask, bgr_normalized)
        background = cv2.multiply(1.0 - alpha_mask, background_normalized)
        out_image = cv2.add(foreground, background)

        # Chuyển đổi ảnh kết quả về dạng uint8
        out_image = (out_image * 255).astype(np.uint8)

        # Chuyển đổi ảnh kết quả sang định dạng PNG
        _, buffer = cv2.imencode('.png', out_image)

        # Mã hóa kết quả thành base64
        output_image_str = base64.b64encode(buffer).decode()

        print("Hoàn thành hàm change_background")

        return output_image_str

    except Exception as e:
        print(f"Lỗi khi thay đổi nền: {e}")
        traceback.print_exc()
        return None

def generate_image_from_text(text):
    """Call the NVIDIA text-to-image API and return the generated image in Base64 format."""
    
    # NVIDIA API endpoint
    invoke_url = "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl"
    
    # Replace with your actual API key
    headers = {
        "Authorization": "Bearer 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",
        "Accept": "application/json",
    }
    
    # Payload with text prompt and parameters
    payload = {
        "text_prompts": [
            {
                "text": text,
                "weight": 1
            },
            {
                "text": "",
                "weight": -1
            }
        ],
        "cfg_scale": 5,
        "sampler": "K_DPM_2_ANCESTRAL",
        "seed": 0,
        "steps": 25
    }

    try:
        response = requests.post(invoke_url, headers=headers, json=payload)
        response.raise_for_status()
        
        response_body = response.json()
        base64_image = response_body['artifacts'][0]['base64']
        
        return base64_image
    except Exception as e:
        print(f"Error generating image: {e}")
        return None