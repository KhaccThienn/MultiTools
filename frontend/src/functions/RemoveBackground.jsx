import React, { useContext, useState } from "react";
import { ImageContext } from "@/context/ImageContext";
import "../css/menuEditor.css";
import { FaRobot, FaTimes, FaSpinner } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function RemoveBackground() {
  const { handleRemoveBackground, handleChangeBackground } =
    useContext(ImageContext);
  const [loading, setLoading] = useState(false);
  const [backgroundType, setBackgroundType] = useState("color"); // 'color' hoặc 'image'
  const [backgroundValue, setBackgroundValue] = useState("#ffffff"); // Màu trắng mặc định hoặc URL ảnh
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(true);

  const menuOptionChange = [
    { id: "color", value: "Màu sắc" },
    { id: "image", value: "Ảnh nền" },
  ];

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleRemoveBackground();
    } catch (error) {
      console.error("Lỗi khi xóa nền:", error);
    }
    setLoading(false);
  };

  const handleApplyBackground = async () => {
    setLoading(true);
    try {
      await handleChangeBackground(backgroundType, backgroundValue);
    } catch (error) {
      console.error("Lỗi khi thay đổi nền:", error);
    }
    setLoading(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setBackgroundValue(base64); // Lưu chuỗi Base64 để gửi lên server hoặc sử dụng làm hình nền
      console.log("Background Image Base64:", base64);
    }
  };

  // Hàm chuyển đổi tệp thành chuỗi Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <section className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Xóa nền
        <button onClick={() => {}} className="icon-cancel" id="icon-cancel">
          <FaTimes />
        </button>
      </div>
      <div className="splitter"></div>
      <div className="box--basic" onClick={handleClick}>
        {loading ? (
          <>
            <FaSpinner className="removebg-icon spinner" /> Đang xóa nền...
          </>
        ) : (
          <>
            <FaRobot className="removebg-icon" /> Xóa nền cơ bản
          </>
        )}
      </div>

      {showBackgroundOptions && (
        <div id="crop-content" className="tool-content ">
          <div className="tool-detail">
            <div className="group group1 box_remove">
              <span>Thay đổi nền</span>
              <select
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value)}
              >
                <option value="color">Màu sắc</option>
                <option value="image">Ảnh nền</option>
              </select>
              {/* <div className="auto_complete">
                <Autocomplete
                  label="Chế độ bạn chọn"
                  placeholder="Search..."
                  className="auto_complete_item"
                  defaultItems={menuOptionChange}
                  listboxProps={{
                    emptyContent: "Your own empty content text.",
                  }}
                  selectedKey={backgroundType}
                  onSelectionChange={setBackgroundType}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id} value={item.id}>
                      {item.value}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div> */}

              {backgroundType === "color" ? (
                <div className="box__color">
                  <input
                    type="color"
                    value={backgroundValue}
                    onChange={(e) => setBackgroundValue(e.target.value)}
                    className="input__color"
                  />
                  <FaAngleDown />
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
              {backgroundValue && (
                <img
                  src={backgroundValue}
                  alt="Preview"
                  style={{ maxWidth: "100%" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="bottom-content">
        <div className="action-btn">
          <button id="crop-action-cancel" onClick={{}}>
            Hủy
          </button>
          <button id="crop-action-apply" onClick={handleApplyBackground}>
            Áp dụng
          </button>
        </div>
      </div>
    </section>
  );
}
