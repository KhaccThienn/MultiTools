# app/routes.py

import base64
from io import BytesIO
import logging
import os
import tempfile
import threading
import time
from tkinter import Image
import uuid
from flask import Blueprint,request, send_file, jsonify,current_app,send_from_directory, after_this_request
from .utils import apply_video_adjustments, change_background, convert_image, download_and_convert_playlist_to_mp3, download_soundcloud, download_youtube_mp4, generate_image_from_text, generate_subtitles, generate_subtitles_premium, resize_image, crop_image, remove_object, process_crop, remove_background, trim_video
import shutil
import json  # Import json module
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

@bp.route('/text-to-image', methods=['POST'])
def text_to_image_route():
    print("Request received")
    data = request.get_json()
    text_prompt = data.get('text', '')
    
    if not text_prompt:
        return jsonify({"error": "Text prompt is required"}), 400

    # Call the utility function to generate the image
    base64_image = generate_image_from_text(text_prompt)
    
    if base64_image:
        return jsonify({"image": base64_image})
    else:
        return jsonify({"error": "Failed to generate image"}), 500

def delete_file_after_delay(file_path, delay):
    """Deletes the specified file after a delay (in seconds)."""
    time.sleep(delay)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"File {file_path} deleted after {delay} seconds.")
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")

@bp.route('/download', methods=['POST'])
def download_playlist():
    data = request.get_json()
    url = data.get('url')
    output_folder = './assets/audios'
    
    if not url:
        return jsonify({'error': 'Thiếu URL playlist'}), 400

    os.makedirs(output_folder, exist_ok=True)
    temp_folder = tempfile.mkdtemp(dir=output_folder)

    try:
        download_and_convert_playlist_to_mp3(url, temp_folder)
        zip_file_path = shutil.make_archive(temp_folder, 'zip', temp_folder)
        zip_file_name = os.path.basename(zip_file_path)
        shutil.rmtree(temp_folder)

        # Start a thread to delete the zip file after 1 hour (3600 seconds)
        threading.Thread(target=delete_file_after_delay, args=(zip_file_path, 3600), daemon=True).start()

        return jsonify({'download_link': f'{zip_file_name}'})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'Failed to process playlist'}), 500

@bp.route('/dowload-youtube-mp4', methods=['POST'])
def download_youtube_mp4_route():
    data = request.get_json()
    url = data.get('url')
    output_folder = './assets/videos'

    if not url:
        return jsonify({'error': 'Thiếu URL video'}), 400

    os.makedirs(output_folder, exist_ok=True)
    temp_folder = tempfile.mkdtemp(dir=output_folder)

    try:
        download_youtube_mp4(url, temp_folder)
        zip_file_path = shutil.make_archive(temp_folder, 'zip', temp_folder)
        zip_file_name = os.path.basename(zip_file_path)
        shutil.rmtree(temp_folder)

        # Start a thread to delete the zip file after 1 hour (3600 seconds)
        threading.Thread(target=delete_file_after_delay, args=(zip_file_path, 3600), daemon=True).start()

        return jsonify({'download_link': f'{zip_file_name}'})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'Failed to process playlist'}), 500

@bp.route('/download-youtube-mp4/<filename>')
def download_youtube_mp4_file(filename):
    file_path = f'D:\\Projects\\multi_tools\\backend\\assets\\videos\\{filename}'
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

@bp.route('/download/<filename>')
def download_file(filename):
    file_path = f'D:\\Projects\\multi_tools\\backend\\assets\\audios\\{filename}'
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

