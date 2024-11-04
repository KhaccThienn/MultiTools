import React, { useContext, useState } from "react";
import { ImageContext } from "@/context/ImageContext";
import "../css/menuEditor.css";
import { FaRobot, FaTimes, FaSpinner } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { MdFaceRetouchingNatural } from "react-icons/md";

export default function Retouch() {
  const { handleRetouchSkin } =
    useContext(ImageContext);
  const [loading, setLoading] = useState(false);



  const handleClick = async () => {
    setLoading(true);
    try {
      await handleRetouchSkin();
    } catch (error) {
      console.error("Lỗi khi xóa nền:", error);
    }
    setLoading(false);
  };




  return (
    <section className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Làm đẹp
        <button onClick={() => {}} className="icon-cancel" id="icon-cancel">
          <FaTimes />
        </button>
      </div>
      <div className="splitter"></div>
      <div className="box--basic" onClick={handleClick}>
        {loading ? (
          <>
            <FaSpinner className="removebg-icon spinner" /> Đang sửa ảnh...
          </>
        ) : (
          <>
            <MdFaceRetouchingNatural className="removebg-icon" /> Làm đẹp cơ bản
          </>
        )}
      </div>
    </section>
  );
}
