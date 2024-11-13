// AddSubtitlesComponent.jsx

import React, { useState, useContext } from 'react';
import { VideoContext } from '@/context/VideoContext';
import axios from 'axios';
import "../css/app.css";
import { FaTimes } from 'react-icons/fa';

const AddSubtitlesComponent = () => {
  const { currentVideo, setSubtitlesFile } = useContext(VideoContext);
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
      if (currentVideo.startsWith('http')) {
        // Nếu currentVideo là URL của tệp video trên máy chủ
        formData.append('video_url', currentVideo);
      } else {
        // Nếu currentVideo là Blob URL, chuyển đổi thành tệp
        const response = await fetch(currentVideo);
        const blob = await response.blob();
        const videoFile = new File([blob], 'video.mp4', { type: blob.type });
        formData.append('video', videoFile);
      }

      // Chọn endpoint dựa trên option
      const endpoint = selectedOption === "premium" 
        ? 'http://localhost:5000/generate-subtitles' 
        : 'http://localhost:5000/generate-subtitles-normal';

      const res = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Để nhận tệp VTT dưới dạng Blob
      });

      const contentType = res.headers['content-type'];

      if (contentType.includes('text/vtt') || contentType.includes('application/x-subrip') || contentType.includes('text/plain')) {
        // Xử lý phản hồi là tệp phụ đề
        const subtitlesBlob = new Blob([res.data], { type: contentType });
        const subtitlesURL = URL.createObjectURL(subtitlesBlob);
        setSubtitlesFile(subtitlesURL);
        alert('Đã tạo phụ đề thành công');
      } else if (contentType.includes('application/json')) {
        // Xử lý phản hồi là JSON (có thể là lỗi)
        const text = await res.data.text();
        const errorData = JSON.parse(text);
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
            const errorData = JSON.parse(await error.response.data.text());
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

    const subtitlesURL = URL.createObjectURL(subtitleFile);
    setSubtitlesFile(subtitlesURL);
    alert('Đã thêm tệp phụ đề');
  };

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
      
      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={handleOptionClick("normal")} 
          disabled={loading}
          className={`subtitle-button ${options === "normal" ? "active" : ""}`}
        >
          {loading && options === "normal" ? 'Đang tạo phụ đề...' : 'Tạo phụ đề thông thường'}
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleOptionClick("premium")} 
          disabled={loading}
          className={`subtitle-button ${options === "premium" ? "active" : ""}`}
        >
          {loading && options === "premium" ? 'Đang tạo phụ đề...' : 'Tạo phụ đề tự động'}
        </button>
      </div>

      <div>
        <label htmlFor="subtitle-upload">
          Chọn tệp phụ đề:
          <input
            type="file"
            id="subtitle-upload"
            accept=".srt,.vtt"
            onChange={handleSubtitleUpload}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <button onClick={handleAddSubtitleFile} style={{ marginLeft: '10px' }} disabled={!subtitleFile}>
          Thêm tệp phụ đề
        </button>
      </div>
    </div>
  );
};

export default AddSubtitlesComponent;
