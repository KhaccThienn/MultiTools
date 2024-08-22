# app/utils.py

from PIL import Image
import io

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
