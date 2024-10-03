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
  } = useContext(ImageContext);

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
        overflow: "hidden",
      }}
    >
      {mode === "crop" ? (
        <div>
          <Cropper
            src={currentImage || imageSrc}
            style={{ maxHeight: "100%", maxWidth: "100%" }} // Kích thước cropper
            initialAspectRatio={1 / 1} // Tỷ lệ khung hình mặc định
            guides={false}
            ref={cropperRef} // Tham chiếu đến cropper
            background={false}
            onCropEnd={handleCropEnd} // Thêm sự kiện onCropEnd
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
                // change tone
              }}
            />
          )}
        </TransformComponent>
      )}
    </div>
  );
};

export default ImageDisplay;
