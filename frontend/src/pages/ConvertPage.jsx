/* pages/ConvertPage.jsx */
import { useState, useEffect, useRef, useContext } from "react";
import ThemeContext from "@/constants/themes/ThemeContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { FaRegFolderOpen } from "react-icons/fa6";
import "../css/app.css";
import "../app/globals.css";

export default function ConvertPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("");

  const contentRef = useRef(null);
  const containerRefs = useRef([]);

  containerRefs.current = [];

  const addToRefs = (el) => {
    if (el && !containerRefs.current.includes(el)) {
      containerRefs.current.push(el);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    containerRefs.current.forEach((container) => {
      if (container) observer.observe(container);
    });

    return () => {
      containerRefs.current.forEach((container) => {
        if (container) observer.unobserve(container);
      });
    };
  }, []);

  const convertMenu = [
    {
      id: 1,
      title: "Chuyển đổi ảnh",
      description: "Chuyển đổi ảnh sang các định dạng khác nhau",
      availableFormats: ["PNG", "JPG", "JPEG", "GIF", "SVG", "TIFF"],
    },
    // Các loại chuyển đổi khác có thể thêm vào đây
  ];

  const currentMenu = convertMenu[0]; // Giả sử hiện tại đang làm việc với chuyển đổi ảnh

  // Hàm xử lý khi người dùng chọn tệp tin
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Tự động đặt định dạng đầu ra theo định dạng của tệp được chọn
    if (file) {
      const fileExtension = file.name.split(".").pop().toUpperCase();
      if (currentMenu.availableFormats.includes(fileExtension)) {
        setOutputFormat(fileExtension);
      } else {
        setOutputFormat("");
      }
    }
  };

  // Hàm xử lý khi người dùng chọn định dạng
  const handleFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };

  // Hàm xử lý khi người dùng nhấn nút "Chuyển đổi"
  const handleConvert = () => {
    if (selectedFile && outputFormat) {
      alert(`Đang chuyển đổi ${selectedFile.name} sang định dạng ${outputFormat}`);
    } else {
      alert("Vui lòng chọn tập tin và định dạng!");
    }
  };

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

  return (
    <>
      <div className={`head ${showNavbar ? "show" : "hide"}`}>
        <Navbar toggleTheme={toggleTheme} theme={theme}/>
      </div>

      <div className="body__convert">
        <h1 className="title__convert">{currentMenu.title}</h1>
        <p className="description__convert">{currentMenu.description}</p>
        <div className="box__convert">
          <div className="select__convert">
            {selectedFile ? (
              <div className="selected-file">
                <span>{selectedFile.name}</span>
                <div className="format-select-container">
                  <label htmlFor="formatSelect">Đến</label>
                  <select
                    id="formatSelect"
                    value={outputFormat}
                    onChange={handleFormatChange}
                    style={{ marginLeft: "10px" }}
                  >
                    <option value="">...</option>
                    {currentMenu.availableFormats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleConvert}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Chuyển đổi
                </button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="fileInput"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    padding: "10px 20px",
                    backgroundColor: "#ff3333",
                    color: "#fff",
                    borderRadius: "5px",
                    alignItems: "center",
                  }}
                >
                  Chọn Tập Tin <FaRegFolderOpen style={{ marginLeft: "5px" }} />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div ref={addToRefs} className="fade-in-section">
        <Footer />
      </div>
    </>
  );
}
