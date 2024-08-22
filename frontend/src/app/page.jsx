"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function ImageProcessor() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [x1, setX1] = useState(0);
    const [y1, setY1] = useState(0);
    const [x2, setX2] = useState(100);
    const [y2, setY2] = useState(100);
    const [method, setMethod] = useState('telea');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('x1', x1);
        formData.append('y1', y1);
        formData.append('x2', x2);
        formData.append('y2', y2);
        formData.append('method', method);

        try {
            const response = await axios.post(
                'http://localhost:5000/remove-object',
                formData,
                {
                    responseType: 'blob',
                }
            );

            const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setProcessedImage(imageUrl);
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    return (
        <div>
            <h1>Image Object Removal</h1>
            <input type="file" onChange={handleFileChange} />
            <div>
                <label>
                    X1: <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} />
                </label>
                <label>
                    Y1: <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} />
                </label>
                <label>
                    X2: <input type="number" value={x2} onChange={(e) => setX2(e.target.value)} />
                </label>
                <label>
                    Y2: <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} />
                </label>
                <label>
                    Method:
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                        <option value="telea">Telea</option>
                        <option value="ns">Navier-Stokes</option>
                    </select>
                </label>
            </div>
            <button onClick={handleSubmit}>Remove Object</button>

            {processedImage && (
                <div>
                    <h2>Processed Image:</h2>
                    <img src={processedImage} alt="Processed" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
}
