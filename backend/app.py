from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Thêm dòng này để kích hoạt CORS

@app.route('/resize', methods=['POST'])
def resize_image():
    file = request.files['image']
    img = Image.open(file.stream)
    img = img.resize((300, 300))

    img_io = io.BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
