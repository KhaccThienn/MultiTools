import React, { useState } from 'react';
import '../css/profile.css';
import Image from 'next/image';
import images from "@/constants/images"; 

const ChangeAvatar = ({onAvatarChange}) => {
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar')); // Đặt ảnh mặc định là ảnh dog

  // Danh sách các ảnh đại diện mặc định
  const defaultAvatars = [
    images.dog, 
    images.fox, 
    images.lion, 
    images.gorrila, 
    images.koala, 
    images.rabbit, 
    images.tiger, 
    images.otter,
  ];

  // Hàm xử lý khi người dùng chọn ảnh mới
  const handleAvatarChange = (imageUrl) => {
    setAvatar(imageUrl); // Cập nhật ảnh mới
    console.log(avatar);
  };

  //Lưu ảnh khi bấm confirm
  const handleConfirm = async () => {
    localStorage.setItem('avatar', avatar);
    onAvatarChange(avatar);
    
    const token = localStorage.getItem('token'); // Lấy token xác thực từ localStorage
    try {
      const response = await fetch('http://localhost:4000/updateUserInfo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Gửi token để xác thực
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'changeAvatar',
          newAvatar: avatar,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Avatar updated successfully!');
      } else {
        alert('Failed to update avatar');
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };


  return (
    <div>
      <div className="avatar-edit-options">
        <h3>Chọn ảnh đại diện:</h3>
        
        {/* Hiển thị ảnh đại diện hiện tại */}
        <Image
          src={avatar}
          alt="Selected Avatar"
          width={100}
          height={100}
          className="selected-avatar"
          style={{ borderRadius: '50%' }}
        />

        <div className="default-avatars">
          {defaultAvatars.map((src, index) => (
            <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
              {/* Sử dụng Image của next.js */}
              <Image
                src={src}
                alt={'fuck'}
                width={80}
                height={80}
                className="default-avatar"
                style={{ cursor: 'pointer', borderRadius: '50%' }}
                onClick={() => handleAvatarChange(src.src)} // Khi click vào ảnh sẽ thay đổi ảnh đại diện
              />
            </div>
          ))}
        </div>
        {/* Input chọn file từ máy tính */}
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => handleAvatarChange(URL.createObjectURL(e.target.files[0]))} // Xử lý thay đổi ảnh khi chọn file
        />
        <button className='confirm-button' onClick={handleConfirm}> Confirm </button>
      </div>
    </div>
  );
};

export default ChangeAvatar;