@bp.route('/download-soundcloud', methods=['POST'])
def download_soundcloud_mp3_route():
    data = request.get_json()
    url = data.get('url')
    output_folder = './assets/soundcloud'

    if not url:
        return jsonify({'error': 'Thiếu URL media'}), 400

    os.makedirs(output_folder, exist_ok=True)

    try:
        # Tải xuống SoundCloud media
        temp_folder = download_soundcloud(url, output_folder)
        
        # Tạo một tệp zip từ các tệp đã tải xuống
        zip_file_path = shutil.make_archive(temp_folder, 'zip', temp_folder)
        zip_file_name = os.path.basename(zip_file_path)
        shutil.rmtree(temp_folder)  # Xóa thư mục tạm sau khi tạo zip

        # Bắt đầu một luồng để xóa tệp zip sau 1 giờ (3600 giây)
        threading.Thread(target=delete_file_after_delay, args=(zip_file_path, 3600), daemon=True).start()

        # Trả về đường dẫn tải xuống (có thể cần thêm URL server để tạo đường dẫn đầy đủ)
        return jsonify({'download_link': zip_file_name})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'Failed to process the download request'}), 500

@bp.route('/download-soundcloud/<filename>')
def serve_soundcloud_zip(filename):
    file_path = f'D:\\Projects\\multi_tools\\backend\\assets\\soundcloud\\{filename}'
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

@bp.route('/generate-subtitles', methods=['POST'])
def generate_subtitles_route():
    """
    API route để tạo phụ đề cho video.
    """
    temp_dir = tempfile.mkdtemp()
    try:
        video_path = None
        if 'video' in request.files:
            video_file = request.files['video']
            if video_file.filename == '':
                return jsonify({'error': 'Không có tệp video được chọn'}), 400
            # Lưu tệp video tạm thời
            video_path = os.path.join(temp_dir, video_file.filename)
            video_file.save(video_path)
        elif 'video_url' in request.form:
            video_url = request.form['video_url']
            # Tải video từ URL
            video_response = requests.get(video_url, stream=True)
            if video_response.status_code != 200:
                return jsonify({'error': 'Không thể tải video từ URL'}), 400
            video_path = os.path.join(temp_dir, 'video.mp4')
            with open(video_path, 'wb') as f:
                for chunk in video_response.iter_content(chunk_size=8192):
                    f.write(chunk)
        else:
            return jsonify({'error': 'Thiếu tệp video hoặc URL'}), 400

        # Gọi hàm generate_subtitles từ utils.py
        subtitles_path = generate_subtitles(video_path, temp_dir)

        if subtitles_path:
            # Đảm bảo xóa thư mục tạm sau khi phản hồi được gửi
            @after_this_request
            def remove_temp_dir(response):
                try:
                    shutil.rmtree(temp_dir)
                except Exception as e:
                    logging.error(f"Lỗi khi xóa thư mục tạm {temp_dir}: {e}")
                return response

            # Gửi tệp phụ đề cho client 
            return send_file(
                subtitles_path,
                as_attachment=True,
                download_name='subtitles.vtt',  # Thay 'attachment_filename' bằng 'download_name'
                mimetype='text/vtt'  # Đảm bảo đặt mimetype đúng cho VTT
            )
        else:
            return jsonify({'error': 'Lỗi khi tạo phụ đề'}), 500
    except Exception as e:
        logging.error(f"Lỗi khi xử lý yêu cầu tạo phụ đề: {e}")
        return jsonify({'error': 'Lỗi máy chủ'}), 500
    

