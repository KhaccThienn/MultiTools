import React, { useContext, useState } from 'react';
import { ImageContext } from '@/context/ImageContext';
import '../css/menuEditor.css';
import { FaRobot, FaTimes, FaSpinner} from 'react-icons/fa';

export default function RemoveBackground() {
  const { handleRemoveBackground } = useContext(ImageContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true); // Bắt đầu loading khi xử lý
    try {
      await handleRemoveBackground(); // Gọi hàm xóa nền
    } catch (error) {
      console.error("Lỗi khi xóa nền:", error);
    }
    setLoading(false); // Kết thúc loading sau khi hoàn tất
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
    <div className="box__remove--basic" onClick={handleClick}>
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
  </section>
  );
}
