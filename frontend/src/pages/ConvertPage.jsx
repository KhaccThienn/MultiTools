import { useState, useEffect, useContext } from "react";
import ThemeContext from "@/constants/themes/ThemeContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import "../css/app.css";
import "../app/globals.css";
import "../css/convert.css";
import InputFile from "@/components/InputFile";
import { FaCaretRight } from "react-icons/fa";

export default function ConvertPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Image");
  const [outputFormat, setOutputFormat] = useState("png"); // Output format state
  const [converting, setConverting] = useState(false); // Conversion status
  const [fileURL, setFileURL] = useState(null); // File URL for client-side use

  const options = ["Image", "Audio", "Video"];

  useEffect(() => {
    setFile(null);
    setFileURL(null);
    // Set default output formats based on selected option
    if (selectedOption === "Image") {
      setOutputFormat("png");
    } else if (selectedOption === "Audio") {
      setOutputFormat("mp3");
    } else if (selectedOption === "Video") {
      setOutputFormat("mp4");
    }
  }, [selectedOption]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && showNavbar) {
        setShowNavbar(false);
      } else if (window.scrollY < lastScrollY && !showNavbar) {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, showNavbar]);

  // Set the file URL when the file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);

      // Clean up the URL object when the component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleFormatChange = (event) => {
    setOutputFormat(event.target.value);
  };

  const handleDownload = async () => {
    if (!file) return;

    setConverting(true);

    try {
      if (selectedOption === "Image") {
        // Image conversion code
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            let mimeType = "";
            if (outputFormat === "png") {
              mimeType = "image/png";
            } else if (outputFormat === "jpg" || outputFormat === "jpeg") {
              mimeType = "image/jpeg";
            } else if (outputFormat === "webp") {
              mimeType = "image/webp";
            } else {
              alert("Format not supported for conversion.");
              return;
            }

            const dataURL = canvas.toDataURL(mimeType);

            const a = document.createElement("a");
            a.href = dataURL;
            a.download = `converted_image.${outputFormat}`;
            a.click();
          };
          img.src = e.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        // For Audio and Video, upload to the server for conversion
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", outputFormat);

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Conversion failed.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted.${outputFormat}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during conversion.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <title>MultiTools | Công cụ chỉnh sửa đa năng</title>
      <div className={`head ${showNavbar ? "show" : "hide"}`}>
        <Navbar toggleTheme={toggleTheme} theme={theme} />
      </div>
      <div className="convert__body">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className="convert__box-title">
            Chuyển định dạng với mọi loại tệp:
          </h1>

          <button
            onClick={toggleDropdown}
            className="convert__box-title"
            style={{
              paddingLeft: "10px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {selectedOption}
            <FaCaretRight />
            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "-70px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  fontSize: "1rem",
                  fontWeight: "normal",
                }}
              >
                {options.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg select-none"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </button>
        </div>
          {/* Des mục đích */}
          <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}>
            <h1
            style={{
              width: "50%",
              textAlign: "center",
            }}
            >
            Chuyển đổi hình ảnh, âm thanh và video sang các định dạng khác nhau
            mà bạn chọn. Chọn loại tệp bạn muốn chuyển đổi, tải lên tệp của bạn,
            chọn định dạng đầu ra và nhấn nút "Tải xuống" để chuyển đổi và tải
            xuống tệp đã chọn.
            </h1>
          </div>
        <div className="convert__box">
          {file ? (
            <div
              className="convert__box-col"
              style={{
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div className="convert__box__file">
                {selectedOption === "Image" && fileURL ? (
                  <img
                    src={fileURL}
                    alt="file"
                    className="convert__file-image"
                  />
                ) : (
                  <p>{file.name}</p>
                )}
              </div>
              <form className="form">
                {selectedOption === "Image" && (
                  // ... Image format options
                  <>
                    <label htmlFor="png">PNG</label>
                    <input
                      id="png"
                      type="radio"
                      name="outputFormat"
                      value="png"
                      checked={outputFormat === "png"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="jpg">JPG</label>
                    <input
                      id="jpg"
                      type="radio"
                      name="outputFormat"
                      value="jpg"
                      checked={outputFormat === "jpg"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="jpeg">JPEG</label>
                    <input
                      id="jpeg"
                      type="radio"
                      name="outputFormat"
                      value="jpeg"
                      checked={outputFormat === "jpeg"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="webp">WEBP</label>
                    <input
                      id="webp"
                      type="radio"
                      name="outputFormat"
                      value="webp"
                      checked={outputFormat === "webp"}
                      onChange={handleFormatChange}
                    />
                  </>
                )}
                {selectedOption === "Audio" && (
                  // ... Audio format options
                  <>
                    <label htmlFor="mp3">MP3</label>
                    <input
                      id="mp3"
                      type="radio"
                      name="outputFormat"
                      value="mp3"
                      checked={outputFormat === "mp3"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="wav">WAV</label>
                    <input
                      id="wav"
                      type="radio"
                      name="outputFormat"
                      value="wav"
                      checked={outputFormat === "wav"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="aac">AAC</label>
                    <input
                      id="aac"
                      type="radio"
                      name="outputFormat"
                      value="aac"
                      checked={outputFormat === "aac"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="ogg">OGG</label>
                    <input
                      id="ogg"
                      type="radio"
                      name="outputFormat"
                      value="ogg"
                      checked={outputFormat === "ogg"}
                      onChange={handleFormatChange}
                    />
                  </>
                )}
                {selectedOption === "Video" && (
                  // ... Video format options
                  <>
                    <label htmlFor="mp4">MP4</label>
                    <input
                      id="mp4"
                      type="radio"
                      name="outputFormat"
                      value="mp4"
                      checked={outputFormat === "mp4"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="avi">AVI</label>
                    <input
                      id="avi"
                      type="radio"
                      name="outputFormat"
                      value="avi"
                      checked={outputFormat === "avi"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="mkv">MKV</label>
                    <input
                      id="mkv"
                      type="radio"
                      name="outputFormat"
                      value="mkv"
                      checked={outputFormat === "mkv"}
                      onChange={handleFormatChange}
                    />
                    <label htmlFor="webm">WEBM</label>
                    <input
                      id="webm"
                      type="radio"
                      name="outputFormat"
                      value="webm"
                      checked={outputFormat === "webm"}
                      onChange={handleFormatChange}
                    />
                  </>
                )}
              </form>

              <button
                className="convert__box-button"
                onClick={handleDownload}
                disabled={converting}
              >
                {converting ? "Đang chuyển đổi..." : "Tải xuống"}
              </button>
            </div>
          ) : (
            <InputFile setFile={setFile} type={selectedOption} />
          )}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