@bp.route('/generate-subtitles-premium', methods=['POST'])
def generate_subtitles_premium_route():
    """
    API route để tạo phụ đề cho video.
    """
    temp_dir = tempfile.mkdtemp()
    try:
        video_path = None
        if 'video' in request.files:
            video_file = request.files['video']
            if video_file.filename == '':
                return jsonify({'error': 'Không có tệp video được chọn'}), 400
            # Lưu tệp video tạm thời
            video_path = os.path.join(temp_dir, video_file.filename)
            video_file.save(video_path)
        elif 'video_url' in request.form:
            video_url = request.form['video_url']
            # Tải video từ URL
            video_response = requests.get(video_url, stream=True)
            if video_response.status_code != 200:
                return jsonify({'error': 'Không thể tải video từ URL'}), 400
            video_path = os.path.join(temp_dir, 'video.mp4')
            with open(video_path, 'wb') as f:
                for chunk in video_response.iter_content(chunk_size=8192):
                    f.write(chunk)
        else:
            return jsonify({'error': 'Thiếu tệp video hoặc URL'}), 400

        subtitles_path = generate_subtitles_premium(video_path, temp_dir)

        if subtitles_path:
            # Clean up temporary directory after response
            @after_this_request
            def remove_temp_dir(response):
                try:
                    shutil.rmtree(temp_dir)
                except Exception as e:
                    logging.error(f"Lỗi khi xóa thư mục tạm {temp_dir}: {e}")
                return response

            # Send the subtitles file to the client
            return send_file(
                subtitles_path,
                as_attachment=True,
                download_name='subtitles.vtt',
                mimetype='text/vtt'
            )
        else:
            return jsonify({'error': 'Lỗi khi tạo phụ đề'}), 500
    except Exception as e:
        logging.error(f"Lỗi khi xử lý yêu cầu tạo phụ đề: {e}")
        return jsonify({'error': 'Lỗi máy chủ'}), 500
    
from flask import Blueprint, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from .utils import merge_video_with_subtitles


