# app/utils.py

from concurrent.futures import ThreadPoolExecutor
import os
import shutil
import subprocess
import tempfile
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
    
def delete_file(filepath):
    try:
        # Use appropriate command based on OS
        if os.name == 'nt':  # Windows
            subprocess.run(['del', '/f', filepath], check=True, shell=True)
        else:  # Unix/Linux/MacOS
            subprocess.run(['rm', '-f', filepath], check=True)
    except Exception as e:
        print(f"Error deleting file {filepath}: {e}")

import yt_dlp

def download_and_convert_playlist_to_mp3(playlist_url, output_folder):
    # Create a temporary folder inside the provided output folder
    temp_folder = tempfile.mkdtemp(dir=output_folder)
    
    failed_videos = []  # List to keep track of failed videos

    def progress_hook(d):
        if d['status'] == 'downloading':
            print(f"Downloading: {d['_percent_str']} complete, speed: {d['_speed_str']}, ETA: {d['_eta_str']}")
        elif d['status'] == 'finished':
            print("Download complete, starting conversion...")
        elif d['status'] == 'processing':
            print(f"Processing: {d.get('_percent_str', 'N/A')}")
        elif d['status'] == 'error':
            video_title = d.get('filename', 'Unknown')
            print(f"Error downloading or processing video: {video_title}")
            failed_videos.append(video_title)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(temp_folder, '%(title)s.%(ext)s'),  # Save to temp folder
        'progress_hooks': [progress_hook],
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'ignoreerrors': True,  # Continue on download errors
        'quiet': False,        # Display download information
    }

    files_to_delete = []
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Downloading playlist: {playlist_url}")
            ydl.download([playlist_url])
            print("All videos downloaded and converted to MP3.")
        
        # Move MP3 files to the output folder and collect non-MP3 files for deletion
        for file in os.listdir(temp_folder):
            src_path = os.path.join(temp_folder, file)
            dest_path = os.path.join(output_folder, file)
            if file.lower().endswith('.mp3'):
                try:
                    shutil.move(src_path, dest_path)
                    print(f"Moved {file} to {output_folder}")
                except Exception as e:
                    print(f"Error moving file {file}: {e}")
            else:
                files_to_delete.append(src_path)
        
        # Delete non-MP3 files concurrently
        if files_to_delete:
            with ThreadPoolExecutor() as executor:
                executor.map(delete_file, files_to_delete)
    
    except Exception as e:
        print(f"Error downloading playlist: {e}")
        raise e  # Re-raise exception to handle in the route
    
    finally:
        # Optionally, handle failed videos (e.g., log them)
        if failed_videos:
            print("\nFailed Videos:")
            for v in failed_videos:
                print(f"- {v}")
        else:
            print("\nNo failed videos.")
        
        # Clean up the temporary folder
        try:
            shutil.rmtree(temp_folder)
            print(f"Temporary folder {temp_folder} deleted.")
        except Exception as e:
            print(f"Error deleting temporary folder {temp_folder}: {e}")


import requests
from tqdm import tqdm
import os
from tkinter import Tk, filedialog

def download_file_with_folder_selection(url, default_filename):
    # Open a folder selection dialog
    root = Tk()
    root.withdraw()  # Hide the root window
    output_folder = filedialog.askdirectory(title="Select Output Folder")
    
    if not output_folder:
        print("No folder selected. Download canceled.")
        return
    
    # Construct the output file path
    output_path = os.path.join(output_folder, default_filename)

    try:
        # Make a GET request to fetch the file
        with requests.get(url, stream=True) as response:
            response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
            
            # Get the total file size from headers
            total_size = int(response.headers.get('content-length', 0))
            
            # Open the output file in write-binary mode
            with open(output_path, 'wb') as file:
                # Use tqdm to show download progress
                with tqdm(total=total_size, unit='B', unit_scale=True, desc='Downloading') as progress_bar:
                    for chunk in response.iter_content(chunk_size=1024):  # Download in chunks of 1KB
                        file.write(chunk)
                        progress_bar.update(len(chunk))  # Update the progress bar with the chunk size

        print(f"Download complete: {output_path}")

    except requests.RequestException as e:
        print(f"Error occurred: {e}")



def convert_image(input_path, output_path, output_format):
    """
    Converts an image from one format to another.
    
    Parameters:
    - input_path (str): Path to the input image file.
    - output_path (str): Path to save the converted image.
    - output_format (str): Desired output format (e.g., 'PNG', 'JPEG').
    """
    try:
        with Image.open(input_path) as img:
            img = img.convert("RGB")  # Ensuring compatibility for formats like JPEG
            img.save(output_path, format=output_format)
        return output_path
    except Exception as e:
        print(f"Error converting image: {e}")
        return None
    
import os
import speech_recognition as sr
from moviepy.editor import VideoFileClip, AudioFileClip
import tempfile
import logging
import math

logging.basicConfig(level=logging.DEBUG)

def format_time(seconds):
    """
    Chuyển đổi thời gian tính bằng giây thành định dạng VTT (hh:mm:ss.ms)
    """
    import datetime
    td = datetime.timedelta(seconds=seconds)
    total_seconds = td.total_seconds()
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    milliseconds = int((total_seconds - int(total_seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

def generate_subtitles(video_file_path, temp_dir):
    """
    Tạo phụ đề từ video bằng cách nhận dạng giọng nói.

    Parameters:
    - video_file_path: Đường dẫn tới tệp video.
    - temp_dir: Thư mục tạm để lưu các tệp trung gian.

    Returns:
    - subtitles_path: Đường dẫn tới tệp phụ đề (định dạng .vtt).
    """
    try:
        logging.debug(f"Processing video file: {video_file_path}")

        # Lấy độ dài video
        video = VideoFileClip(video_file_path)
        duration = video.duration

        recognizer = sr.Recognizer()

        segment_length = 5  # Độ dài mỗi đoạn âm thanh (giây)
        num_segments = math.ceil(duration / segment_length)

        subtitles = []
        index = 1

        for i in range(num_segments):
            start_time = i * segment_length
            end_time = min((i + 1) * segment_length, duration)

            # Trích xuất đoạn âm thanh
            audio_segment_path = os.path.join(temp_dir, f"audio_{i}.wav")
            audio_segment = video.subclip(start_time, end_time)
            audio_segment.audio.write_audiofile(audio_segment_path, codec='pcm_s16le')

            # Nhận dạng giọng nói
            with sr.AudioFile(audio_segment_path) as source:
                audio_data = recognizer.record(source)
                try:
                    text = recognizer.recognize_google(audio_data, language='vi-VN')
                except sr.UnknownValueError:
                    text = "[Không nhận diện được]"
                except sr.RequestError as e:
                    logging.error(f"Lỗi khi nhận dạng giọng nói: {e}")
                    text = "[Lỗi nhận dạng]"

            start_time_str = format_time(start_time)
            end_time_str = format_time(end_time)

            subtitles.append(f"{index}\n{start_time_str} --> {end_time_str}\n{text}\n")
            index += 1

            # Xóa tệp âm thanh tạm
            os.remove(audio_segment_path)

        # Tạo tệp phụ đề (VTT)
        vtt_path = os.path.join(temp_dir, 'subtitles.vtt')
        with open(vtt_path, 'w', encoding='utf-8') as vtt_file:
            vtt_file.write("WEBVTT\n\n")
            vtt_file.write('\n'.join(subtitles))

        logging.debug(f"Subtitles created at: {vtt_path}")
        return vtt_path
    except Exception as e:
        logging.error(f"Lỗi khi tạo phụ đề: {e}")
        return None