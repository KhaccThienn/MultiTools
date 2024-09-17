import React from 'react';
import '../app/globals.css';
import MenuEditor from '@/components/MenuEditor';
import FooterEditor from '@/components/FooterEditor';

export default function ImageEditorPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Phần header */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Phần bên trái */}
        <div style={{ width: '400px', backgroundColor: 'red' }}>
          <MenuEditor />
        </div>
        {/* Phần còn lại */}
        <div style={{ flex: 1, backgroundColor: 'blue' }}>
          {/* Nội dung */}
        </div>
      </div>
      {/* Phần dưới cùng */}
      <div style={{ height: '50px', backgroundColor: 'green' }}>
        <FooterEditor />
      </div>
    </div>
  );
}
