import React, { useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Crop = ({ image, onCrop, onUndo, onRedo, onSave, left, top, width, height }) => {
  const cropperRef = useRef(null); // Sử dụng ref để truy cập Cropper instance

  // Hàm xử lý crop ảnh
  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const croppedImageDataUrl = cropper.getCroppedCanvas().toDataURL(); // Lấy ảnh sau khi crop
    onCrop(croppedImageDataUrl); // Gọi callback để truyền dữ liệu ảnh đã crop lên component cha
  };

  // Hàm xử lý sự kiện 'ready' khi ảnh đã sẵn sàng trong Cropper
  const handleCropperReady = () => {
    const cropper = cropperRef.current.cropper;
    if (cropper) {
      // Thiết lập crop box để phù hợp với ảnh
      cropper.setCropBoxData({
        left: left, // Sử dụng giá trị được truyền từ component cha
        top: top, // Sử dụng giá trị được truyền từ component cha
        width: width || cropper.getImageData().naturalWidth / 2, // Nếu width không được truyền, sử dụng kích thước mặc định
        height: height || cropper.getImageData().naturalHeight / 2, // Nếu height không được truyền, sử dụng kích thước mặc định
      });

      // Thiết lập canvas data để focus vào trung tâm của ảnh
      cropper.setCanvasData({
        left: 0, // Thiết lập vị trí canvas theo nhu cầu
        top: 0, // Thiết lập vị trí canvas theo nhu cầu
      });
    }
  };

  return (
    <div>
      <Cropper
        src={image} // Dữ liệu ảnh được truyền từ editImagePage
        style={{ height: 400, width: '100%' }}
        // Cropper.js options
        initialAspectRatio={16 / 9}
        guides={true}
        ref={cropperRef} // Gán ref vào Cropper để truy cập các phương thức
        viewMode={1} // Chế độ view để crop chỉ nằm trong khu vực của canvas
        autoCropArea={1} // Thiết lập vùng crop mặc định
        ready={handleCropperReady} // Sự kiện 'ready' được gọi khi ảnh đã sẵn sàng
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleCrop} style={buttonStyle}>
          Crop
        </button>
        <button onClick={onUndo} style={buttonStyle}>
          Undo
        </button>
        <button onClick={onRedo} style={buttonStyle}>
          Redo
        </button>
        <button onClick={() => onSave(cropperRef.current.cropper.getCroppedCanvas().toDataURL())} style={buttonStyle}>
          Save
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 15px',
  marginRight: '10px',
  borderRadius: '5px',
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
};

export default Crop;
