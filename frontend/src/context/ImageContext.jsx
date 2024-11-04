import React, { createContext, useState, useRef, useEffect } from "react";
import axios from "axios"; // Import axios

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const cropperRef = useRef(null);

  const [history, setHistory] = useState([]); // Lưu trữ lịch sử các trạng thái ảnh
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ mục trạng thái hiện tại
  const [imageParameters, setImageParameters] = useState(null);
  const imageRef = useRef(null);
  const [modeE, setModeE] = useState(""); // State để quản lý mode

  const defaultCropBoxData = {
    width: 100,
    height: 100,
    rotate: 0,
    flipHorizontal: false,
    flipVertical: false,
    aspectRatio: 3 / 4,
  };

  const [cropBoxData, setCropBoxData] = useState(defaultCropBoxData);
  const [croppedImage, setCroppedImage] = useState(null); // Lưu trữ ảnh đã crop

  const defaultAdjustmentData = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    grey_scale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
  };

  const [adjustmentData, setAdjustmentData] = useState(defaultAdjustmentData);

  const updateAdjustmentData = (name, value) => {
    setAdjustmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetAdjustmentData = () => {
    setAdjustmentData(defaultAdjustmentData);
  };

  // Hàm cập nhật giá trị vùng crop
  const updateCropBoxData = (name, value) => {
    setCropBoxData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAspectRatioChange = () => {
    const cropper = cropperRef.current?.cropper;
    const value = cropBoxData.aspectRatio;
    console.log("Tỷ lệ cố định:", value);

    if (cropper) {
      let aspectRatio;

      // Nếu giá trị là "NaN" thì bỏ qua tỷ lệ cố định
      if (value === "NaN") {
        aspectRatio = NaN;
      } else if (typeof value === "string" && value.includes(":")) {
        // Chia tách chuỗi tỷ lệ, ví dụ "3:4"
        const ratioParts = value.split(":");

        // Tính tỷ lệ aspect ratio
        aspectRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
      } else if (typeof value === "number") {
        aspectRatio = value;
      } else {
        console.error("Giá trị tỷ lệ không hợp lệ:", value);
        return;
      }

      // Đặt aspect ratio cho Cropper
      cropper.setAspectRatio(aspectRatio);
    }
  };

  const handleAdjustment = () => {
    if (!currentImage) {
      console.error("Không có hình ảnh để chỉnh sửa");
      return;
    }

    // Log giá trị của bộ lọc để kiểm tra trước khi áp dụng
    console.log("Giá trị bộ lọc hiện tại:", adjustmentData);

    const img = new Image();
    img.src = currentImage; // Đảm bảo sử dụng ảnh hiện tại
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      // Kiểm tra giá trị của bộ lọc trước khi áp dụng
      ctx.filter = `brightness(${adjustmentData.brightness}%)
        contrast(${adjustmentData.contrast}%)
        saturate(${adjustmentData.saturation}%)
        hue-rotate(${adjustmentData.hue}deg)
        grayscale(${adjustmentData.grey_scale}%)`;
      console.log("Đang áp dụng bộ lọc:", ctx.filter);

      // Vẽ lại hình ảnh với bộ lọc đã áp dụng
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const updatedImageURL = canvas.toDataURL("image/jpeg");

      // Cập nhật lại hình ảnh mới
      const updatedHistory = [
        ...history.slice(0, currentIndex + 1),
        updatedImageURL,
      ];
      setHistory(updatedHistory);
      setCurrentIndex(updatedHistory.length - 1);
      setAdjustmentData(defaultAdjustmentData);
    };
  };

  const handleRemoveBackground = async () => {
    const imageDataUrl = currentImage;
    if (!imageDataUrl) {
      console.error("Không có hình ảnh để xử lý");
      return;
    }

    // Hàm chuyển đổi Blob URL thành chuỗi base64
    const getBase64FromUrl = async (blobUrl) => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    try {
      const imageBase64 = await getBase64FromUrl(imageDataUrl);
      const imageBase64WithoutPrefix = imageBase64.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );

      // Gửi yêu cầu tới server để xóa nền
      const response = await axios.post(
        "http://localhost:5000/remove-background",
        {
          image: imageBase64WithoutPrefix,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { output_image } = response.data;

      // Cập nhật hình ảnh trong state
      const updatedHistory = [
        ...history.slice(0, currentIndex + 1),
        output_image,
      ];
      setHistory(updatedHistory);
      setCurrentIndex(updatedHistory.length - 1);
    } catch (error) {
      console.error(
        "Lỗi khi xóa nền hình ảnh:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleChangeBackground = async (backgroundType, backgroundValue) => {
    console.log("Bắt đầu handleChangeBackground");
    console.log("backgroundType:", backgroundType);
    console.log("backgroundValue:", backgroundValue);
    const imageDataUrl = currentImage;
    if (!imageDataUrl) {
      console.error("Không có hình ảnh để xử lý");
      return;
    }
  
    // Hàm chuyển đổi Blob URL thành chuỗi base64
    const getBase64FromUrl = async (blobUrl) => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
  
    try {
      const imageBase64 = await getBase64FromUrl(imageDataUrl);
      const imageBase64WithoutPrefix = imageBase64.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );
  
      // Gửi yêu cầu tới server để thay đổi nền
      const response = await axios.post(
        "http://localhost:5000/change-background",
        {
          image: imageBase64WithoutPrefix,
          backgroundType: backgroundType,
          backgroundValue: backgroundValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const { output_image } = response.data;
  
      // Cập nhật hình ảnh trong state
      const updatedHistory = [
        ...history.slice(0, currentIndex + 1),
        output_image,
      ];
      setHistory(updatedHistory);
      setCurrentIndex(updatedHistory.length - 1);
      console.log("Kết thúc handleChangeBackground");
    } catch (error) {
      console.error(
        "Lỗi khi thay đổi nền hình ảnh:",
        error.response?.data?.error || error.message
      );
    }
  };
  
  // Hàm cập nhật cropBoxData từ cropper khi người dùng thay đổi vùng crop
  const updateCropBoxDataFromCropper = (data) => {
    setCropBoxData((prevData) => ({
      ...prevData,
      width: data.width,
      height: data.height,
      rotate: data.rotate || 0,
      flipHorizontal: data.scaleX < 0,
      flipVertical: data.scaleY < 0,
    }));
  };

  const getImageParameters = () => {
    if (imageParameters) {
      return imageParameters;
    } else {
      console.error("Image parameters not available");
      return null;
    }
  };


  const handleRetouchSkin = async (retouchDegree = 1.45, whiteningDegree = 1.45) => {
    const imageDataUrl = currentImage;
    if (!imageDataUrl) {
      console.error("Không có hình ảnh để xử lý");
      return;
    }
  
    try {
      // Fetch the Blob from the imageDataUrl
      const response = await fetch(imageDataUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }
      const blob = await response.blob();
  
      // Create a FormData object to prepare the multipart/form-data request
      const formData = new FormData();
      formData.append("image", blob, "image.jpg"); // Append the image as a file
      formData.append("retouch_degree", retouchDegree);
      formData.append("whitening_degree", whiteningDegree);
  
      // Send the request to the API
      const apiResponse = await fetch(
        "https://www.ailabapi.com/api/portrait/effects/smart-skin",
        {
          method: "POST",
          headers: {
            "ailabapi-api-key": "mBIkJX1MhD2i1PrUzyHMcq3i35FlbdDHZCGjtsmsaRVBCgApKa7xOYz6lrvXyQWL",
            // Note: 'Content-Type' should NOT be set explicitly for FormData. 
            // The browser will automatically set the appropriate 'Content-Type' boundary.
          },
          body: formData,
        }
      );
  
      if (!apiResponse.ok) {
        console.error(`API Error: Status ${apiResponse.status} - ${apiResponse.statusText}`);
        throw new Error("Network response was not ok");
      }
  
      const result = await apiResponse.json();
      const output_image = result.data.image_url;
  
      // Update the image in state
      const updatedHistory = [...history.slice(0, currentIndex + 1), output_image];
      setHistory(updatedHistory);
      setCurrentIndex(updatedHistory.length - 1);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  
    

  // Hàm xử lý sự kiện cropend
  const handleCropEnd = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      // Lấy giá trị vùng crop sau khi thả chuột
      const cropBoxData = cropper.getCropBoxData();

      // Bạn có thể sử dụng cropBoxData hoặc lưu vào state để xử lý sau này
      const { width, height, left, top } = cropBoxData;
      updateCropBoxData("width", width);
      updateCropBoxData("height", height);
    } else {
      console.error("Không tìm thấy cropper");
    }
  };

  // Hàm reset để đưa trạng thái về mặc định
  const resetCropBoxData = () => {
    setCropBoxData(defaultCropBoxData);
    setCroppedImage(null); // Xóa ảnh cũ khi nhấn hủy
  };

  const applyEdit = (newImage) => {
    const updatedHistory = [...history.slice(0, currentIndex + 1), newImage];
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  const useHistory = (initialState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initialState]);

    const setState = (action, overwrite = false) => {
      const newState =
        typeof action === "function" ? action(history[index]) : action;
      if (overwrite) {
        const historyCopy = [...history];
        historyCopy[index] = newState;
        setHistory(historyCopy);
      } else {
        const updatedState = [...history].slice(0, index + 1);
        setHistory([...updatedState, newState]);
        setIndex((prev) => prev + 1);
      }
    };

    const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
    const redo = () =>
      index < history.length - 1 && setIndex((prevState) => prevState + 1);
    return [history[index], setState, undo, redo];
  };

  const [elements, setElements, undoE, redoE] = useHistory([]);

  const undo = () => {
    if (modeE === "paint") {
      undoE();
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const redo = () => {
    if (modeE === "paint") {
      redoE();
    } else {
      if (currentIndex < history.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  // Hàm áp dụng thay đổi và cắt ảnh
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas(); // Lấy canvas của ảnh đã crop
      if (croppedCanvas) {
        const croppedImageURL = croppedCanvas.toDataURL("image/jpeg"); // Lấy URL của ảnh
        setCroppedImage(croppedImageURL); // Lưu URL của ảnh đã cắt vào state
        const updatedHistory = [
          ...history.slice(0, currentIndex + 1),
          croppedImageURL,
        ];
        setHistory(updatedHistory);
        setCurrentIndex(updatedHistory.length - 1);
      }
    }
  };

  // Hàm để hợp nhất hình ảnh với những gì đã vẽ
  const mergeDrawingWithImage = (mergedImageDataURL) => {
    if (!mergedImageDataURL) {
      console.error("Không có dữ liệu hình ảnh để hợp nhất");
      return;
    }

    // Cập nhật history và currentIndex
    const updatedHistory = [
      ...history.slice(0, currentIndex + 1),
      mergedImageDataURL,
    ];
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  // Lấy currentImage từ history hoặc null nếu không có ảnh nào
  const currentImage =
    history.length > 0 && currentIndex !== -1 ? history[currentIndex] : null;
  // Hàm để thiết lập hình ảnh ban đầu
  const setInitialImage = (imageUrl) => {
    setHistory([imageUrl]); // Khởi tạo history với hình ảnh mới
    setCurrentIndex(0); // Đặt currentIndex về 0
  };

  const handleDownload = ({ imageName, imageFormat }) => {
    const link = document.createElement("a");

    // Xử lý tên file và định dạng
    const fileName = `${imageName || "edited-image"}.${imageFormat}`;
    link.download = fileName;

    const imgSrc = currentImage; // Replace 'currentImage' with your actual variable
    // Tạo một canvas để chuyển đổi ảnh sang định dạng người dùng chọn
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Handle CORS issues if necessary
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Convert image format
      const mimeType = `image/${imageFormat || "jpeg"}`;
      const imageDataURL = canvas.toDataURL(mimeType);
      link.href = imageDataURL;
      link.click();
    };

    img.onerror = (err) => {
      console.error("Error loading image:", err);
    };

    img.src = imgSrc;
  };

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle API Text to Image
  const handleTextToImage = async (text) => {
    // Define the local backend API endpoint
    const invokeUrl = "http://localhost:5000/text-to-image";  // Change this if the backend URL is different

    try {
        const response = await fetch(invokeUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })  // Send the text as JSON
        });

        if (!response.ok) {
            throw new Error('Failed to generate image');
        }

        const responseBody = await response.json();
        const base64String = responseBody.image;

        // Convert Base64 to Blob
        const imageData = atob(base64String);
        const byteNumbers = new Array(imageData.length);
        for (let i = 0; i < imageData.length; i++) {
            byteNumbers[i] = imageData.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        // Convert blob to image
        const url = URL.createObjectURL(blob);
        // Save the generated image to history
        const updatedHistory = [...history.slice(0, currentIndex + 1), url];
        setHistory(updatedHistory);
        setCurrentIndex(updatedHistory.length - 1);
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <ImageContext.Provider
      value={{
        cropBoxData,
        imageRef,
        updateCropBoxData,
        resetCropBoxData,
        handleCrop,
        handleAspectRatioChange,
        currentImage, // Ảnh đã cắt để hiển thị
        cropperRef, // Tham chiếu đến cropper
        handleCropEnd, // Hàm xử lý sự kiện cropend
        undo,
        redo,
        applyEdit,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        handleRemoveBackground,
        handleChangeBackground,
        setInitialImage, // Thêm hàm này vào context
        adjustmentData,
        updateAdjustmentData,
        resetAdjustmentData,
        handleAdjustment,
        setImageParameters,
        getImageParameters,
        mergeDrawingWithImage,
        useHistory,
        elements,
        setElements,
        undoE,
        redoE,
        setModeE,
        handleDownload,
        setDimensions,
        dimensions,
        handleRetouchSkin,
        handleTextToImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
