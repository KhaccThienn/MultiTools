// components/ImageCropper.jsx
import { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = () => {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const cropperRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setHistory([reader.result]); 
        setRedoHistory([]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
      setImage(croppedImage);
      setHistory((prev) => [...prev, croppedImage]); // Save current state to history
      setRedoHistory([]); // Clear redo history when new crop is applied
    }
  };

  const handleUndo = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const last = newHistory.pop(); // Remove the last state
      setImage(newHistory[newHistory.length - 1] || null);
      setRedoHistory((prevRedo) => [last, ...prevRedo]); // Save the undone state to redo history
      return newHistory;
    });
  };

  const handleRedo = () => {
    setRedoHistory((prevRedo) => {
      const newRedo = [...prevRedo];
      const lastRedo = newRedo.shift(); // Remove the first state
      if (lastRedo) {
        setImage(lastRedo);
        setHistory((prev) => [...prev, lastRedo]); // Save the redone state to history
      }
      return newRedo;
    });
  };

  const handleSave = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'cropped-image.jpg'; // Change file name if needed
      link.click();
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div style={{ marginTop: '10px' }}>
        {image && (
          <div>
            <Cropper
              src={image}
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={1}
              aspectRatio={0} // Allow free aspect ratio
              guides={false}
              ref={cropperRef}
              cropBoxResizable={true} // Allow resizing of crop box
              cropBoxMovable={true} // Allow moving of crop box
            />
            <button onClick={handleCrop}>Crop Image</button>
            <button onClick={handleUndo} disabled={history.length <= 1}>Undo</button>
            <button onClick={handleRedo} disabled={redoHistory.length === 0}>Redo</button>
            <button onClick={handleSave} disabled={!image}>Save Image</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
