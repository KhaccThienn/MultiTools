import { ImageContext } from '@/context/ImageContext';
import React, { useContext, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { MdFaceRetouchingNatural } from 'react-icons/md';
import "../css/menuEditor.css";


export default function TextToImage() {
    const { handleTextToImage } = useContext(ImageContext);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateImage = async () => {
        setLoading(true);
        setError(null);
        try {
            await handleTextToImage(text);
        } catch (err) {
            setError("Failed to generate image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập văn bản"
                style={{color: 'black', margin:"20px", padding: "5px", width: "80%"}}
            />
            <div className="box--basic" onClick={generateImage}>
        {loading ? (
          <>
            <FaSpinner className="removebg-icon spinner" /> Đang chuyển...
          </>
        ) : (
          <>
            <MdFaceRetouchingNatural className="removebg-icon" /> Chuyển thành hình ảnh
          </>
        )}
      </div>
        </>
    );
}
