import React, {useContext} from 'react';
import '../css/edit.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ImageContext } from '@/context/ImageContext';
import { useZoom } from '@/context/ZoomContext';

function FooterEditor() {
  const {undo, redo, canUndo, canRedo, applyEdit} = useContext(ImageContext);
  const {zoomIn, zoomOut,resetTransform, scale, positionX, positionY} = useZoom();
  
  return (
    <div className="toolbar">
      <div className='ajust-size-section' >
        <button className="icon-button" onClick={zoomIn}>
          <i className="fa fa-search-minus"></i>
        </button>
        <span className="zoom-text">{scale ? scale.toFixed(2) : '1.00'}</span>
        <button className="icon-button" onClick={zoomOut}>
         <i className="fa fa-search-plus"></i>
        </button>
      </div>
      <div className='undo-redo-section'>
        <button className="toolbar-button" onClick={undo} disabled={!canUndo}>
          <span className="zoom-text">HOÀN TÁC</span>
          <i className="fas fa-undo icon-custom"></i>
        </button>
        <button className="toolbar-button" onClick={redo} disabled={!canRedo}>
          <i className="fas fa-redo icon-custom"></i>
          <span className="zoom-text">HOÀN LẠI</span>
        </button>
      </div>
      <button className="toolbar-button close">
       <span>Đóng</span>
      </button>  
      <button className="toolbar-button save-button">
        <i className="fa-solid fa-download"></i>
       <span>Lưu</span> 
      </button>
    </div>
  );
}

export default FooterEditor;