# Sử dụng thư mục hiện tại chứa file script
BASE_DIR = os.getcwd()

ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov'}
ALLOWED_SUBTITLE_EXTENSIONS = {'vtt', 'srt'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@bp.route('/merge-video', methods=['POST'])
def merge_video():
    logging.info("Received a request to /merge-video")
    logging.debug(f"request.files: {request.files}")
    logging.debug(f"request.form: {request.form}")

    if 'video' not in request.files or 'subtitles' not in request.files:
        logging.error("Missing video or subtitles in request.files")
        return jsonify({"error": "Missing video or subtitles file"}), 400

    video = request.files['video']
    subtitles = request.files['subtitles']

    # Kiểm tra xem file có hợp lệ không
    if video.filename == '' or subtitles.filename == '':
        logging.error("Empty filename for video or subtitles")
        return jsonify({"error": "Empty filename for video or subtitles"}), 400

    # Kiểm tra định dạng file
    if not allowed_file(video.filename, ALLOWED_VIDEO_EXTENSIONS):
        logging.error("Unsupported video file type")
        return jsonify({"error": "Unsupported video file type"}), 400

    if not allowed_file(subtitles.filename, ALLOWED_SUBTITLE_EXTENSIONS):
        logging.error("Unsupported subtitles file type")
        return jsonify({"error": "Unsupported subtitles file type"}), 400

    logging.info(f"Received video: {video.filename}")
    logging.info(f"Received subtitles: {subtitles.filename}")

    # An toàn hơn khi lưu tên file
    video_filename = secure_filename(video.filename)
    subtitles_filename = secure_filename(subtitles.filename)

    # Sử dụng thư mục hiện tại chứa script
    video_path = os.path.join(BASE_DIR, video_filename)
    # subtitles_path là thư mục chứa thư mục BASE_DIR


    subtitles_path = os.path.join(BASE_DIR, subtitles_filename)
    output_filename = f"output_{video_filename}"
    output_path = os.path.join(BASE_DIR, output_filename)

    # Lưu file lên server
    video.save(video_path)
    subtitles.save(subtitles_path)
    logging.info(f"Saved video to {video_path}")
    logging.info(f"Saved subtitles to {subtitles_path}")

    # Gọi hàm hợp nhất video và phụ đề
    success, message = merge_video_with_subtitles(video_path, subtitles_filename, output_path)

    if success:
        if not os.path.exists(output_path):
            logging.error(f"Merged video file does not exist at {output_path}")
            return jsonify({"error": "Merged video file not found"}), 500
        logging.info(f"Merge successful: {output_path}")
        
        # Sử dụng after_this_request để xóa tệp sau khi gửi
        @after_this_request
        def cleanup(response):
            try:
                os.remove(video_path)
                os.remove(subtitles_path)
                os.remove(output_path)
                logging.info("Deleted video, subtitles, and output files after sending.")
            except Exception as cleanup_error:
                logging.error(f"Error cleaning up files: {cleanup_error}")
            return response

        try:
            return send_file(
                output_path,
                mimetype='video/mp4',
                as_attachment=True,
                download_name=output_filename  # Sử dụng download_name thay vì attachment_filename
            )
        except Exception as e:
            logging.exception(f"Error sending file: {e}")
            return jsonify({"error": "Failed to send merged video file", "details": str(e)}), 500

import ffmpeg
import logging

# Setup Logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)      

@bp.route('/apply-adjustment', methods=['POST'])
def apply_adjustment_route():
    """
    API route to apply adjustments to a video.

    Expects:
    - 'video' in request.files: The video file to be adjusted.
    - 'adjustmentData' in request.form: JSON string containing adjustment parameters.

    Returns:
    - Adjusted video file as a downloadable attachment.
    """
    logger.info("Received request to /apply-adjustment")

    # Validate presence of 'video' and 'adjustmentData'
    if 'video' not in request.files or 'adjustmentData' not in request.form:
        logger.error("Missing 'video' or 'adjustmentData' in the request")
        return jsonify({'error': 'Thiếu video hoặc dữ liệu điều chỉnh'}), 400

    video_file = request.files['video']
    adjustment_data_str = request.form['adjustmentData']

    # Validate filename
    if video_file.filename == '':
        logger.error("No selected video file")
        return jsonify({'error': 'No selected video file'}), 400

    # Parse adjustment data
    try:
        adjustment_data = json.loads(adjustment_data_str)
        logger.debug(f"Adjustment data received: {adjustment_data}")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON for 'adjustmentData': {str(e)}")
        return jsonify({'error': 'Invalid JSON for adjustmentData'}), 400

    # Define absolute output folder
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Adjust based on project structure
    output_folder = os.path.join(BASE_DIR, 'assets', 'adjusted_videos')
    os.makedirs(output_folder, exist_ok=True)
    logger.debug(f"Output folder set to: {output_folder}")

    # Generate unique filenames
    file_id = str(uuid.uuid4())
    # Extract file extension from original filename
    _, ext = os.path.splitext(secure_filename(video_file.filename))
    input_filename = f"{file_id}_input{ext}"
    output_filename = f"{file_id}_adjusted.mp4"
    input_path = os.path.join(output_folder, input_filename)
    output_path = os.path.join(output_folder, output_filename)

    logger.debug(f"Input Path: {input_path}")
    logger.debug(f"Output Path: {output_path}")

    try:
        # Save the uploaded video to the temporary input path
        video_file.save(input_path)
        logger.info(f"Saved original video to {input_path}")

        # Apply video adjustments
        apply_video_adjustments(input_path, adjustment_data, output_path)
        logger.info(f"Applied adjustments and saved adjusted video to {output_path}")

        # Define the cleanup function before sending the file
        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(output_path):
                    os.remove(output_path)
                    logger.info(f"Deleted adjusted video at {output_path}")
                else:
                    logger.warning(f"Adjusted video file not found for deletion: {output_path}")
            except Exception as e:
                logger.error(f"Failed to delete adjusted video: {str(e)}")
            return response

        # Send the adjusted video back to the client
        logger.info(f"Sending adjusted video {output_path} to client")
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name=f"adjusted_{video_file.filename}"
        )

    except Exception as e:
        logger.exception(f"Error applying adjustments: {str(e)}")
        return jsonify({'error': 'Failed to apply adjustments', 'details': str(e)}), 500

    finally:
        # Clean up the temporary input file
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
                logger.info(f"Deleted temp input file: {input_path}")
            else:
                logger.warning(f"Temp input file not found for deletion: {input_path}")
        except Exception as e:
            logger.error(f"Failed to delete temp input file: {str(e)}")





