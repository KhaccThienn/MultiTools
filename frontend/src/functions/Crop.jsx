// export default function Crop() {
//     return (
//         <div>
//             <h1>Crop</h1>
//         </div>
//     )
// }

import React, { useState, useRef } from 'react';

export default function Crop({ image, onCrop, onUndo, onRedo, onSave }) {
  const [cropData, setCropData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const cropRef = useRef(null);

  const handleCrop = () => {
    
    setCropData(croppedData);

    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, croppedData]);
    setHistoryIndex(historyIndex + 1);

    if (onCrop) {
      onCrop(croppedData);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCropData(history[historyIndex - 1]);

      if (onUndo) {
        onUndo(history[historyIndex - 1]);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCropData(history[historyIndex + 1]);

      if (onRedo) {
        onRedo(history[historyIndex + 1]);
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(cropData);
    }
  };

  return (
    <div>
      <div>
        {/* <img ref={cropRef} src={image} alt="Selected" style={{ maxWidth: '100%' }} /> */}
        <div>
          {/* Nút chức năng */}
          <button onClick={handleCrop}>Crop</button>
          <button onClick={handleUndo} disabled={historyIndex <= 0}>Undo</button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1}>Redo</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
