import React from 'react';
import '../css/edit.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function FooterEditor() {
  return (
    <div className="toolbar">
      <div className='ajust-size-section'>
        <button className="icon-button">
          <i className="fa fa-search-minus"></i>
        </button>
        <span className="zoom-text">52%</span>
        <button className="icon-button">
         <i className="fa fa-search-plus"></i>
        </button>
      </div>
      <div className='undo-redo-section'>
        <button className="toolbar-button">
          <span className="zoom-text">HOÀN TÁC</span>
          <i className="fas fa-undo icon-custom"></i>
        </button>
        <button className="toolbar-button">
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