# Determine the absolute path to the 'assets/temp_trimmed_videos' directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Goes up two levels from 'routes.py'
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'assets', 'temp_trimmed_videos')
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@bp.route('/trim-video/', methods=['POST'])
def trim_video_route():
    """
    Endpoint to trim video.

    Requirements:
    - video: Original video file (multipart/form-data)
    - trim_start: Start time in seconds (form-data)
    - trim_end: End time in seconds (form-data)

    Returns:
    - Trimmed video file
    """
    logger.info("Received request to /trim-video/")

    # Validate presence of 'video' in files
    if 'video' not in request.files:
        logger.error("No video part in the request")
        return jsonify({"error": "No video part in the request"}), 400

    video_file = request.files['video']

    # Validate filename
    if video_file.filename == '':
        logger.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    # Parse trim_start and trim_end
    try:
        trim_start = float(request.form.get('trim_start', 0))
        trim_end = float(request.form.get('trim_end', 0))
        logger.debug(f"Trim parameters - Start: {trim_start}, End: {trim_end}")
    except ValueError:
        logger.error("Invalid trim_start or trim_end value")
        return jsonify({"error": "Invalid trim_start or trim_end value"}), 400

    # Validate trim times
    if trim_start < 0 or trim_end <= trim_start:
        logger.error("Invalid trim_start and trim_end values")
        return jsonify({"error": "Invalid trim_start and trim_end values"}), 400

    # Check if the uploaded file is a video
    if not video_file.content_type.startswith("video/"):
        logger.error("Uploaded file is not a video")
        return jsonify({"error": "Uploaded file is not a video"}), 400

    # Generate unique filenames
    file_id = str(uuid.uuid4())
    input_filename = secure_filename(f"{file_id}_input{os.path.splitext(video_file.filename)[1]}")
    output_filename = secure_filename(f"{file_id}_trimmed.mp4")
    input_path = os.path.join(OUTPUT_FOLDER, input_filename)
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    logger.debug(f"Input Path: {input_path}")
    logger.debug(f"Output Path: {output_path}")

    # Save the original video to the temporary directory
    try:
        video_file.save(input_path)
        logger.info(f"Saved original video to {input_path}")
    except Exception as e:
        logger.exception(f"Failed to save uploaded video: {str(e)}")
        return jsonify({"error": f"Failed to save uploaded video: {str(e)}"}), 500

    # Perform the trimming operation
    try:
        trim_video(input_path, output_path, trim_start, trim_end)
        logger.info(f"Trimmed video saved to {output_path}")
    except ffmpeg.Error as e:
        error_message = e.stderr.decode()
        logger.error(f"FFmpeg trimming failed: {error_message}")
        # Cleanup input file
        try:
            os.remove(input_path)
            logger.debug(f"Removed original video at {input_path}")
        except Exception as cleanup_error:
            logger.error(f"Failed to delete original video: {cleanup_error}")
        return jsonify({"error": f"FFmpeg trimming failed: {error_message}"}), 500
    except Exception as e:
        logger.exception(f"Unexpected error during trimming: {str(e)}")
        # Cleanup input file
        try:
            os.remove(input_path)
            logger.debug(f"Removed original video at {input_path}")
        except Exception as cleanup_error:
            logger.error(f"Failed to delete original video: {cleanup_error}")
        return jsonify({"error": "Error trimming video"}), 500

    # Remove the original video after trimming
    try:
        os.remove(input_path)
        logger.info(f"Removed original video at {input_path}")
    except Exception as e:
        logger.error(f"Failed to delete original video: {str(e)}")

    # Define the cleanup function before sending the file
    @after_this_request
    def cleanup(response):
        try:
            os.remove(output_path)
            logger.info(f"Removed trimmed video at {output_path}")
        except Exception as e:
            logger.error(f"Failed to delete trimmed video: {str(e)}")
        return response

    # Send the trimmed video back to the client
    try:
        logger.info(f"Sending trimmed video {output_path} to client")
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name=f"trimmed_{video_file.filename}"  # Use 'download_name' for Flask >=2.0
        )
    except Exception as e:
        logger.exception(f"Failed to send trimmed video: {str(e)}")
        return jsonify({"error": "Failed to send trimmed video", "details": str(e)}), 500