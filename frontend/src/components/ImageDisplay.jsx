import React, { useRef, useContext, useEffect } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css"; // Import CSS của cropperjs
import { ImageContext } from "@/context/ImageContext";
import { TransformComponent } from "react-zoom-pan-pinch"; // Sử dụng TransformComponent cho zoom

const ImageDisplay = ({ imageSrc, mode, altText = "Image" }) => {
  const {
    cropBoxData,
    cropperRef,
    currentImage,
    handleCropEnd,
    adjustmentData,
    setImageParameters,
    imageRef,
  } = useContext(ImageContext);

  useEffect(() => {
    const updateImageParameters = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const left = rect.left + window.scrollX;
        const top = rect.top + window.scrollY;
  
        setImageParameters({ width, height, left, top });
        console.log('Image Parameters:', { width, height, left, top });
      }
    };
  
    const handleImageLoad = () => {
      updateImageParameters();
    };
  
    if (imageRef.current) {
      // Nếu hình ảnh đã load trước đó, ta cập nhật luôn
      if (imageRef.current.complete) {
        updateImageParameters();
      } else {
        // Nếu chưa load, ta lắng nghe sự kiện onload
        imageRef.current.onload = handleImageLoad;
      }
  
      // Sử dụng MutationObserver để theo dõi bất kỳ thay đổi nào về kích thước ảnh
      const observer = new MutationObserver(() => {
        updateImageParameters();
      });
  
      observer.observe(imageRef.current, {
        attributes: true, // Quan sát các thay đổi thuộc tính
        attributeFilter: ['style', 'width', 'height'] // Chỉ theo dõi thay đổi liên quan đến kích thước
      });
  
      // Cleanup observer khi component unmount
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', updateImageParameters);
        window.removeEventListener('resize', updateImageParameters);
        if (imageRef.current) {
          imageRef.current.onload = null;
        }
      };
    }
  }, [currentImage]); // Chỉ chạy 1 lần khi component mount
  
  

  useEffect(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      // Cập nhật kích thước vùng crop mỗi khi cropBoxData thay đổi
      cropper.setCropBoxData({
        width: cropBoxData.width,
        height: cropBoxData.height,
      });
      // Áp dụng xoay cho hình ảnh
      cropper.rotateTo(cropBoxData.rotate);

      // Áp dụng lật ngang
      cropper.scaleX(cropBoxData.flipHorizontal ? -1 : 1);

      // Áp dụng lật dọc
      cropper.scaleY(cropBoxData.flipVertical ? -1 : 1);
    }
  }, [cropBoxData]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "10px",
        margin: "auto",
        // overflow: "hidden",
        position: "relative", // Thêm position relative để đặt nền caro
      }}
    >
      {/* Lớp nền caro hiển thị vùng trong suốt */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundSize: "5px 5px",
          backgroundImage:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      {mode === "crop" ? (
        <div>
          <Cropper
            src={currentImage || imageSrc}
            style={{ maxHeight: "100%", maxWidth: "100%" }} // Kích thước cropper
            initialAspectRatio={1 / 1} // Tỷ lệ khung hình mặc định
            guides={false}
            ref={cropperRef} // Tham chiếu đến cropper
            background={false}
            cropend={handleCropEnd} // Thêm sự kiện onCropEnd
            viewMode={1}

          />
        </div>
      ) : (
        <TransformComponent>
          {currentImage && (
            <img
              src={currentImage || imageSrc} // Hiển thị ảnh đã crop hoặc ảnh gốc nếu chưa crop
              alt={altText}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                filter: `brightness(${adjustmentData.brightness}%) saturate(${adjustmentData.saturation}%) contrast(${adjustmentData.contrast}%) hue-rotate(${adjustmentData.hue}deg) grayscale(${adjustmentData.grey_scale}%)`,
                
              }}
              ref={imageRef}
            />
          )}
        </TransformComponent>
      )}
    </div>
  );
};

export default ImageDisplay;
