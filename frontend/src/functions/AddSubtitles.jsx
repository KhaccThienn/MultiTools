// AddSubtitlesComponent.jsx

import React, { useState, useContext } from 'react';
import { VideoContext } from '@/context/VideoContext';
import axios from 'axios';
import "../css/app.css";
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { MdOutlineGeneratingTokens } from 'react-icons/md';
import InputFile from '@/components/InputFile';
import AddFile from '@/components/AddFile';

const AddSubtitles = () => {
  const { currentVideo, setSubtitlesFile, handleApplySubtitles,isProcessing  } = useContext(VideoContext);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState("normal");
  const [error, setError] = useState(null);

  const handleSubtitleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubtitleFile(file);
    }
  };

  const handleGenerateSubtitles = async (selectedOption) => {
    if (!currentVideo) {
      alert('Vui lòng tải lên video trước');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
  
    try {
      if (currentVideo instanceof File) {
        // Nếu currentVideo là đối tượng File
        formData.append('video', currentVideo);
      } else if (typeof currentVideo === 'string' && currentVideo.startsWith('blob:')) {
        // Nếu currentVideo là blob URL, chuyển đổi thành tệp
        const response = await fetch(currentVideo);
        const blob = await response.blob();
        const videoFile = new File([blob], 'video.mp4', { type: blob.type });
        formData.append('video', videoFile);
      } else if (typeof currentVideo === 'string' && currentVideo.startsWith('http')) {
        // Nếu currentVideo là URL của tệp video trên máy chủ
        formData.append('video_url', currentVideo);
      } else {
        alert('Định dạng video không hợp lệ');
        return;
      }
  
      // Chọn endpoint dựa trên option
      const endpoint =
        selectedOption === 'premium'
          ? 'http://localhost:5000/generate-subtitles-premium'
          : 'http://localhost:5000/generate-subtitles';
  
      const res = await axios.post(endpoint, formData, {
        // Loại bỏ 'Content-Type' header để Axios tự thiết lập
        responseType: 'blob', // Để nhận tệp VTT dưới dạng Blob
      });
  
      const contentType = res.headers['content-type'];
  
      if (
        contentType.includes('text/vtt') ||
        contentType.includes('application/x-subrip') ||
        contentType.includes('text/plain')
      ) {
        // Xử lý phản hồi là tệp phụ đề
        const subtitlesBlob = new Blob([res.data], { type: contentType });
        const subtitlesFile = new File([subtitlesBlob], 'subtitles.vtt', { type: contentType });
        setSubtitlesFile(subtitlesFile);
        alert('Đã tạo phụ đề thành công');
      } else if (contentType.includes('application/json')) {
        // Xử lý phản hồi là JSON (có thể là lỗi)
        const errorText = await res.data.text();
        const errorData = JSON.parse(errorText);
        console.error('Lỗi khi tạo phụ đề:', errorData.error);
        alert('Đã xảy ra lỗi khi tạo phụ đề: ' + (errorData.error || 'Unknown error'));
        setError(errorData.error || 'Unknown error');
      } else {
        // Loại content-type không xác định
        console.error('Loại phản hồi không xác định:', contentType);
        alert('Đã xảy ra lỗi khi tạo phụ đề');
        setError('Đã xảy ra lỗi khi tạo phụ đề');
      }
    } catch (error) {
      console.error('Lỗi khi tạo phụ đề:', error);
  
      if (error.response) {
        // Server trả về phản hồi lỗi
        const contentType = error.response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorText = await error.response.data.text();
            const errorData = JSON.parse(errorText);
            alert('Đã xảy ra lỗi khi tạo phụ đề: ' + (errorData.error || 'Unknown error'));
            setError(errorData.error || 'Unknown error');
          } catch (e) {
            console.error('Lỗi parse JSON:', e);
            alert('Đã xảy ra lỗi khi tạo phụ đề');
            setError('Đã xảy ra lỗi khi tạo phụ đề');
          }
        } else {
          alert('Đã xảy ra lỗi khi tạo phụ đề');
          setError('Đã xảy ra lỗi khi tạo phụ đề');
        }
      } else {
        alert('Đã xảy ra lỗi khi tạo phụ đề');
        setError('Đã xảy ra lỗi khi tạo phụ đề');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSubtitleFile = () => {
    if (!subtitleFile) {
      alert('Vui lòng chọn tệp phụ đề');
      return;
    }

    setSubtitlesFile(subtitleFile); // Lưu trữ đối tượng File
    alert('Đã thêm tệp phụ đề');
  }

  const handleOptionClick = (option) => () => {
    setOptions(option);
    handleGenerateSubtitles(option);
  };

  const handleClose = () => {
    // Thêm chức năng đóng component nếu cần
  };

  return (
    <div className="tool-drawer">
      <div className="tool-name">
        <div></div>
        Thêm phụ đề
        <button onClick={handleClose} className="icon-cancel" id="icon-cancel">
          <FaTimes />
        </button>
      </div>
      <div className="splitter"></div>

      <div className="box--basic" onClick={handleOptionClick("normal")}>
        {loading ? (
          <>
            <FaSpinner className="removebg-icon spinner" /> Đang tạo...
          </>
        ) : (
          <>
            <MdOutlineGeneratingTokens className="removebg-icon" /> Tạo phụ đề V1
          </>
        )}
      </div>

      <div className="box--basic" onClick={handleOptionClick("premium")}>
        {loading ? (
          <>
            <FaSpinner className="removebg-icon spinner" /> Đang tạo...
          </>
        ) : (
          <>
            <MdOutlineGeneratingTokens className="removebg-icon" /> Tạo phụ đề V2
          </>
        )}
      </div>
      <div className="bottom-content">
        <div className="action-btn">
          <button id="crop-action-cancel" onClick={{}}>
            Hủy
          </button>
          {
            isProcessing ? (
              <button id="crop-action-apply" disabled style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <FaSpinner className="removebg-icon spinner" /> Áp dụng
              </button>
            ) : (
              <button id="crop-action-apply" onClick={handleApplySubtitles}>
                Áp dụng
              </button>
            )
          }
        </div>
      </div>

    </div>
  );
};

export default AddSubtitles;
